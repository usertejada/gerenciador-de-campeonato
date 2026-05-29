import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/sidebar-context";
import { MainContent } from "@/components/main-content";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChampionSystem",
  description: "Gestão de Campeonatos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} bg-[#F1F3F7]`}>
        <SidebarProvider>
          <Sidebar userName="Tejada" userRole="Administrador" />
          <MainContent>{children}</MainContent>
        </SidebarProvider>
      </body>
    </html>
  );
}