// app/partidas/page.tsx

"use client";

import { useState } from "react";
import { Zap, PenLine, Calendar, Swords } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Partida,
  mockPartidas,
  formatarData,
  agruparPorData,
} from "./types-and-data";
import { CardPartida } from "./components";

type Filtro = "todas" | "agendada" | "em_andamento" | "finalizada";

export default function PartidasPage() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [partidas] = useState<Partida[]>(mockPartidas);

  const partidasFiltradas =
    filtro === "todas" ? partidas : partidas.filter((p) => p.status === filtro);

  const grupos = agruparPorData(partidasFiltradas);

  const totalAgendadas = partidas.filter((p) => p.status === "agendada").length;
  const totalEmAndamento = partidas.filter((p) => p.status === "em_andamento").length;
  const totalFinalizadas = partidas.filter((p) => p.status === "finalizada").length;

  function handleFinalizar(partida: Partida) {
    router.push(`/partidas/finalizar/${partida.id}`);
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      <div>

        {/* ── Cabeçalho ── */}
        <div className="flex flex-col gap-3 mb-6 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between">
          <div>
            <h1 className="text-[#1E293B] font-extrabold text-[26px] leading-tight">Partidas</h1>
            <p className="text-[#94A3B8] text-[14px] mt-0.5">
              Gerencie e acompanhe todos os jogos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/partidas/gerar-manual")}
              className="flex items-center gap-2 h-[40px] px-4 rounded-[10px] border border-[#D1D5DB] bg-white text-[#374151] text-[14px] font-semibold hover:bg-[#F9FAFB] transition-colors shadow-sm"
            >
              <PenLine size={15} color="#374151" />
              Manual
            </button>
            <button
              onClick={() => router.push("/partidas/gerar-automatico")}
              className="flex items-center gap-2 h-[40px] px-5 rounded-[10px] bg-[#4F6BED] hover:bg-[#3D5BD9] text-white text-[14px] font-semibold transition-colors shadow-sm"
            >
              <Zap size={15} color="#FFFFFF" />
              Automático
            </button>
          </div>
        </div>

        {/* ── Resumo ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Agendadas", value: totalAgendadas, color: "#4F6BED" },
            { label: "E Curso", value: totalEmAndamento, color: "#D97706" },
            { label: "Finalizadas", value: totalFinalizadas, color: "#16A34A" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-4 py-3 flex flex-col gap-1"
            >
              <span
                className="font-extrabold text-[28px] leading-tight"
                style={{ color: s.color }}
              >
                {s.value}
              </span>
              <span className="text-[#64748B] text-[12px] font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Filtros ── */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {(
            [
              { value: "todas", label: "Todas" },
              { value: "agendada", label: "Agendadas" },
              { value: "em_andamento", label: "Em andamento" },
            ] as { value: Filtro; label: string }[]
          ).map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={`h-[32px] px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                filtro === f.value
                  ? "bg-[#4F6BED] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-[#F8FAFC]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Lista ou vazio ── */}
        {grupos.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] flex flex-col items-center justify-center py-16 gap-3">
            <Swords size={40} color="#CBD5E1" />
            <p className="text-[#94A3B8] text-[15px]">Nenhuma partida encontrada.</p>
            <button
              onClick={() => router.push("/partidas/gerar-automatico")}
              className="flex items-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[13px] px-4 py-2 rounded-[8px] transition-colors"
            >
              <Zap size={14} />
              Gerar partidas
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {grupos.map(([data, partidasGrupo]) => (
              <div key={data}>
                {/* Separador de data */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-3 py-1 shadow-sm">
                    <Calendar size={13} color="#4F6BED" />
                    <span className="text-[#374151] text-[13px] font-semibold capitalize">
                      {formatarData(data)}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                  <span className="text-[#94A3B8] text-[12px]">
                    {partidasGrupo.length} {partidasGrupo.length === 1 ? "jogo" : "jogos"}
                  </span>
                </div>

                {/* Grid de cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {partidasGrupo.map((partida) => (
                    <CardPartida
                      key={partida.id}
                      partida={partida}
                      onFinalizar={() => handleFinalizar(partida)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}