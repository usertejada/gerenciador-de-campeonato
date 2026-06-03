"use client";

import {
  Trophy,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  UserPlus,
  Settings,
  BarChart2,
  Search,
} from "lucide-react";

// ── Dados ──────────────────────────────────────────────────────────────
const stats = [
  { label: "Total Campeonatos", value: "12", sub: "+2 este mês",     icon: Trophy,       iconBg: "#4F6BED" },
  { label: "Times Cadastrados", value: "48", sub: "+5 esta semana",  icon: Users,        iconBg: "#10B981" },
  { label: "Próximos Jogos",    value: "9",  sub: "+3 agendados",    icon: Calendar,     iconBg: "#6366F1" },
  { label: "Jogos Realizados",  value: "134",sub: "+18 este mês",    icon: CheckCircle,  iconBg: "#F97316" },
];

type BadgeStatus = "Em Andamento" | "Pendente" | "Finalizado";

const campeonatos = [
  { nome: "Copa Verão 2025",     desc: "Torneio de futebol society com 16 times participantes",   status: "Em Andamento" as BadgeStatus, data: "Jan–Mar 2025", times: "16 times",  formato: "Mata-mata" },
  { nome: "Liga Empresarial",    desc: "Campeonato interno entre departamentos da empresa",        status: "Em Andamento" as BadgeStatus, data: "Fev–Abr 2025", times: "8 times",   formato: "Pontos corridos" },
  { nome: "Torneio Relâmpago",   desc: "Competição rápida de fim de semana, formato eliminatório",status: "Pendente"     as BadgeStatus, data: "Mar 2025",     times: "12 times",  formato: "Eliminatório" },
  { nome: "Champions Interno",   desc: "Edição especial anual de futebol entre colaboradores",    status: "Finalizado"   as BadgeStatus, data: "Dez 2024",     times: "20 times",  formato: "Grupos + mata-mata" },
];

const jogos = [
  { horario: "Hoje, 19h",   timeA: "Leões FC",      timeB: "Águias SC",    local: "Campo Central",    placar: null },
  { horario: "Amanhã, 15h", timeA: "Trovões EC",    timeB: "Panteras FC",  local: "Quadra 3 - Bloco B",placar: null },
  { horario: "25 Jan, 10h", timeA: "Dragões SC",    timeB: "Falcões EC",   local: "Arena Principal",  placar: "2 x 1" },
];

const acoes = [
  { icon: FileText, label: "Gerar Relatório"   },
  { icon: UserPlus, label: "Adicionar Time"    },
  { icon: Calendar, label: "Agendar Partida"   },
  { icon: Settings, label: "Configurações"     },
  { icon: BarChart2,label: "Ver Estatísticas"  },
  { icon: Trophy,   label: "Novo Campeonato"   },
];

// ── Badge ───────────────────────────────────────────────────────────────
function Badge({ status }: { status: BadgeStatus }) {
  const map: Record<BadgeStatus, { bg: string; text: string }> = {
    "Em Andamento": { bg: "#D1FAE5", text: "#065F46" },
    "Pendente":     { bg: "#FEF3C7", text: "#92400E" },
    "Finalizado":   { bg: "#F3F4F6", text: "#6B7280" },
  };
  const { bg, text } = map[status];
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: bg, color: text }}
    >
      {status}
    </span>
  );
}

// ── Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between">
        <div>
          <h1 className="text-[#1E293B] font-extrabold text-[22px] lg:text-[28px] leading-tight">
            Dashboard
          </h1>
          <p className="text-[#94A3B8] text-[14px] font-normal mt-1">
            Visão geral dos seus campeonatos
          </p>
        </div>
        <div className="relative w-full min-[640px]:w-[280px] shrink-0">
          <Search size={15} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar campeonato, time..."
            className="w-full h-[38px] pl-9 pr-4 rounded-[8px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[13px] placeholder:text-[#94A3B8] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
          />
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-4 lg:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-shadow"
            >
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3" style={{ backgroundColor: stat.iconBg }}>
                <Icon size={18} color="#FFFFFF" />
              </div>
              <p className="text-[#94A3B8] font-semibold text-[10px] uppercase tracking-[0.08em] mb-1">{stat.label}</p>
              <p className="text-[#1E293B] font-bold text-[30px] leading-none mb-1">{stat.value}</p>
              <p className="text-[#94A3B8] text-[11px] font-normal flex items-center gap-1">
                <span className="text-[#10B981]">↗</span>{stat.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Campeonatos Ativos — 60% */}
        <div className="lg:col-span-3 bg-white rounded-[12px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={20} color="#4F6BED" />
            <h2 className="text-[#1E293B] font-bold text-[16px]">Campeonatos Ativos</h2>
          </div>

          <div className="flex flex-col gap-3">
            {campeonatos.map((c) => (
              <div
                key={c.nome}
                className="border border-[#E5E7EB] rounded-[8px] p-3 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                    <Trophy size={16} color="#4F6BED" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[#1E293B] font-semibold text-[14px] truncate">{c.nome}</span>
                      <Badge status={c.status} />
                    </div>
                    <p className="text-[#94A3B8] text-[12px] line-clamp-2 mb-2">{c.desc}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-[#94A3B8] text-[11px]">
                        <Calendar size={12} color="#94A3B8" />{c.data}
                      </span>
                      <span className="flex items-center gap-1 text-[#94A3B8] text-[11px]">
                        <Users size={12} color="#94A3B8" />{c.times}
                      </span>
                      <span className="flex items-center gap-1 text-[#94A3B8] text-[11px]">
                        <Trophy size={12} color="#94A3B8" />{c.formato}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna direita — 40% */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Próximos Jogos */}
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} color="#4F6BED" />
              <h2 className="text-[#1E293B] font-bold text-[16px]">Próximos Jogos</h2>
            </div>

            <div className="flex flex-col gap-3">
              {jogos.map((j, i) => (
                <div key={i} className="border border-[#E5E7EB] rounded-[8px] p-3">
                  <div className="flex items-center gap-1 mb-2">
                    <Clock size={12} color="#94A3B8" />
                    <span className="text-[#94A3B8] text-[11px]">{j.horario}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[#1E293B] font-semibold text-[13px] truncate">{j.timeA}</span>
                    {j.placar ? (
                      <span className="text-[#4F6BED] font-black text-[18px] shrink-0">{j.placar}</span>
                    ) : (
                      <span className="bg-[#F1F5F9] text-[#94A3B8] font-bold text-[11px] px-2 py-1 rounded-[4px] shrink-0">VS</span>
                    )}
                    <span className="text-[#1E293B] font-semibold text-[13px] truncate text-right">{j.timeB}</span>
                  </div>

                  <div className="flex items-center justify-center gap-1">
                    <MapPin size={12} color="#94A3B8" />
                    <span className="text-[#94A3B8] text-[11px]">{j.local}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={20} color="#4F6BED" />
              <h2 className="text-[#1E293B] font-bold text-[16px]">Ações Rápidas</h2>
            </div>

            <div className="flex flex-col gap-1">
              {acoes.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] hover:bg-[#F1F5F9] transition-colors group w-full text-left"
                  >
                    <Icon size={16} className="text-[#94A3B8] group-hover:text-[#4F6BED] transition-colors shrink-0" />
                    <span className="text-[#1E293B] font-medium text-[13px]">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}