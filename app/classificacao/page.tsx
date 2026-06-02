// app/classificacao/page.tsx

"use client";

import { useState, useMemo } from "react";
import { Medal, Trophy, ChevronUp, ChevronDown, Minus } from "lucide-react";

const CAMPEONATOS = [
  "Copa Verao 2025",
  "Liga Empresarial",
  "Torneio Relampago",
  "Copa da Cidade",
];

interface Time {
  id: number;
  nome: string;
  escudo: string;
  pg: number;
  j: number;
  v: number;
  e: number;
  d: number;
  gp: number;
  gc: number;
  sg: number;
  variacao: "up" | "down" | "mesmo";
}

const CLASSIFICACAO_MOCK: Record<string, Time[]> = {
  "Copa Verao 2025": [
    { id: 1, nome: "Aguias SC",   escudo: "🦅", pg: 22, j: 8, v: 7, e: 1, d: 0, gp: 20, gc: 6,  sg: 14, variacao: "up" },
    { id: 2, nome: "Tubaroes FC", escudo: "🦈", pg: 18, j: 8, v: 6, e: 0, d: 2, gp: 15, gc: 9,  sg: 6,  variacao: "up" },
    { id: 3, nome: "Leoes FC",    escudo: "🦁", pg: 14, j: 8, v: 4, e: 2, d: 2, gp: 12, gc: 10, sg: 2,  variacao: "mesmo" },
    { id: 4, nome: "Panteras FC", escudo: "🐆", pg: 11, j: 8, v: 3, e: 2, d: 3, gp: 10, gc: 11, sg: -1, variacao: "down" },
    { id: 5, nome: "Dragoes SC",  escudo: "🐉", pg: 8,  j: 8, v: 2, e: 2, d: 4, gp: 8,  gc: 13, sg: -5, variacao: "down" },
    { id: 6, nome: "Trovoes EC",  escudo: "⚡", pg: 6,  j: 8, v: 1, e: 3, d: 4, gp: 7,  gc: 14, sg: -7, variacao: "mesmo" },
    { id: 7, nome: "Falcoes EC",  escudo: "🦆", pg: 4,  j: 8, v: 1, e: 1, d: 6, gp: 5,  gc: 18, sg: -13, variacao: "down" },
    { id: 8, nome: "Lobos SC",    escudo: "🐺", pg: 2,  j: 8, v: 0, e: 2, d: 6, gp: 4,  gc: 20, sg: -16, variacao: "down" },
  ],
  "Liga Empresarial": [
    { id: 4, nome: "Trovoes EC",  escudo: "⚡", pg: 19, j: 7, v: 6, e: 1, d: 0, gp: 18, gc: 5,  sg: 13, variacao: "up" },
    { id: 1, nome: "Aguias SC",   escudo: "🦅", pg: 15, j: 7, v: 5, e: 0, d: 2, gp: 14, gc: 8,  sg: 6,  variacao: "mesmo" },
    { id: 6, nome: "Falcoes EC",  escudo: "🦆", pg: 12, j: 7, v: 4, e: 0, d: 3, gp: 11, gc: 10, sg: 1,  variacao: "up" },
    { id: 8, nome: "Lobos SC",    escudo: "🐺", pg: 9,  j: 7, v: 3, e: 0, d: 4, gp: 9,  gc: 12, sg: -3, variacao: "down" },
    { id: 2, nome: "Leoes FC",    escudo: "🦁", pg: 6,  j: 7, v: 2, e: 0, d: 5, gp: 7,  gc: 15, sg: -8, variacao: "mesmo" },
    { id: 3, nome: "Panteras FC", escudo: "🐆", pg: 3,  j: 7, v: 1, e: 0, d: 6, gp: 5,  gc: 18, sg: -13, variacao: "down" },
  ],
  "Torneio Relampago": [
    { id: 7, nome: "Tubaroes FC", escudo: "🦈", pg: 9,  j: 3, v: 3, e: 0, d: 0, gp: 10, gc: 3,  sg: 7,  variacao: "up" },
    { id: 5, nome: "Trovoes EC",  escudo: "⚡", pg: 6,  j: 3, v: 2, e: 0, d: 1, gp: 7,  gc: 5,  sg: 2,  variacao: "mesmo" },
    { id: 3, nome: "Dragoes SC",  escudo: "🐉", pg: 3,  j: 3, v: 1, e: 0, d: 2, gp: 5,  gc: 8,  sg: -3, variacao: "down" },
    { id: 1, nome: "Lobos SC",    escudo: "🐺", pg: 0,  j: 3, v: 0, e: 0, d: 3, gp: 2,  gc: 11, sg: -9, variacao: "down" },
  ],
  "Copa da Cidade": [
    { id: 1, nome: "Aguias SC",   escudo: "🦅", pg: 10, j: 4, v: 3, e: 1, d: 0, gp: 9,  gc: 3,  sg: 6,  variacao: "up" },
    { id: 2, nome: "Panteras FC", escudo: "🐆", pg: 7,  j: 4, v: 2, e: 1, d: 1, gp: 8,  gc: 5,  sg: 3,  variacao: "up" },
    { id: 3, nome: "Leoes FC",    escudo: "🦁", pg: 5,  j: 4, v: 1, e: 2, d: 1, gp: 5,  gc: 6,  sg: -1, variacao: "mesmo" },
    { id: 4, nome: "Falcoes EC",  escudo: "🦆", pg: 4,  j: 4, v: 1, e: 1, d: 2, gp: 4,  gc: 7,  sg: -3, variacao: "down" },
    { id: 5, nome: "Dragoes SC",  escudo: "🐉", pg: 2,  j: 4, v: 0, e: 2, d: 2, gp: 3,  gc: 8,  sg: -5, variacao: "down" },
  ],
};

function PosicaoBadge({ pos }: { pos: number }) {
  if (pos === 1)
    return (
      <div className="w-7 h-7 rounded-full bg-[#FEF9C3] border border-[#FDE047] flex items-center justify-center shrink-0">
        <span className="text-[#CA8A04] font-extrabold text-[12px]">1</span>
      </div>
    );
  if (pos === 2)
    return (
      <div className="w-7 h-7 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center shrink-0">
        <span className="text-[#64748B] font-extrabold text-[12px]">2</span>
      </div>
    );
  if (pos === 3)
    return (
      <div className="w-7 h-7 rounded-full bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center shrink-0">
        <span className="text-[#C2410C] font-extrabold text-[12px]">3</span>
      </div>
    );
  return (
    <div className="w-7 h-7 flex items-center justify-center shrink-0">
      <span className="text-[#94A3B8] font-semibold text-[13px]">{pos}</span>
    </div>
  );
}

function VariacaoIcon({ v }: { v: "up" | "down" | "mesmo" }) {
  if (v === "up") return <ChevronUp size={14} color="#16A34A" />;
  if (v === "down") return <ChevronDown size={14} color="#EF4444" />;
  return <Minus size={12} color="#94A3B8" />;
}

function EscudoTime({ nome, escudo }: { nome: string; escudo?: string }) {
  const initials = nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const isEmoji = escudo && [...escudo].length <= 2 && /\p{Emoji}/u.test(escudo);
  return (
    <div className="w-8 h-8 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center shrink-0 overflow-hidden">
      {isEmoji ? (
        <span className="text-[16px]">{escudo}</span>
      ) : escudo ? (
        <img src={escudo} alt={nome} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-[#4F6BED] text-[11px]">{initials}</span>
      )}
    </div>
  );
}

export default function ClassificacaoPage() {
  const [campeonato, setCampeonato] = useState(CAMPEONATOS[0]);
  const [abertos, setAbertos] = useState<Set<number>>(new Set());

  const tabela = useMemo(() => {
    setAbertos(new Set());
    return CLASSIFICACAO_MOCK[campeonato] ?? [];
  }, [campeonato]);

  function toggleSanfona(id: number) {
    setAbertos((prev) => {
      const novo = new Set(prev);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between">
        <div>
          <h1 className="text-[#1E293B] font-extrabold text-[22px] lg:text-[28px] leading-tight">
            Classificacao
          </h1>
          <p className="text-[#94A3B8] text-[14px] font-normal mt-1">
            Tabela de pontos por campeonato
          </p>
        </div>
        <div className="relative self-start min-[640px]:self-auto">
          <Trophy size={13} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={campeonato}
            onChange={(e) => setCampeonato(e.target.value)}
            className="h-[38px] pl-8 pr-8 rounded-[8px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[13px] font-medium outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all appearance-none cursor-pointer"
          >
            {CAMPEONATOS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {tabela.slice(0, 3).map((t, i) => (
          <div
            key={t.id}
            className={`bg-white rounded-[12px] border shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3 ${
              i === 0
                ? "border-[#FDE047] shadow-[0_2px_8px_rgba(250,204,21,0.18)]"
                : i === 1
                ? "border-[#CBD5E1]"
                : "border-[#FED7AA]"
            }`}
          >
            <PosicaoBadge pos={i + 1} />
            <EscudoTime nome={t.nome} escudo={t.escudo} />
            <div className="flex-1 min-w-0">
              <p className="text-[#1E293B] font-bold text-[14px] truncate">{t.nome}</p>
              <p className="text-[#94A3B8] text-[12px]">{t.j} jogos · {t.v}V {t.e}E {t.d}D</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[#4F6BED] font-extrabold text-[20px] leading-tight">{t.pg}</span>
              <span className="text-[#94A3B8] text-[10px]">pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela completa */}
      <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* Cabecalho — so desktop/tablet */}
        <div className="hidden sm:grid grid-cols-[32px_1fr_40px_repeat(6,36px)_36px] items-center gap-1 px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
          <div />
          <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">Time</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold text-center">PG</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold text-center">J</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold text-center">V</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold text-center">E</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold text-center">D</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold text-center">GP</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold text-center">GC</span>
          <span className="text-[#94A3B8] text-[11px] font-semibold text-center">SG</span>
        </div>

        {tabela.map((t, i) => {
          const isLider = i === 0;
          const aberto = abertos.has(t.id);

          return (
            <div
              key={t.id}
              className={`border-b border-[#F1F5F9] last:border-0 ${isLider ? "bg-[#FEFCE8]" : ""}`}
            >
              {/* ── DESKTOP / TABLET: linha normal ── */}
              <div className="hidden sm:grid grid-cols-[32px_1fr_40px_repeat(6,36px)_36px] items-center gap-1 px-4 py-3 transition-colors hover:bg-[#F8FAFC]">
                <PosicaoBadge pos={i + 1} />
                <div className="flex items-center gap-2 min-w-0">
                  <EscudoTime nome={t.nome} escudo={t.escudo} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[#1E293B] font-semibold text-[13px] truncate">{t.nome}</span>
                    <VariacaoIcon v={t.variacao} />
                  </div>
                </div>
                <span className="text-[#4F6BED] font-extrabold text-[14px] text-center">{t.pg}</span>
                <span className="text-[#374151] text-[13px] text-center">{t.j}</span>
                <span className="text-[#16A34A] font-semibold text-[13px] text-center">{t.v}</span>
                <span className="text-[#D97706] font-semibold text-[13px] text-center">{t.e}</span>
                <span className="text-[#EF4444] font-semibold text-[13px] text-center">{t.d}</span>
                <span className="text-[#374151] text-[13px] text-center">{t.gp}</span>
                <span className="text-[#374151] text-[13px] text-center">{t.gc}</span>
                <span className={`font-semibold text-[13px] text-center ${t.sg > 0 ? "text-[#16A34A]" : t.sg < 0 ? "text-[#EF4444]" : "text-[#94A3B8]"}`}>
                  {t.sg > 0 ? `+${t.sg}` : t.sg}
                </span>
              </div>

              {/* ── MOBILE: sanfona ── */}
              <div className="sm:hidden">
                {/* Linha clicavel: pos + escudo + nome + pts + seta */}
                <button
                  type="button"
                  onClick={() => toggleSanfona(t.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors text-left"
                >
                  <PosicaoBadge pos={i + 1} />
                  <EscudoTime nome={t.nome} escudo={t.escudo} />
                  <span className="flex-1 text-[#1E293B] font-semibold text-[14px] truncate">{t.nome}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="text-[#4F6BED] font-extrabold text-[16px] leading-tight">{t.pg}</span>
                      <span className="text-[#94A3B8] text-[10px]">pts</span>
                    </div>
                    <ChevronDown
                      size={16}
                      color="#94A3B8"
                      className={`transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {/* Conteudo expandido */}
                {aberto && (
                  <div className="px-4 pb-4 border-t border-[#F1F5F9]">
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {[
                        { label: "Jogos",    value: t.j,  color: "#374151" },
                        { label: "Vitorias", value: t.v,  color: "#16A34A" },
                        { label: "Empates",  value: t.e,  color: "#D97706" },
                        { label: "Derrotas", value: t.d,  color: "#EF4444" },
                        { label: "Gols Pro", value: t.gp, color: "#374151" },
                        { label: "Gols Con", value: t.gc, color: "#374151" },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-[#F8FAFC] rounded-[8px] p-2.5 flex flex-col items-center gap-0.5">
                          <span className="font-bold text-[16px]" style={{ color: stat.color }}>{stat.value}</span>
                          <span className="text-[#94A3B8] text-[10px] font-medium">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9]">
                      <span className="text-[#94A3B8] text-[12px]">Saldo de gols</span>
                      <span className={`font-bold text-[14px] ${t.sg > 0 ? "text-[#16A34A]" : t.sg < 0 ? "text-[#EF4444]" : "text-[#94A3B8]"}`}>
                        {t.sg > 0 ? `+${t.sg}` : t.sg}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#94A3B8] text-[12px]">Variacao</span>
                      <div className="flex items-center gap-1">
                        <VariacaoIcon v={t.variacao} />
                        <span className="text-[12px] font-medium text-[#374151]">
                          {t.variacao === "up" ? "Subiu" : t.variacao === "down" ? "Caiu" : "Manteve"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FEF9C3] border border-[#FDE047]" />
          <span className="text-[#94A3B8] text-[12px]">Lider</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ChevronUp size={13} color="#16A34A" />
          <span className="text-[#94A3B8] text-[12px]">Subiu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Minus size={11} color="#94A3B8" />
          <span className="text-[#94A3B8] text-[12px]">Manteve</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ChevronDown size={13} color="#EF4444" />
          <span className="text-[#94A3B8] text-[12px]">Caiu</span>
        </div>
      </div>

    </div>
  );
}