// app/pendencias/page.tsx

"use client";

import { useState } from "react";
import { AlertTriangle, CreditCard } from "lucide-react";
import CartoesTab from "./_components/CartoesTab";
import PagamentosTab from "./_components/PagamentosTab";

const TABS = [
  { id: "cartoes",    label: "Cartões",    icon: AlertTriangle },
  { id: "pagamentos", label: "Pagamentos", icon: CreditCard    },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function PendenciasPage() {
  const [tab, setTab] = useState<TabId>("cartoes");

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-6 min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between">
        <div>
          <h1 className="text-[#1E293B] font-extrabold text-[22px] lg:text-[28px] leading-tight">
            Pendências
          </h1>
          <p className="text-[#94A3B8] text-[14px] font-normal mt-1">
            Cartões, suspensões e pagamentos em aberto
          </p>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all border ${
              tab === id
                ? "bg-[#4F6BED] text-white border-[#4F6BED] shadow-[0_2px_8px_rgba(79,107,237,0.25)]"
                : "bg-white text-[#64748B] border-[#D1D5DB] hover:border-[#4F6BED] hover:text-[#4F6BED]"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Conteúdo da tab ────────────────────────────────────────────── */}
      {tab === "cartoes"    && <CartoesTab />}
      {tab === "pagamentos" && <PagamentosTab />}

    </div>
  );
}