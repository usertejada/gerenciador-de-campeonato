// app/times/[id]/_components/ListaJogadores.tsx

import { Users, UserPlus } from "lucide-react";
import { type Jogador } from "@/lib/services/times";
import { ItemJogador } from "./Item.Jogador";

interface ListaJogadoresProps {
  jogadores: Jogador[];
  timeId: string;
  onAdicionarJogador: () => void;
  onVerFicha: (jogador: Jogador) => void;
  onEditar: (jogador: Jogador) => void;
  onCarteirinha: (jogador: Jogador) => void;
  onTransferir: (jogador: Jogador) => void;
  onExcluir: (jogador: Jogador) => void;
}

export function ListaJogadores({
  jogadores,
  onAdicionarJogador,
  onVerFicha,
  onEditar,
  onCarteirinha,
  onTransferir,
  onExcluir,
}: ListaJogadoresProps) {
  return (
    <div className="bg-white rounded-[16px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <Users size={16} color="#4F6BED" />
          <span className="text-[#1E293B] font-semibold text-[15px]">
            Jogadores
          </span>
          <span className="bg-[#EEF2FF] text-[#4F6BED] text-[12px] font-bold px-2 py-0.5 rounded-full">
            {jogadores.length}
          </span>
        </div>
        <button
          onClick={onAdicionarJogador}
          className="flex items-center gap-1.5 text-[#4F6BED] hover:text-[#3D5BD9] text-[13px] font-medium transition-colors"
        >
          <UserPlus size={14} />
          Adicionar
        </button>
      </div>

      {/* Estado vazio */}
      {jogadores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Users size={36} color="#CBD5E1" />
          <p className="text-[#94A3B8] text-[14px]">
            Nenhum jogador cadastrado ainda.
          </p>
          <button
            onClick={onAdicionarJogador}
            className="flex items-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[13px] px-4 py-2 rounded-[8px] transition-colors"
          >
            <UserPlus size={14} color="#FFFFFF" />
            Cadastrar primeiro jogador
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-[#F1F5F9]">
          {jogadores.map((j) => (
            <ItemJogador
              key={j.id}
              jogador={j}
              onVerFicha={() => onVerFicha(j)}
              onEditar={() => onEditar(j)}
              onCarteirinha={() => onCarteirinha(j)}
              onTransferir={() => onTransferir(j)}
              onExcluir={() => onExcluir(j)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}