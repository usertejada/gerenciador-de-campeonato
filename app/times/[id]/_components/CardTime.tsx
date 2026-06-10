// app/times/[id]/_components/CardTime.tsx

import { MapPin, Trophy, Pencil } from "lucide-react";
import { type Time } from "@/lib/services/times";

interface CardTimeProps {
  time: Time;
  totalJogadores: number;
  onEditar: () => void;
}

export function CardTime({ time, totalJogadores, onEditar }: CardTimeProps) {
  const nomeCampeonato = time.campeonatos?.nome ?? "Sem campeonato";
  const cidade = [time.cidade, time.estado].filter(Boolean).join(", ") || "—";

  return (
    <div className="bg-white rounded-[16px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden mb-6">
      <div className="h-[6px] bg-[#4F6BED]" />
      <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Escudo / Logo */}
        <div className="w-24 h-24 rounded-[16px] bg-[#EEF2FF] border-2 border-[#C7D2FE] flex items-center justify-center shrink-0 overflow-hidden shadow-[0_4px_16px_rgba(79,107,237,0.15)]">
          {time.logo_url ? (
            <img
              src={time.logo_url}
              alt={`Escudo ${time.nome}`}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-[#4F6BED] font-extrabold text-[28px] tracking-wider">
              {time.sigla}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-[#1E293B] font-extrabold text-[26px] leading-tight">
            {time.nome}
          </h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-[#64748B] text-[13px]">
              <MapPin size={13} color="#94A3B8" />
              {cidade}
            </span>
            <span className="flex items-center gap-1.5 text-[#64748B] text-[13px]">
              <Trophy size={13} color="#94A3B8" />
              {nomeCampeonato}
            </span>
          </div>

          {/* Contagem de jogadores */}
          <div className="flex gap-4 mt-4 justify-center sm:justify-start">
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-[20px] leading-tight text-[#4F6BED]">
                {totalJogadores}
              </span>
              <span className="text-[#94A3B8] text-[11px] font-medium">
                Jogadores
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}