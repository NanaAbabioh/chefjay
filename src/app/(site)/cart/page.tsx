import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Section";
import { CartClient } from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Your order",
  description: "Review your drinks and send us your order.",
};

export default function CartPage() {
  return (
    <Container className="py-14 sm:py-20">
      <Eyebrow>Almost there</Eyebrow>
      <h1 className="mt-4 font-display text-5xl font-semibold">Your order</h1>
      <div className="mt-12">
        <CartClient />
      </div>
    </Container>
  );
}
