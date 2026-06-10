// app/times/[id]/_components/ItemJogador.tsx

import { Eye, Pencil, IdCard, ArrowRightLeft, Trash2 } from "lucide-react";
import { type Jogador } from "@/lib/services/times";
import {
  calcularIdade,
  iniciaisNome,
  bandeiraNacionalidade,
} from "@/lib/utils/jogadores";

interface ItemJogadorProps {
  jogador: Jogador;
  onVerFicha: () => void;
  onEditar: () => void;
  onCarteirinha: () => void;
  onTransferir: () => void;
  onExcluir: () => void;
}

export function ItemJogador({
  jogador,
  onVerFicha,
  onEditar,
  onCarteirinha,
  onTransferir,
  onExcluir,
}: ItemJogadorProps) {
  const bandeira = bandeiraNacionalidade[jogador.nacionalidade ?? ""] ?? "🌐";
  const idade = calcularIdade(jogador.data_nascimento);
  const iniciais = iniciaisNome(jogador.nome);

  return (
    <li className="flex flex-col gap-2 px-4 py-4 hover:bg-[#FAFBFF] transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-6">
      {/* Linha superior: avatar + info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0 overflow-hidden">
          {jogador.foto_url ? (
            <img
              src={jogador.foto_url}
              alt={jogador.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[#4F6BED] font-bold text-[13px]">
              {iniciais}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[#1E293B] font-semibold text-[14px] truncate">
            {jogador.nome}
          </p>
          <p className="text-[#94A3B8] text-[12px]">
            {jogador.documento ?? "—"}
            {idade !== null ? ` · ${idade} anos` : ""}
          </p>
        </div>

        {/* Bandeira — só desktop */}
        <span
          className="text-[20px] hidden sm:block"
          title={jogador.nacionalidade ?? ""}
        >
          {bandeira}
        </span>

        {/* 5 ações — só desktop */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <button
            onClick={onVerFicha}
            title="Ver ficha do jogador"
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#4F6BED] text-[#4F6BED] hover:bg-[#EEF2FF] transition-colors"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onEditar}
            title="Editar jogador"
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#22C55E] text-[#22C55E] hover:bg-[#F0FDF4] transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={onCarteirinha}
            title="Emitir carteirinha"
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F5F3FF] transition-colors"
          >
            <IdCard size={15} />
          </button>
          <button
            onClick={onTransferir}
            title="Transferir jogador"
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#64748B] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            <ArrowRightLeft size={15} />
          </button>
          <button
            onClick={onExcluir}
            title="Excluir jogador"
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Linha inferior: 5 ícones — só mobile */}
      <div className="flex items-center gap-2 sm:hidden border-t border-[#F1F5F9] pt-2">
        <button
          onClick={onVerFicha}
          title="Ver ficha do jogador"
          className="flex-1 h-8 flex items-center justify-center rounded-[7px] border border-[#4F6BED] text-[#4F6BED] hover:bg-[#EEF2FF] transition-colors"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={onEditar}
          title="Editar jogador"
          className="flex-1 h-8 flex items-center justify-center rounded-[7px] border border-[#22C55E] text-[#22C55E] hover:bg-[#F0FDF4] transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onCarteirinha}
          title="Emitir carteirinha"
          className="flex-1 h-8 flex items-center justify-center rounded-[7px] border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F5F3FF] transition-colors"
        >
          <IdCard size={15} />
        </button>
        <button
          onClick={onTransferir}
          title="Transferir jogador"
          className="flex-1 h-8 flex items-center justify-center rounded-[7px] border border-[#64748B] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
        >
          <ArrowRightLeft size={15} />
        </button>
        <button
          onClick={onExcluir}
          title="Excluir jogador"
          className="flex-1 h-8 flex items-center justify-center rounded-[7px] border border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
}