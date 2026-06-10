// app/times/[id]/_components/ModalExcluir.tsx

import { Trash2 } from "lucide-react";
import { type Jogador } from "@/lib/services/times";

interface ModalExcluirProps {
  jogador: Jogador;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function ModalExcluir({
  jogador,
  onConfirm,
  onCancel,
  loading,
}: ModalExcluirProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.18)] p-6 max-w-[380px] w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
            <Trash2 size={18} color="#EF4444" />
          </div>
          <div>
            <h2 className="text-[#1E293B] font-bold text-[16px]">
              Excluir Jogador
            </h2>
            <p className="text-[#94A3B8] text-[12px]">
              Esta ação não pode ser desfeita
            </p>
          </div>
        </div>

        <p className="text-[#374151] text-[14px] mb-5">
          Tem certeza que deseja excluir{" "}
          <span className="font-semibold text-[#1E293B]">{jogador.nome}</span>{" "}
          do elenco?
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="h-[38px] px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="h-[38px] px-4 rounded-[8px] bg-[#EF4444] hover:bg-[#DC2626] text-white text-[14px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}