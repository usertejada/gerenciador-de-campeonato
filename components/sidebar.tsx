"use client";

import { usePathname } from "next/navigation";
import {
  Trophy,
  LayoutDashboard,
  Users,
  Calendar,
  BarChart2,
  Settings,
  Plus,
  Goal,
  Menu,
  CircleAlert,
  X,
  Bell,
  Medal,
  ChevronLeft,
  Clock as ClockIcon,
} from "lucide-react";
import { useSidebar } from "@/components/sidebar-context";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

interface SidebarProps {
  userName?: string;
  userRole?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard",     icon: LayoutDashboard, href: "/" },
  { label: "Campeonatos",   icon: Trophy,           href: "/campeonatos" },
  { label: "Times",         icon: Users,            href: "/times" },
  { label: "Partidas",      icon: Calendar,         href: "/partidas" },
  { label: "Histórico",     icon: ClockIcon,        href: "/historico" },
  { label: "Classificação", icon: Medal,            href: "/classificacao" },
  { label: "Artilheiro",    icon: Goal,            href: "/artilheiro" },
  { label: "Pendências",    icon: CircleAlert,        href: "/pendencias" },
  { label: "Configurações", icon: Settings,         href: "/configuracoes" },
];

function SidebarContent({
  currentPath,
  userName,
  userRole,
  collapsed,
  onClose,
}: {
  currentPath: string;
  userName: string;
  userRole: string;
  collapsed: boolean;
  onClose?: () => void;
}) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 px-4 py-5 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4F6BED] shrink-0">
          <Trophy size={16} color="#FFFFFF" />
        </div>
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ${
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <span className="text-white font-semibold text-sm leading-tight whitespace-nowrap">
            ChampionSystem
          </span>
          <span className="text-[#8B8FA8] text-[11px] leading-tight whitespace-nowrap">
            Gestão de Campeonatos
          </span>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 min-h-0 px-2 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="text-[#8B8FA8] font-semibold text-[10px] tracking-[0.08em] uppercase mt-6 mb-1 px-2 whitespace-nowrap">
            Navegação
          </p>
        )}
        {collapsed && <div className="mt-6" />}

        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            const linkClass = [
              "flex items-center rounded-lg text-sm font-medium transition-colors",
              collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
              isActive
                ? "bg-[#2D3154] text-white border-l-2 border-[#4F6BED]"
                : "text-[#8B8FA8] hover:bg-[#252847] hover:text-white",
            ].join(" ");

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={linkClass}
                  onClick={onClose}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 ${isActive ? "text-white" : "text-[#8B8FA8]"}`}
                  />
                  {!collapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Ações Rápidas */}
        {!collapsed && (
          <p className="text-[#8B8FA8] font-semibold text-[10px] tracking-[0.08em] uppercase mt-20 mb-1 px-2 whitespace-nowrap">
            Ações Rápidas
          </p>
        )}
        {collapsed && <div className="mt-20" />}

        <button
          title={collapsed ? "Novo Campeonato" : undefined}
          className={[
            "flex items-center w-full bg-[#4F6BED] hover:bg-[#3D5BD9] text-white text-sm font-medium rounded-lg transition-colors",
            collapsed ? "justify-center px-2 py-2.5" : "gap-2 px-3 py-2.5",
          ].join(" ")}
        >
          <Plus size={16} className="shrink-0" />
          {!collapsed && (
            <span className="whitespace-nowrap">Novo Campeonato</span>
          )}
        </button>
      </nav>

      {/* Rodapé */}
      <div className="border-t border-[#2D3154] px-2 py-4 shrink-0">
        <div
          className={[
            "flex items-center",
            collapsed ? "justify-center" : "gap-3 px-2",
          ].join(" ")}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2D3154] shrink-0">
            <span className="text-[#4F6BED] font-bold text-sm">{initial}</span>
          </div>
          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <span className="text-white font-semibold text-[13px] leading-tight whitespace-nowrap">
              {userName}
            </span>
            <span className="text-[#8B8FA8] text-[11px] leading-tight whitespace-nowrap">
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  userName = "Admin",
  userRole = "Administrador",
}: SidebarProps) {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const currentPath = usePathname();

  const currentPageLabel =
    navItems.find((item) => item.href === currentPath)?.label ?? "Dashboard";

  return (
    <div>
      {/* ── DESKTOP ─────────────────────────────────────────────── */}
      <aside
        style={{ height: "100dvh" }}
        className={[
          "hidden lg:flex flex-col fixed left-0 top-0 bg-[#1E2139] border-r border-[#2D3154] z-40 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
        ].join(" ")}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#4F6BED] shadow-md flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <ChevronLeft
            size={14}
            color="#FFFFFF"
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <SidebarContent
          currentPath={currentPath}
          userName={userName}
          userRole={userRole}
          collapsed={collapsed}
        />
      </aside>

      {/* ── MOBILE ──────────────────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Header fixo */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#1E2139] border-b border-[#2D3154] flex items-center justify-between px-4 z-40">
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              setMobileOpen(true);
            }}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-md hover:bg-[#252847] active:bg-[#252847] transition-colors"
            aria-label="Abrir menu"
            type="button"
          >
            <Menu size={22} color="#FFFFFF" />
          </button>

          <span className="text-white font-semibold text-base">
            {currentPageLabel}
          </span>

          <button
            className="flex items-center justify-center w-10 h-10 -mr-2 rounded-md hover:bg-[#252847] active:bg-[#252847] transition-colors"
            aria-label="Notificações"
            type="button"
          >
            <Bell size={22} color="#FFFFFF" />
          </button>
        </header>

        {/* Overlay — sempre no DOM, animado com opacity */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-black/60 transition-opacity duration-300"
          style={{
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? "auto" : "none",
          }}
          onPointerDown={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <aside
          className="fixed top-0 left-0 w-64 bg-[#1E2139] flex flex-col transition-transform duration-300 ease-in-out z-[60]"
          style={{
            height: "100dvh",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            pointerEvents: mobileOpen ? "auto" : "none",
          }}
        >
          <button
            onPointerDown={() => setMobileOpen(false)}
            className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-md hover:bg-[#252847] active:bg-[#252847] transition-colors"
            aria-label="Fechar menu"
            type="button"
          >
            <X size={18} color="#8B8FA8" />
          </button>

          <SidebarContent
            currentPath={currentPath}
            userName={userName}
            userRole={userRole}
            collapsed={false}
            onClose={() => setMobileOpen(false)}
          />
        </aside>
      </div>
    </div>
  );
}