import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/site/Header";
import { PromoBar } from "@/components/site/Promo";
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
      {/* The bar and the header pin together. The header carries its own
          `sticky`, but wrapping both means the offer never scrolls away and
          the two can never overlap each other at the top of the page. */}
      <div className="sticky top-0 z-50">
        <PromoBar />
        <Header />
      </div>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
