// app/times/[id]/_components/ModalTransferir.tsx

"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { type Jogador, type Time } from "@/lib/services/times";

interface ModalTransferirProps {
  jogador: Jogador;
  times: Time[];
  timeAtualId: string;
  onConfirm: (novoTimeId: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export function ModalTransferir({
  jogador,
  times,
  timeAtualId,
  onConfirm,
  onCancel,
  loading,
}: ModalTransferirProps) {
  const [destinoId, setDestinoId] = useState<string>("");
  const opcoes = times.filter((t) => t.id !== timeAtualId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.18)] p-6 max-w-[400px] w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <ArrowRightLeft size={18} color="#4F6BED" />
          </div>
          <div>
            <h2 className="text-[#1E293B] font-bold text-[16px]">
              Transferir Jogador
            </h2>
            <p className="text-[#94A3B8] text-[12px]">Mover para outro time</p>
          </div>
        </div>

        <p className="text-[#374151] text-[14px] mb-4">
          Transferir{" "}
          <span className="font-semibold text-[#1E293B]">{jogador.nome}</span>{" "}
          para:
        </p>

        <div className="relative mb-5">
          <select
            value={destinoId}
            onChange={(e) => setDestinoId(e.target.value)}
            className="w-full h-[38px] px-3 pr-8 rounded-[8px] border border-[#D1D5DB] text-[#1E293B] text-[14px] outline-none appearance-none bg-white focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
          >
            <option value="">Selecione o time destino...</option>
            {opcoes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} — {t.cidade ?? t.estado ?? ""}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="h-[38px] px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            disabled={!destinoId || loading}
            onClick={() => destinoId && onConfirm(destinoId)}
            className="flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-[#4F6BED] hover:bg-[#3D5BD9] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            <ArrowRightLeft size={14} />
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
}