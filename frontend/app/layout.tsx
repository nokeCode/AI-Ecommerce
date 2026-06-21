import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RobotChatLauncher from "@/components/RobotChatLauncher";

export const metadata: Metadata = {
  title: "Luxe Boutique — L'excellence artisanale",
  description: "Découvrez notre sélection de produits de luxe artisanaux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <CartProvider>
          <Navbar />
          <RobotChatLauncher />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
