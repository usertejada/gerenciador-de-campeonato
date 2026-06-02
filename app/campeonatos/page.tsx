"use client";

import { useState, useEffect } from "react";
import { Trophy, Calendar, Users, Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type BadgeStatus = "Em Andamento" | "Pendente" | "Finalizado";

interface Campeonato {
  id: number;
  nome: string;
  formato: string;
  status: BadgeStatus;
  desc: string;
  data: string;
  times: string;
}

const mockData: Campeonato[] = [
  { id: 1, nome: "Copa Verão 2025",    formato: "Mata-mata",          status: "Em Andamento", desc: "Torneio de futebol society com 16 times participantes.",         data: "Jan–Mar 2025", times: "16 times" },
  { id: 2, nome: "Liga Empresarial",   formato: "Pontos corridos",    status: "Em Andamento", desc: "Campeonato interno entre departamentos da empresa.",              data: "Fev–Abr 2025", times: "8 times"  },
  { id: 3, nome: "Torneio Relâmpago",  formato: "Eliminatório",       status: "Pendente",     desc: "Competição rápida de fim de semana, formato eliminatório.",      data: "Mar 2025",     times: "12 times" },
  { id: 4, nome: "Champions Interno",  formato: "Grupos + Mata-mata", status: "Finalizado",   desc: "Edição especial anual de futebol entre colaboradores.",          data: "Dez 2024",     times: "20 times" },
  { id: 5, nome: "Taça Primavera",     formato: "Pontos corridos",    status: "Pendente",     desc: "Campeonato sazonal com times da região metropolitana.",          data: "Abr–Jun 2025", times: "10 times" },
  { id: 6, nome: "Super Copa 2024",    formato: "Mata-mata",          status: "Finalizado",   desc: "Confronto entre os campeões dos torneios anteriores do ano.",    data: "Nov 2024",     times: "4 times"  },
];

const badgeMap: Record<BadgeStatus, { bg: string; text: string }> = {
  "Em Andamento": { bg: "#D1FAE5", text: "#065F46" },
  "Pendente":     { bg: "#FEF3C7", text: "#92400E" },
  "Finalizado":   { bg: "#F3F4F6", text: "#6B7280" },
};

function Badge({ status }: { status: BadgeStatus }) {
  const { bg, text } = badgeMap[status];
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: bg, color: text }}
    >
      {status}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

function EmptyState({ onNovo }: { onNovo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
      <Trophy size={48} color="#CBD5E1" />
      <h3 className="text-[#1E293B] font-semibold text-[17px]">Nenhum campeonato encontrado</h3>
      <p className="text-[#94A3B8] text-[13px] text-center max-w-xs">
        Você ainda não criou nenhum campeonato. Comece agora!
      </p>
      <button
        onClick={onNovo}
        className="flex items-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-colors mt-2"
      >
        <Plus size={16} color="#FFFFFF" />
        Novo Campeonato
      </button>
    </div>
  );
}

export default function CampeonatosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setCampeonatos(mockData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  function handleDelete(id: number) {
    setCampeonatos((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* Header — empilhado no celular, lado a lado no tablet/desktop */}
      <div className="flex flex-col gap-3 mb-6 min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between">
        <div>
          <h1 className="text-[#1E293B] font-extrabold text-[22px] lg:text-[28px] leading-tight">
            Campeonatos
          </h1>
          <p className="text-[#94A3B8] text-[14px] font-normal mt-1">
            Gerencie todos os seus campeonatos
          </p>
        </div>
        <button
          onClick={() => router.push("/novo-campeonato")}
          className="flex items-center justify-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-colors self-start min-[640px]:self-auto min-[640px]:shrink-0"
        >
          <Trophy size={16} color="#FFFFFF" />
          Novo Campeonato
        </button>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <Spinner />
      ) : campeonatos.length === 0 ? (
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <EmptyState onNovo={() => router.push("/novo-campeonato")} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campeonatos.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-[12px] border border-[#C4C9D4] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-shadow flex flex-col gap-3"
            >
              {/* Topo: avatar + nome + badge */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                  <Trophy size={18} color="#4F6BED" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[#1E293B] font-semibold text-[15px] leading-tight truncate">
                      {c.nome}
                    </span>
                    <Badge status={c.status} />
                  </div>
                  <p className="text-[#94A3B8] text-[12px] mt-0.5">{c.formato}</p>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-[#94A3B8] text-[12px] line-clamp-2">{c.desc}</p>

              {/* Metadados */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[#94A3B8] text-[11px]">
                  <Calendar size={12} color="#94A3B8" />
                  {c.data}
                </span>
                <span className="flex items-center gap-1 text-[#94A3B8] text-[11px]">
                  <Users size={12} color="#94A3B8" />
                  {c.times}
                </span>
              </div>

              {/* Botões */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#E5E7EB] mt-auto">
                <button className="flex-1 flex items-center justify-center gap-1.5 h-[34px] rounded-[8px] border border-[#10B981] text-[#065F46] font-medium text-[13px] hover:bg-[#F0FDF4] transition-colors">
                  <Pencil size={12} color="#10B981" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="w-[34px] h-[34px] flex items-center justify-center rounded-[8px] border border-[#EF4444] hover:bg-[#FEF2F2] transition-colors shrink-0"
                  aria-label="Excluir campeonato"
                >
                  <Trash2 size={12} color="#EF4444" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}