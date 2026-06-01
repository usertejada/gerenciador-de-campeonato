// app/times/[id]/jogadores/[jogadorId]/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  FileText,
  Calendar,
  Flag,
  Pencil,
  ArrowRightLeft,
  Trash2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface Jogador {
  id: number;
  nome: string;
  nacionalidade: string;
  documento: string;
  dataNascimento: string;
  telefone?: string;
  foto?: string;
  gols: number;
  assistencias: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  jogos: number;
  timeId: number;
  timeNome: string;
}

// Mock — em produção buscar por /api/jogadores/:id
const mockJogadores: Record<number, Jogador> = {
  1: {
    id: 1,
    nome: "Carlos Eduardo Silva",
    nacionalidade: "Brasileiro",
    documento: "123.456.789-00",
    dataNascimento: "1998-04-12",
    telefone: "(11) 99999-1234",
    gols: 5,
    assistencias: 3,
    cartoesAmarelos: 2,
    cartoesVermelhos: 0,
    jogos: 11,
    timeId: 1,
    timeNome: "Águias SC",
  },
  2: {
    id: 2,
    nome: "Juan Pérez Torres",
    nacionalidade: "Colombiano",
    documento: "CC 1023456789",
    dataNascimento: "2000-07-23",
    telefone: "+57 311 222 3344",
    gols: 3,
    assistencias: 7,
    cartoesAmarelos: 1,
    cartoesVermelhos: 1,
    jogos: 9,
    timeId: 1,
    timeNome: "Águias SC",
  },
  3: {
    id: 3,
    nome: "Diego Alves Costa",
    nacionalidade: "Brasileiro",
    documento: "987.654.321-00",
    dataNascimento: "1995-11-05",
    gols: 0,
    assistencias: 1,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
    jogos: 7,
    timeId: 2,
    timeNome: "Leões FC",
  },
};

const bandeiraNacionalidade: Record<string, string> = {
  Brasileiro: "🇧🇷",
  Colombiano: "🇨🇴",
  Peruano: "🇵🇪",
};

const docLabel: Record<string, string> = {
  Brasileiro: "CPF",
  Colombiano: "Cédula de Ciudadanía",
  Peruano: "DNI",
};

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1.5 rounded-[12px] border py-4 px-3"
      style={{ background: bg, borderColor: `${color}30` }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        {icon}
      </div>
      <span className="font-extrabold text-[24px] leading-tight" style={{ color }}>
        {value}
      </span>
      <span className="text-[#64748B] text-[11px] font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// Ícones extraídos como constantes para evitar erro ts(2695) com paths SVG negativos
const IconBola = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#4F6BED" strokeWidth="2" />
    <path d="M12 2a10 10 0 0 1 0 20" stroke="#4F6BED" strokeWidth="2" />
    <path d="M2 12h20" stroke="#4F6BED" strokeWidth="1.5" />
    <path d="M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10" stroke="#4F6BED" strokeWidth="1.5" />
    <path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10" stroke="#4F6BED" strokeWidth="1.5" />
  </svg>
);

const IconEstrela = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke="#6366F1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconGrafico = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 12h-4l-3 9L9 3l-3 9H2"
      stroke="#0EA5E9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function FichaJogadorPage() {
  const router = useRouter();
  const params = useParams();
  const timeId = params?.id as string;
  const jogadorId = Number(params?.jogadorId);

  const [loading, setLoading] = useState(true);
  const [jogador, setJogador] = useState<Jogador | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setJogador(mockJogadores[jogadorId] ?? null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [jogadorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F3F7]">
        <Spinner />
      </div>
    );
  }

  if (!jogador) {
    return (
      <div className="min-h-screen bg-[#F1F3F7] flex flex-col items-center justify-center gap-4">
        <p className="text-[#94A3B8] text-[15px]">Jogador não encontrado.</p>
        <button
          onClick={() => router.push(`/times/${timeId}`)}
          className="flex items-center gap-2 text-[#4F6BED] font-medium text-[14px] hover:underline"
        >
          <ArrowLeft size={15} />
          Voltar para o time
        </button>
      </div>
    );
  }

  const nascimento = new Date(jogador.dataNascimento + "T00:00:00");
  const idade = Math.floor(
    (Date.now() - nascimento.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
  const nascimentoFormatado = nascimento.toLocaleDateString("pt-BR");
  const bandeira = bandeiraNacionalidade[jogador.nacionalidade] ?? "🌐";
  const docTipo = docLabel[jogador.nacionalidade] ?? "Documento";
  const iniciais = jogador.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Situação disciplinar
  const suspenso = jogador.cartoesVermelhos > 0;
  const atencao = jogador.cartoesAmarelos >= 3;

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      {/* Voltar */}
      <button
        onClick={() => router.push(`/times/${timeId}`)}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft size={16} color="#1E293B" />
        Voltar para {jogador.timeNome}
      </button>

      <div className="max-w-[680px] mx-auto flex flex-col gap-5">
        {/* Card de identidade */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Barra de cor + status disciplinar */}
          <div
            className={`h-[6px] ${
              suspenso ? "bg-[#EF4444]" : atencao ? "bg-[#F59E0B]" : "bg-[#4F6BED]"
            }`}
          />

          <div className="p-6">
            {/* Status disciplinar badge */}
            {(suspenso || atencao) && (
              <div
                className={`inline-flex items-center gap-1.5 text-[12px] font-semibold rounded-full px-3 py-1 mb-4 ${
                  suspenso
                    ? "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
                    : "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                }`}
              >
                {suspenso ? "🟥 Suspenso" : "🟨 Atenção: acúmulo de cartões"}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Foto 3x4 */}
              <div className="w-[90px] h-[120px] rounded-[12px] overflow-hidden border-2 border-[#C7D2FE] bg-[#EEF2FF] flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(79,107,237,0.15)]">
                {jogador.foto ? (
                  <img
                    src={jogador.foto}
                    alt={jogador.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[#4F6BED] font-extrabold text-[28px]">
                      {iniciais}
                    </span>
                    <User size={14} color="#818CF8" />
                  </div>
                )}
              </div>

              {/* Dados principais */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-[#1E293B] font-extrabold text-[22px] leading-tight mb-1">
                  {jogador.nome}
                </h1>
                <p className="text-[#4F6BED] text-[14px] font-semibold mb-3">
                  {bandeira} {jogador.nacionalidade} · {jogador.timeNome}
                </p>

                {/* Dados do documento */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <FileText size={14} color="#94A3B8" />
                    <span className="text-[#64748B] text-[13px]">
                      <span className="font-medium text-[#374151]">{docTipo}:</span>{" "}
                      {jogador.documento}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Calendar size={14} color="#94A3B8" />
                    <span className="text-[#64748B] text-[13px]">
                      <span className="font-medium text-[#374151]">Nascimento:</span>{" "}
                      {nascimentoFormatado}{" "}
                      <span className="text-[#94A3B8]">({idade} anos)</span>
                    </span>
                  </div>
                  {jogador.telefone && (
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Phone size={14} color="#94A3B8" />
                      <a
                        href={`tel:${jogador.telefone.replace(/\D/g, "")}`}
                        className="text-[#4F6BED] text-[13px] font-medium hover:underline"
                      >
                        {jogador.telefone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Flag size={14} color="#94A3B8" />
                    <span className="text-[#64748B] text-[13px]">
                      <span className="font-medium text-[#374151]">Nacionalidade:</span>{" "}
                      {jogador.nacionalidade}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações rápidas */}
            <div className="flex flex-col gap-2 mt-5 pt-5 border-t border-[#F1F5F9] min-[500px]:flex-row min-[500px]:items-center">
              <button
                onClick={() =>
                  router.push(`/times/${timeId}/jogadores/${jogador.id}/editar`)
                }
                className="flex items-center justify-center gap-2 h-[38px] px-4 rounded-[8px] border border-[#10B981] text-[#065F46] text-[13px] font-medium hover:bg-[#F0FDF4] transition-colors w-full min-[500px]:w-auto"
              >
                <Pencil size={14} color="#10B981" />
                Editar
              </button>
              <button
                onClick={() =>
                  router.push(`/times/${timeId}/jogadores/${jogador.id}/transferir`)
                }
                className="flex items-center justify-center gap-2 h-[38px] px-4 rounded-[8px] border border-[#C7D2FE] text-[#4F6BED] text-[13px] font-medium hover:bg-[#EEF2FF] transition-colors w-full min-[500px]:w-auto"
              >
                <ArrowRightLeft size={14} />
                Transferir
              </button>
              <button
                onClick={() =>
                  router.push(`/times/${timeId}/jogadores/${jogador.id}/excluir`)
                }
                className="flex items-center justify-center gap-2 h-[38px] px-4 rounded-[8px] border border-[#FECACA] text-[#EF4444] text-[13px] font-medium hover:bg-[#FEF2F2] transition-colors w-full min-[500px]:w-auto min-[500px]:ml-auto"
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-[#1E293B] font-bold text-[16px] mb-4">
            Estatísticas na Temporada
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              label="Jogos"
              value={jogador.jogos}
              icon={IconBola}
              color="#4F6BED"
              bg="#F5F7FF"
            />
            <StatCard
              label="Gols"
              value={jogador.gols}
              icon={
                <span style={{ fontSize: 16, lineHeight: 1 }}>⚽</span>
              }
              color="#22C55E"
              bg="#F0FDF4"
            />
            <StatCard
              label="Assistências"
              value={jogador.assistencias}
              icon={IconEstrela}
              color="#6366F1"
              bg="#EEF2FF"
            />
            <StatCard
              label="Cartões Amarelos"
              value={jogador.cartoesAmarelos}
              icon={<span style={{ fontSize: 16, lineHeight: 1 }}>🟨</span>}
              color="#D97706"
              bg="#FFFBEB"
            />
            <StatCard
              label="Cartões Vermelhos"
              value={jogador.cartoesVermelhos}
              icon={<span style={{ fontSize: 16, lineHeight: 1 }}>🟥</span>}
              color="#EF4444"
              bg="#FEF2F2"
            />
            <StatCard
              label="Média de Gols"
              value={
                jogador.jogos > 0
                  ? parseFloat((jogador.gols / jogador.jogos).toFixed(1))
                  : 0
              }
              icon={IconGrafico}
              color="#0EA5E9"
              bg="#F0F9FF"
            />
          </div>
        </div>

        {/* Situação disciplinar detalhada */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-[#1E293B] font-bold text-[16px] mb-4">
            Situação Disciplinar
          </h2>

          <div className="flex flex-col gap-3">
            {/* Barra de cartões amarelos */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#374151] text-[13px] font-medium">
                  🟨 Cartões Amarelos
                </span>
                <span className="text-[#D97706] text-[13px] font-bold">
                  {jogador.cartoesAmarelos} / 5
                </span>
              </div>
              <div className="h-2 bg-[#FEF9C3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] rounded-full transition-all"
                  style={{
                    width: `${Math.min((jogador.cartoesAmarelos / 5) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-[#94A3B8] text-[11px] mt-1">
                {jogador.cartoesAmarelos >= 5
                  ? "Suspenso por acúmulo de cartões amarelos"
                  : jogador.cartoesAmarelos >= 3
                  ? `Atenção: ${5 - jogador.cartoesAmarelos} cartão(ões) para suspensão`
                  : `${5 - jogador.cartoesAmarelos} cartão(ões) para suspensão`}
              </p>
            </div>

            {/* Status cartão vermelho */}
            <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[#F8FAFC] border border-[#E5E7EB]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  jogador.cartoesVermelhos > 0
                    ? "bg-[#FEF2F2]"
                    : "bg-[#F0FDF4]"
                }`}
              >
                <span className="text-[16px]">
                  {jogador.cartoesVermelhos > 0 ? "🟥" : "✅"}
                </span>
              </div>
              <div>
                <p
                  className={`text-[13px] font-semibold ${
                    jogador.cartoesVermelhos > 0
                      ? "text-[#EF4444]"
                      : "text-[#16A34A]"
                  }`}
                >
                  {jogador.cartoesVermelhos > 0
                    ? `Suspenso — ${jogador.cartoesVermelhos} cartão(ões) vermelho(s)`
                    : "Apto para jogar"}
                </p>
                <p className="text-[#94A3B8] text-[11px]">
                  {jogador.cartoesVermelhos > 0
                    ? "Verifique o regulamento para saber o número de jogos de suspensão"
                    : "Nenhum cartão vermelho na temporada"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}