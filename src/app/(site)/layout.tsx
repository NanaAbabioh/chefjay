import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

/**
 * The storefront shell. Everything a customer sees is inside this group; the
 * dashboard sits outside it and brings its own chrome, so the two never bleed
 * into one another. The cart provider lives here too — /admin has no cart.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-palm focus:px-5 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
