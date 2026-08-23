import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Relative image and canonical paths below are resolved against this.
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "en_US",
    siteName: site.name,
    images: ["/images/hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/hero.jpg"],
  },
};

/** Tints the phone browser chrome to match the page, so the cream runs edge to
 *  edge instead of butting against a white or grey bar. Matches --color-cream. */
export const viewport: Viewport = {
  themeColor: "#fdf8ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      {/* The storefront chrome — header, cart, footer — lives in the (site)
          group, not here, so /admin does not inherit a shop nav and a cart
          button it has no use for. */}
      <body className="grain flex min-h-full flex-col bg-cream text-bark">
        {children}
      </body>
    </html>
  );
}
