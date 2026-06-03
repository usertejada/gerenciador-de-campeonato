// app/artilheiros/page.tsx

"use client";

import { useState, useMemo } from "react";
import { Trophy, ChevronLeft, ChevronRight, Target, Medal, Flame } from "lucide-react";

// ── Mock ──────────────────────────────────────────────────────────────────────
const CAMPEONATOS = ["Todos", "Copa Verao 2025", "Liga Empresarial", "Torneio Relampago", "Copa da Cidade"];

interface Artilheiro {
  id: number;
  nome: string;
  time: string;
  escudoTime: string;
  foto?: string;
  gols: number;
  jogos: number;
  assistencias: number;
  campeonato: string;
  mediaGols: number;
}

const ARTILHEIROS_MOCK: Artilheiro[] = [
  { id: 1,  nome: "Carlos Henrique",  time: "Aguias SC",   escudoTime: "🦅", gols: 18, jogos: 10, assistencias: 5, campeonato: "Copa Verao 2025",    mediaGols: 1.8 },
  { id: 2,  nome: "Rafael Souza",     time: "Tubaroes FC", escudoTime: "🦈", gols: 15, jogos: 10, assistencias: 3, campeonato: "Copa Verao 2025",    mediaGols: 1.5 },
  { id: 3,  nome: "Diego Martins",    time: "Trovoes EC",  escudoTime: "⚡", gols: 14, jogos: 9,  assistencias: 7, campeonato: "Liga Empresarial",   mediaGols: 1.56 },
  { id: 4,  nome: "Lucas Ferreira",   time: "Panteras FC", escudoTime: "🐆", gols: 13, jogos: 10, assistencias: 2, campeonato: "Copa Verao 2025",    mediaGols: 1.3 },
  { id: 5,  nome: "Andre Lima",       time: "Leoes FC",    escudoTime: "🦁", gols: 12, jogos: 8,  assistencias: 4, campeonato: "Liga Empresarial",   mediaGols: 1.5 },
  { id: 6,  nome: "Marcos Oliveira",  time: "Dragoes SC",  escudoTime: "🐉", gols: 11, jogos: 10, assistencias: 6, campeonato: "Torneio Relampago",  mediaGols: 1.1 },
  { id: 7,  nome: "Bruno Santos",     time: "Falcoes EC",  escudoTime: "🦆", gols: 10, jogos: 9,  assistencias: 1, campeonato: "Copa da Cidade",     mediaGols: 1.11 },
  { id: 8,  nome: "Thiago Alves",     time: "Lobos SC",    escudoTime: "🐺", gols: 10, jogos: 10, assistencias: 3, campeonato: "Copa Verao 2025",    mediaGols: 1.0 },
  { id: 9,  nome: "Felipe Costa",     time: "Aguias SC",   escudoTime: "🦅", gols: 9,  jogos: 8,  assistencias: 5, campeonato: "Copa da Cidade",     mediaGols: 1.13 },
  { id: 10, nome: "Rodrigo Nunes",    time: "Tubaroes FC", escudoTime: "🦈", gols: 9,  jogos: 9,  assistencias: 2, campeonato: "Liga Empresarial",   mediaGols: 1.0 },
  { id: 11, nome: "Gustavo Pinto",    time: "Trovoes EC",  escudoTime: "⚡", gols: 8,  jogos: 7,  assistencias: 4, campeonato: "Torneio Relampago",  mediaGols: 1.14 },
  { id: 12, nome: "Paulo Mendes",     time: "Panteras FC", escudoTime: "🐆", gols: 8,  jogos: 10, assistencias: 3, campeonato: "Copa Verao 2025",    mediaGols: 0.8 },
  { id: 13, nome: "Vinicius Rocha",   time: "Leoes FC",    escudoTime: "🦁", gols: 7,  jogos: 8,  assistencias: 6, campeonato: "Copa da Cidade",     mediaGols: 0.88 },
  { id: 14, nome: "Caio Barbosa",     time: "Dragoes SC",  escudoTime: "🐉", gols: 7,  jogos: 9,  assistencias: 1, campeonato: "Liga Empresarial",   mediaGols: 0.78 },
  { id: 15, nome: "Mateus Cardoso",   time: "Falcoes EC",  escudoTime: "🦆", gols: 6,  jogos: 7,  assistencias: 2, campeonato: "Torneio Relampago",  mediaGols: 0.86 },
  { id: 16, nome: "Eduardo Teixeira", time: "Lobos SC",    escudoTime: "🐺", gols: 6,  jogos: 8,  assistencias: 4, campeonato: "Copa da Cidade",     mediaGols: 0.75 },
  { id: 17, nome: "Jonathan Brito",   time: "Aguias SC",   escudoTime: "🦅", gols: 5,  jogos: 6,  assistencias: 3, campeonato: "Liga Empresarial",   mediaGols: 0.83 },
  { id: 18, nome: "Samuel Xavier",    time: "Tubaroes FC", escudoTime: "🦈", gols: 5,  jogos: 7,  assistencias: 1, campeonato: "Torneio Relampago",  mediaGols: 0.71 },
  { id: 19, nome: "Igor Nascimento",  time: "Trovoes EC",  escudoTime: "⚡", gols: 4,  jogos: 6,  assistencias: 5, campeonato: "Copa da Cidade",     mediaGols: 0.67 },
  { id: 20, nome: "Leonardo Freitas", time: "Panteras FC", escudoTime: "🐆", gols: 4,  jogos: 8,  assistencias: 2, campeonato: "Copa Verao 2025",    mediaGols: 0.5 },
];

const ITENS_POR_PAGINA = 10;

function PodiumCard({ artilheiro, pos }: { artilheiro: Artilheiro; pos: number }) {
  const configs = {
    1: { bg: "bg-gradient-to-br from-[#FEF9C3] to-[#FEF08A]", border: "border-[#FDE047]", shadow: "shadow-[0_4px_16px_rgba(250,204,21,0.25)]", badge: "bg-[#CA8A04] text-white", size: "w-20 h-20", fontSize: "text-[32px]", nameSz: "text-[16px]" },
    2: { bg: "bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]", border: "border-[#CBD5E1]", shadow: "shadow-[0_2px_8px_rgba(0,0,0,0.08)]",          badge: "bg-[#64748B] text-white", size: "w-16 h-16", fontSize: "text-[26px]", nameSz: "text-[14px]" },
    3: { bg: "bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA]", border: "border-[#FED7AA]", shadow: "shadow-[0_2px_8px_rgba(194,65,12,0.12)]",        badge: "bg-[#C2410C] text-white", size: "w-16 h-16", fontSize: "text-[26px]", nameSz: "text-[14px]" },
  }[pos]!;

  return (
    <div className={`${configs.bg} border ${configs.border} ${configs.shadow} rounded-[16px] p-2 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 relative w-full`}>
      {/* Badge posicao */}
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full ${configs.badge} flex items-center justify-center font-extrabold text-[13px] shadow-sm`}>
        {pos}
      </div>

      {/* Avatar */}
      <div className={`${pos === 1 ? "w-14 h-14 sm:w-20 sm:h-20" : "w-12 h-12 sm:w-16 sm:h-16"} rounded-full bg-white border-2 ${configs.border} flex items-center justify-center mt-2 shrink-0`}>
        <span className={pos === 1 ? "text-[24px] sm:text-[32px]" : "text-[20px] sm:text-[26px]"}>{artilheiro.escudoTime}</span>
      </div>

      {/* Info */}
      <div className="text-center w-full px-1">
        <p className={`text-[#1E293B] font-bold ${pos === 1 ? "text-[13px] sm:text-[16px]" : "text-[11px] sm:text-[14px]"} leading-tight truncate`}>{artilheiro.nome}</p>
        <p className="text-[#64748B] text-[10px] sm:text-[11px] mt-0.5 truncate">{artilheiro.time}</p>
      </div>

      {/* Gols */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-white/70 rounded-full px-2 sm:px-3 py-1">
        <Target size={11} color="#4F6BED" />
        <span className="text-[#4F6BED] font-extrabold text-[15px] sm:text-[18px] leading-none">{artilheiro.gols}</span>
        <span className="text-[#94A3B8] text-[10px] sm:text-[11px]">gols</span>
      </div>

      {/* Stats extras — ocultas em mobile pequeno, visíveis sm+ */}
      <div className="hidden sm:flex items-center gap-3 text-center">
        <div>
          <p className="text-[#374151] font-semibold text-[12px]">{artilheiro.jogos}</p>
          <p className="text-[#94A3B8] text-[10px]">jogos</p>
        </div>
        <div className="w-px h-6 bg-[#E5E7EB]" />
        <div>
          <p className="text-[#374151] font-semibold text-[12px]">{artilheiro.assistencias}</p>
          <p className="text-[#94A3B8] text-[10px]">assist.</p>
        </div>
        <div className="w-px h-6 bg-[#E5E7EB]" />
        <div>
          <p className="text-[#374151] font-semibold text-[12px]">{artilheiro.mediaGols.toFixed(1)}</p>
          <p className="text-[#94A3B8] text-[10px]">media</p>
        </div>
      </div>
    </div>
  );
}

export default function ArtilheirosPage() {
  const [campeonato, setCampeonato] = useState("Todos");
  const [pagina, setPagina] = useState(1);

  const lista = useMemo(() => {
    setPagina(1);
    const filtrado = campeonato === "Todos"
      ? ARTILHEIROS_MOCK
      : ARTILHEIROS_MOCK.filter((a) => a.campeonato === campeonato);
    return filtrado.sort((a, b) => b.gols - a.gols);
  }, [campeonato]);

  const top3 = lista.slice(0, 3);
  const totalPaginas = Math.ceil(lista.length / ITENS_POR_PAGINA);
  const itensPagina = lista.slice((pagina - 1) * ITENS_POR_PAGINA, pagina * ITENS_POR_PAGINA);

  // Barra de gols relativa ao lider
  const maxGols = lista[0]?.gols ?? 1;

  function mudarPagina(nova: number) {
    if (nova < 1 || nova > totalPaginas) return;
    setPagina(nova);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function paginasVisiveis(): (number | "...")[] {
    if (totalPaginas <= 5) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (pagina > 3) pages.push("...");
    for (let i = Math.max(2, pagina - 1); i <= Math.min(totalPaginas - 1, pagina + 1); i++) pages.push(i);
    if (pagina < totalPaginas - 2) pages.push("...");
    pages.push(totalPaginas);
    return pages;
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between">
        <div>
          <h1 className="text-[#1E293B] font-extrabold text-[22px] lg:text-[28px] leading-tight">
            Artilheiros
          </h1>
          <p className="text-[#94A3B8] text-[14px] font-normal mt-1">
            Ranking de goleadores por campeonato
          </p>
        </div>
        <div className="relative self-start min-[640px]:self-auto w-full min-[640px]:w-auto">
          <Trophy size={13} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={campeonato}
            onChange={(e) => setCampeonato(e.target.value)}
            className="h-[38px] w-full min-[640px]:w-auto pl-8 pr-8 rounded-[8px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[13px] font-medium outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all appearance-none cursor-pointer"
          >
            {CAMPEONATOS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Podio top 3 */}
      {top3.length >= 3 && (
        <div className="mb-6">
          <div className="flex items-end gap-2 sm:gap-3 justify-center w-full">
            {/* 2o lugar — menor */}
            <div className="flex-1 min-w-0 max-w-[110px] sm:max-w-[180px]">
              <PodiumCard artilheiro={top3[1]} pos={2} />
            </div>
            {/* 1o lugar — maior, centralizado */}
            <div className="flex-1 min-w-0 max-w-[130px] sm:max-w-[200px] -mt-4">
              <PodiumCard artilheiro={top3[0]} pos={1} />
            </div>
            {/* 3o lugar — menor */}
            <div className="flex-1 min-w-0 max-w-[110px] sm:max-w-[180px]">
              <PodiumCard artilheiro={top3[2]} pos={3} />
            </div>
          </div>
        </div>
      )}

      {/* Tabela ranking */}
      <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden mb-4">

        {/* Cabecalho */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
          <span className="w-7 text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">#</span>
          <span className="flex-1 text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">Jogador</span>
          <span className="w-[120px] hidden sm:block text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Progresso</span>
          <span className="w-10 text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Gols</span>
          <span className="w-10 hidden sm:block text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">J</span>
          <span className="w-10 hidden md:block text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Ast</span>
          <span className="w-12 hidden md:block text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Media</span>
        </div>

        {/* Linhas */}
        {itensPagina.map((a, i) => {
          const posGlobal = (pagina - 1) * ITENS_POR_PAGINA + i + 1;
          const pct = Math.round((a.gols / maxGols) * 100);
          const isTop3 = posGlobal <= 3;

          return (
            <div
              key={a.id}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors ${
                posGlobal === 1 ? "bg-[#FEFCE8]" : ""
              }`}
            >
              {/* Posicao */}
              <div className="w-7 flex justify-center shrink-0">
                {posGlobal === 1 ? (
                  <Medal size={18} color="#CA8A04" />
                ) : posGlobal === 2 ? (
                  <Medal size={16} color="#64748B" />
                ) : posGlobal === 3 ? (
                  <Medal size={16} color="#C2410C" />
                ) : (
                  <span className="text-[#94A3B8] font-semibold text-[13px]">{posGlobal}</span>
                )}
              </div>

              {/* Jogador */}
              <div className="flex-1 flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center shrink-0">
                  <span className="text-[18px]">{a.escudoTime}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#1E293B] font-semibold text-[13px] truncate">{a.nome}</span>
                    {posGlobal === 1 && <Flame size={13} color="#EF4444" className="shrink-0" />}
                  </div>
                  <span className="text-[#94A3B8] text-[11px] truncate">{a.time}</span>
                </div>
              </div>

              {/* Barra de progresso — so sm+ */}
              <div className="w-[120px] hidden sm:block shrink-0">
                <div className="h-[6px] bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: posGlobal === 1
                        ? "linear-gradient(90deg, #4F6BED, #818CF8)"
                        : posGlobal <= 3
                        ? "#4F6BED"
                        : "#A5B4FC",
                    }}
                  />
                </div>
              </div>

              {/* Gols */}
              <div className="w-10 flex justify-center shrink-0">
                <span className={`font-extrabold text-[15px] ${isTop3 ? "text-[#4F6BED]" : "text-[#374151]"}`}>
                  {a.gols}
                </span>
              </div>

              {/* Jogos */}
              <div className="w-10 hidden sm:flex justify-center shrink-0">
                <span className="text-[#64748B] text-[13px]">{a.jogos}</span>
              </div>

              {/* Assistencias */}
              <div className="w-10 hidden md:flex justify-center shrink-0">
                <span className="text-[#64748B] text-[13px]">{a.assistencias}</span>
              </div>

              {/* Media */}
              <div className="w-12 hidden md:flex justify-center shrink-0">
                <span className="text-[#64748B] text-[13px]">{a.mediaGols.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginacao */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-2">
          <button
            onClick={() => mudarPagina(pagina - 1)}
            disabled={pagina === 1}
            className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={15} />
          </button>

          {paginasVisiveis().map((p, i) =>
            p === "..." ? (
              <span key={`el-${i}`} className="w-[34px] h-[34px] flex items-center justify-center text-[#94A3B8] text-[13px]">...</span>
            ) : (
              <button
                key={p}
                onClick={() => mudarPagina(p as number)}
                className={`w-[34px] h-[34px] rounded-[8px] text-[13px] font-semibold transition-colors border ${
                  pagina === p
                    ? "bg-[#4F6BED] text-white border-[#4F6BED]"
                    : "bg-white text-[#374151] border-[#D1D5DB] hover:bg-[#F9FAFB]"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => mudarPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
            className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

    </div>
  );
}