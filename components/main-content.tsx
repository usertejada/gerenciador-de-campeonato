"use client";

import { useSidebar } from "@/components/sidebar-context";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <main
      className={`min-h-screen pt-14 lg:pt-0 transition-all duration-300 ${
        collapsed ? "lg:ml-[72px]" : "lg:ml-64"
      }`}
    >
      {children}
    </main>
  );
}