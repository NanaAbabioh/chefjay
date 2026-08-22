"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { itemCount, lineKey, type CartLine } from "@/lib/cart";

const STORAGE_KEY = "vincents.cart.v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  /** False until localStorage has been read, so the server and first client
   * render agree and React doesn't throw a hydration mismatch. */
  ready: boolean;
  add: (slug: string, sizeId: string, qty?: number) => void;
  setQty: (slug: string, sizeId: string, qty: number) => void;
  remove: (slug: string, sizeId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === "object" &&
        l !== null &&
        typeof (l as CartLine).slug === "string" &&
        typeof (l as CartLine).sizeId === "string" &&
        Number.isInteger((l as CartLine).qty),
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // localStorage cannot be read during render: the server has no access to it,
  // so doing it in a lazy initialiser would make the first client render differ
  // from the server HTML and break hydration. Reading it in a mount effect and
  // gating on `ready` is the SSR-safe pattern, so the cascading-render warning
  // is expected here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartContextValue>(() => {
    const update = (
      slug: string,
      sizeId: string,
      next: (current: number) => number,
    ) =>
      setLines((prev) => {
        const key = lineKey(slug, sizeId);
        const found = prev.find((l) => lineKey(l.slug, l.sizeId) === key);
        const qty = Math.min(99, Math.max(0, next(found?.qty ?? 0)));
        if (qty === 0) return prev.filter((l) => lineKey(l.slug, l.sizeId) !== key);
        if (!found) return [...prev, { slug, sizeId, qty }];
        return prev.map((l) =>
          lineKey(l.slug, l.sizeId) === key ? { ...l, qty } : l,
        );
      });

    return {
      lines,
      count: itemCount(lines),
      ready,
      add: (slug, sizeId, qty = 1) => update(slug, sizeId, (c) => c + qty),
      setQty: (slug, sizeId, qty) => update(slug, sizeId, () => qty),
      remove: (slug, sizeId) => update(slug, sizeId, () => 0),
      clear: () => setLines([]),
    };
  }, [lines, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
