"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, UserPlus, Users, MapPin, Trophy } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface Time {
  id: number;
  nome: string;
  sigla: string;
  cidade: string;
  campeonato: string;
  v: number;
  e: number;
  d: number;
  escudo?: string;
}

interface Jogador {
  id: number;
  nome: string;
  nacionalidade: string;
  documento: string;
  dataNascimento: string;
}

// Mock — em produção viria do banco pelo id
const mockTimes: Time[] = [
  { id: 1, nome: "Águias SC",   sigla: "AGU", cidade: "São Paulo, SP",     campeonato: "Copa Verão 2025",   v: 8,  e: 2, d: 1 },
  { id: 2, nome: "Leões FC",    sigla: "LEO", cidade: "Rio de Janeiro, RJ", campeonato: "Copa Verão 2025",   v: 6,  e: 3, d: 2 },
  { id: 3, nome: "Panteras FC", sigla: "PAN", cidade: "Belo Horizonte, MG", campeonato: "Liga Empresarial",  v: 5,  e: 1, d: 4 },
  { id: 4, nome: "Trovões EC",  sigla: "TRO", cidade: "Curitiba, PR",       campeonato: "Liga Empresarial",  v: 7,  e: 0, d: 3 },
  { id: 5, nome: "Dragões SC",  sigla: "DRA", cidade: "Porto Alegre, RS",   campeonato: "Torneio Relâmpago", v: 3,  e: 2, d: 2 },
  { id: 6, nome: "Falcões EC",  sigla: "FAL", cidade: "Fortaleza, CE",      campeonato: "Champions Interno", v: 10, e: 1, d: 0 },
];

const mockJogadores: Record<number, Jogador[]> = {
  1: [
    { id: 1, nome: "Carlos Eduardo Silva",  nacionalidade: "Brasileiro",  documento: "123.456.789-00", dataNascimento: "1998-04-12" },
    { id: 2, nome: "Juan Pérez Torres",     nacionalidade: "Colombiano",  documento: "CC 1023456789",  dataNascimento: "2000-07-23" },
  ],
  2: [
    { id: 3, nome: "Diego Alves Costa",     nacionalidade: "Brasileiro",  documento: "987.654.321-00", dataNascimento: "1995-11-05" },
  ],
};

const bandeiraNacionalidade: Record<string, string> = {
  Brasileiro: "🇧🇷",
  Colombiano: "🇨🇴",
  Peruano:    "🇵🇪",
};

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

export default function TimeDetalhePage() {
  const router  = useRouter();
  const params  = useParams();
  const id      = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [time, setTime]       = useState<Time | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      const found = mockTimes.find((t) => t.id === id) ?? null;
      setTime(found);
      setJogadores(mockJogadores[id] ?? []);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F3F7]">
        <Spinner />
      </div>
    );
  }

  if (!time) {
    return (
      <div className="min-h-screen bg-[#F1F3F7] flex flex-col items-center justify-center gap-4">
        <p className="text-[#94A3B8] text-[15px]">Time não encontrado.</p>
        <button
          onClick={() => router.push("/times")}
          className="flex items-center gap-2 text-[#4F6BED] font-medium text-[14px] hover:underline"
        >
          <ArrowLeft size={15} />
          Voltar para Times
        </button>
      </div>
    );
  }

  const pts = time.v * 3 + time.e;

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* Voltar */}
      <button
        onClick={() => router.push("/times")}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft size={16} color="#1E293B" />
        Voltar
      </button>

      {/* Card principal do time */}
      <div className="max-w-[860px] mx-auto">
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden mb-6">

          {/* Banner superior */}
          <div className="h-[6px] bg-[#4F6BED]" />

          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Escudo */}
            <div className="w-24 h-24 rounded-[16px] bg-[#EEF2FF] border-2 border-[#C7D2FE] flex items-center justify-center shrink-0 overflow-hidden shadow-[0_4px_16px_rgba(79,107,237,0.15)]">
              {time.escudo ? (
                <img src={time.escudo} alt={`Escudo ${time.nome}`} className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-[#4F6BED] font-extrabold text-[28px] tracking-wider">{time.sigla}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-[#1E293B] font-extrabold text-[26px] leading-tight">{time.nome}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-[#64748B] text-[13px]">
                  <MapPin size={13} color="#94A3B8" />
                  {time.cidade}
                </span>
                <span className="flex items-center gap-1.5 text-[#64748B] text-[13px]">
                  <Trophy size={13} color="#94A3B8" />
                  {time.campeonato}
                </span>
              </div>

              {/* Estatísticas */}
              <div className="flex gap-4 mt-4 justify-center sm:justify-start">
                {[
                  { label: "Pontos",   value: pts,    color: "#4F6BED" },
                  { label: "Vitórias", value: time.v, color: "#22C55E" },
                  { label: "Empates",  value: time.e, color: "#F59E0B" },
                  { label: "Derrotas", value: time.d, color: "#EF4444" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center">
                    <span className="font-extrabold text-[20px] leading-tight" style={{ color: s.color }}>
                      {s.value}
                    </span>
                    <span className="text-[#94A3B8] text-[11px] font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão adicionar jogador */}
            <button
              onClick={() => router.push(`/times/${time.id}/adicionar-jogador`)}
              className="flex items-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-colors shrink-0 self-start"
            >
              <UserPlus size={16} color="#FFFFFF" />
              Adicionar Jogador
            </button>
          </div>
        </div>

        {/* Lista de jogadores */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Users size={16} color="#4F6BED" />
              <span className="text-[#1E293B] font-semibold text-[15px]">Jogadores</span>
              <span className="bg-[#EEF2FF] text-[#4F6BED] text-[12px] font-bold px-2 py-0.5 rounded-full">
                {jogadores.length}
              </span>
            </div>
            <button
              onClick={() => router.push(`/times/${time.id}/adicionar-jogador`)}
              className="flex items-center gap-1.5 text-[#4F6BED] hover:text-[#3D5BD9] text-[13px] font-medium transition-colors"
            >
              <UserPlus size={14} />
              Adicionar
            </button>
          </div>

          {jogadores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Users size={36} color="#CBD5E1" />
              <p className="text-[#94A3B8] text-[14px]">Nenhum jogador cadastrado ainda.</p>
              <button
                onClick={() => router.push(`/times/${time.id}/adicionar-jogador`)}
                className="flex items-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[13px] px-4 py-2 rounded-[8px] transition-colors"
              >
                <UserPlus size={14} color="#FFFFFF" />
                Cadastrar primeiro jogador
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#F1F5F9]">
              {jogadores.map((j) => {
                const bandeira = bandeiraNacionalidade[j.nacionalidade] ?? "🌐";
                const nascimento = new Date(j.dataNascimento + "T00:00:00");
                const idade = Math.floor((Date.now() - nascimento.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
                const iniciais = j.nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

                return (
                  <li key={j.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFBFF] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                      <span className="text-[#4F6BED] font-bold text-[13px]">{iniciais}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1E293B] font-semibold text-[14px] truncate">{j.nome}</p>
                      <p className="text-[#94A3B8] text-[12px]">{j.documento} · {idade} anos</p>
                    </div>
                    <span className="text-[20px]" title={j.nacionalidade}>{bandeira}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}