// app/pendencias/_components/PagamentosTab.tsx

"use client";

import { useState, useMemo } from "react";
import { DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────────────────────
type StatusPagamento = "Pendente" | "Atrasado" | "Pago";

interface Pagamento {
  id: number;
  responsavel: string;   // pode ser o jogador ou o time
  time: string;
  escudo: string;
  descricao: string;
  campeonato: string;
  valor: number;
  vencimento: string;
  status: StatusPagamento;
}

// ── Mock ─────────────────────────────────────────────────────────────────────
const PAGAMENTOS_MOCK: Pagamento[] = [
  { id: 1,  responsavel: "Águias SC",      time: "Águias SC",    escudo: "🦅", descricao: "Inscrição Copa Verão 2025",   campeonato: "Copa Verão 2025",   valor: 350.00, vencimento: "15/05/2025", status: "Atrasado" },
  { id: 2,  responsavel: "Tubarões FC",    time: "Tubarões FC",  escudo: "🦈", descricao: "Taxa de arbitragem — R7",     campeonato: "Liga Empresarial",  valor: 80.00,  vencimento: "28/05/2025", status: "Pendente" },
  { id: 3,  responsavel: "Trovões EC",     time: "Trovões EC",   escudo: "⚡", descricao: "Multa cartão vermelho",       campeonato: "Torneio Relâmpago", valor: 120.00, vencimento: "01/06/2025", status: "Pendente" },
  { id: 4,  responsavel: "Panteras FC",    time: "Panteras FC",  escudo: "🐆", descricao: "Inscrição Liga Empresarial",  campeonato: "Liga Empresarial",  valor: 350.00, vencimento: "10/05/2025", status: "Atrasado" },
  { id: 5,  responsavel: "Leões FC",       time: "Leões FC",     escudo: "🦁", descricao: "Taxa de arbitragem — R8",     campeonato: "Copa da Cidade",    valor: 80.00,  vencimento: "02/06/2025", status: "Pendente" },
  { id: 6,  responsavel: "Dragões SC",     time: "Dragões SC",   escudo: "🐉", descricao: "Multa suspensão",             campeonato: "Copa Verão 2025",   valor: 60.00,  vencimento: "30/05/2025", status: "Pago"     },
  { id: 7,  responsavel: "Falcões EC",     time: "Falcões EC",   escudo: "🦆", descricao: "Inscrição Copa da Cidade",    campeonato: "Copa da Cidade",    valor: 350.00, vencimento: "05/05/2025", status: "Atrasado" },
  { id: 8,  responsavel: "Lobos SC",       time: "Lobos SC",     escudo: "🐺", descricao: "Taxa de arbitragem — R9",     campeonato: "Copa Verão 2025",   valor: 80.00,  vencimento: "03/06/2025", status: "Pendente" },
  { id: 9,  responsavel: "Rafael Souza",   time: "Tubarões FC",  escudo: "🦈", descricao: "Taxa doc. pendente",          campeonato: "Copa Verão 2025",   valor: 40.00,  vencimento: "25/05/2025", status: "Atrasado" },
  { id: 10, responsavel: "Diego Martins",  time: "Trovões EC",   escudo: "⚡", descricao: "Multa cartão vermelho",       campeonato: "Liga Empresarial",  valor: 120.00, vencimento: "29/05/2025", status: "Pago"     },
];

// ── Utilitários ───────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusPagamento, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  Pendente: { label: "Pendente", bg: "bg-[#FEF9C3]", text: "text-[#CA8A04]", border: "border-[#FDE047]", icon: Clock         },
  Atrasado: { label: "Atrasado", bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", border: "border-[#FCA5A5]", icon: AlertCircle   },
  Pago:     { label: "Pago",     bg: "bg-[#DCFCE7]", text: "text-[#16A34A]", border: "border-[#86EFAC]", icon: CheckCircle   },
};

function BadgeStatus({ status }: { status: StatusPagamento }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 ${cfg.bg} ${cfg.text} border ${cfg.border} rounded-full px-2 py-0.5 text-[11px] font-semibold`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
const FILTROS: { id: StatusPagamento | "Todos"; label: string }[] = [
  { id: "Todos",    label: "Todos"    },
  { id: "Pendente", label: "Pendente" },
  { id: "Atrasado", label: "Atrasado" },
  { id: "Pago",     label: "Pago"     },
];

export default function PagamentosTab() {
  const [filtro, setFiltro] = useState<StatusPagamento | "Todos">("Todos");

  const lista = useMemo(
    () => filtro === "Todos" ? PAGAMENTOS_MOCK : PAGAMENTOS_MOCK.filter((p) => p.status === filtro),
    [filtro],
  );

  const totalAberto  = PAGAMENTOS_MOCK.filter((p) => p.status !== "Pago").reduce((s, p) => s + p.valor, 0);
  const totalAtrasado = PAGAMENTOS_MOCK.filter((p) => p.status === "Atrasado").reduce((s, p) => s + p.valor, 0);
  const qtdPendente  = PAGAMENTOS_MOCK.filter((p) => p.status === "Pendente").length;

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex flex-col gap-4">

      {/* ── Cards de resumo ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">

        <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center">
              <DollarSign size={13} color="#4F6BED" />
            </div>
            <span className="text-[#64748B] text-[12px] font-medium">Total em aberto</span>
          </div>
          <p className="text-[#1E293B] font-extrabold text-[17px] leading-tight">{fmt(totalAberto)}</p>
        </div>

        <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#FEE2E2] flex items-center justify-center">
              <AlertCircle size={13} color="#DC2626" />
            </div>
            <span className="text-[#64748B] text-[12px] font-medium">Atrasados</span>
          </div>
          <p className="text-[#DC2626] font-extrabold text-[17px] leading-tight">{fmt(totalAtrasado)}</p>
        </div>

        <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#FEF9C3] flex items-center justify-center">
              <Clock size={13} color="#CA8A04" />
            </div>
            <span className="text-[#64748B] text-[12px] font-medium">Pendentes</span>
          </div>
          <p className="text-[#CA8A04] font-extrabold text-[22px] leading-tight">{qtdPendente}</p>
        </div>

      </div>

      {/* ── Filtros ───────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 bg-white border border-[#C4C9D4] rounded-[10px] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.04)] w-fit">
        {FILTROS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            className={`px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all ${
              filtro === id
                ? "bg-[#4F6BED] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tabela ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* Cabeçalho */}
        <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_150px_90px_90px] items-center gap-3 px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
          <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">Responsável / Descrição</span>
          <span className="hidden sm:block text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">Vencimento</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-right">Valor</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Status</span>
        </div>

        {lista.map((p) => (
          <div
            key={p.id}
            className={`grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_150px_90px_90px] items-center gap-3 px-4 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors ${
              p.status === "Atrasado" ? "bg-[#FFF5F5]" : ""
            }`}
          >
            {/* Responsável */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                p.status === "Atrasado"
                  ? "bg-[#FEE2E2] border-[#FCA5A5]"
                  : "bg-[#EEF2FF] border-[#C7D2FE]"
              }`}>
                <span className="text-[16px]">{p.escudo}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[#1E293B] font-semibold text-[13px] truncate">{p.responsavel}</p>
                <p className="text-[#94A3B8] text-[11px] truncate">{p.descricao}</p>
              </div>
            </div>

            {/* Vencimento */}
            <span className={`hidden sm:block text-[12px] ${
              p.status === "Atrasado" ? "text-[#DC2626] font-semibold" : "text-[#64748B]"
            }`}>
              {p.vencimento}
            </span>

            {/* Valor */}
            <span className={`text-right text-[13px] font-bold ${
              p.status === "Pago" ? "text-[#16A34A]" : p.status === "Atrasado" ? "text-[#DC2626]" : "text-[#1E293B]"
            }`}>
              {fmt(p.valor)}
            </span>

            {/* Status */}
            <div className="flex justify-center">
              <BadgeStatus status={p.status} />
            </div>
          </div>
        ))}

        {lista.length === 0 && (
          <div className="py-10 text-center text-[#94A3B8] text-[13px]">
            Nenhum pagamento encontrado.
          </div>
        )}
      </div>

    </div>
  );
}