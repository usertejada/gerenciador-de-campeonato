// app/partidas/components.tsx

"use client";

import {
  Trophy,
  MapPin,
  Clock,
  Swords,
  Flag,
} from "lucide-react";
import {
  Partida,
  statusConfig,
} from "./types-and-data";

// ── EscudoTime ────────────────────────────────────────────────────────────────

export function EscudoTime({
  nome,
  escudo,
  size = 40,
}: {
  nome: string;
  escudo?: string;
  size?: number;
}) {
  const initials = nome
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isEmoji = escudo && [...escudo].length <= 2 && /\p{Emoji}/u.test(escudo);

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center shrink-0 overflow-hidden"
    >
      {isEmoji ? (
        <span style={{ fontSize: size * 0.5 }}>{escudo}</span>
      ) : escudo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={escudo} alt={nome} className="w-full h-full object-cover" />
      ) : (
        <span
          className="font-bold text-[#4F6BED]"
          style={{ fontSize: size * 0.3 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

// ── CardPartida ───────────────────────────────────────────────────────────────

export function CardPartida({
  partida,
  onFinalizar,
}: {
  partida: Partida;
  /** Chamado quando o usuário clica em "Finalizar Partida". */
  onFinalizar: () => void;
}) {
  const cfg = statusConfig[partida.status];
  const podeFinalizarPartida =
    partida.status === "em_andamento" || partida.status === "agendada";

  return (
    <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-3 hover:border-[#C7D2FE] hover:shadow-md transition-all">

      {/* Cabeçalho: status + hora */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border"
          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
        >
          {cfg.icon}
          {cfg.label}
        </span>
        <span className="flex items-center gap-1 text-[#94A3B8] text-[11px]">
          <Clock size={10} color="#94A3B8" />
          {partida.horaInicio} · {partida.duracao}
        </span>
      </div>

      {/* Times */}
      <div className="flex items-center justify-between gap-2">
        {/* Time A */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <EscudoTime nome={partida.timeA} escudo={partida.escudoA} size={40} />
          <span className="text-[#1E293B] font-bold text-[12px] text-center leading-tight">
            {partida.timeA}
          </span>
          {partida.status === "finalizada" && (
            <span
              className="font-extrabold text-[24px] leading-none"
              style={{
                color:
                  partida.golsA! > partida.golsB!
                    ? "#16A34A"
                    : partida.golsA! < partida.golsB!
                    ? "#EF4444"
                    : "#64748B",
              }}
            >
              {partida.golsA}
            </span>
          )}
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          {partida.status === "finalizada" ? (
            <span className="text-[#CBD5E1] font-bold text-[15px] leading-none">×</span>
          ) : (
            <Swords size={16} color="#C7D2FE" />
          )}
          {partida.status !== "finalizada" && (
            <span className="text-[#CBD5E1] text-[10px] font-bold">VS</span>
          )}
        </div>

        {/* Time B */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <EscudoTime nome={partida.timeB} escudo={partida.escudoB} size={40} />
          <span className="text-[#1E293B] font-bold text-[12px] text-center leading-tight">
            {partida.timeB}
          </span>
          {partida.status === "finalizada" && (
            <span
              className="font-extrabold text-[24px] leading-none"
              style={{
                color:
                  partida.golsB! > partida.golsA!
                    ? "#16A34A"
                    : partida.golsB! < partida.golsA!
                    ? "#EF4444"
                    : "#64748B",
              }}
            >
              {partida.golsB}
            </span>
          )}
        </div>
      </div>

      {/* Rodapé */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F1F5F9]">
        <span className="flex items-center gap-1 text-[#94A3B8] text-[11px] truncate">
          <Trophy size={10} color="#94A3B8" />
          <span className="truncate">{partida.campeonato}</span>
        </span>
        {partida.local && (
          <span className="flex items-center gap-1 text-[#94A3B8] text-[11px] truncate">
            <MapPin size={10} color="#94A3B8" />
            <span className="truncate">{partida.local}</span>
          </span>
        )}
      </div>

      {/* Botão Finalizar — navega para a página dedicada */}
      {podeFinalizarPartida && (
        <button
          type="button"
          onClick={onFinalizar}
          className="mt-auto w-full h-[34px] rounded-[8px] bg-[#EEF2FF] hover:bg-[#4F6BED] text-[#4F6BED] hover:text-white text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#C7D2FE] hover:border-[#4F6BED]"
        >
          <Flag size={12} />
          Finalizar Partida
        </button>
      )}
    </div>
  );
}