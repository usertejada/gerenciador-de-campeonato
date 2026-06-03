// app/pendencias/_components/CartoesTab.tsx

"use client";

import { useState, useMemo } from "react";
import { Square, Ban, ShieldOff } from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────────────────────
type TipoCartao = "Amarelo" | "Vermelho";

interface Cartao {
  id: number;
  jogador: string;
  time: string;
  escudo: string;
  tipo: TipoCartao;
  campeonato: string;
  rodada: string;
  data: string;
  acumulados?: number; // só para amarelos
  suspensaoJogos?: number; // para vermelhos ou acúmulo
}

interface Suspenso {
  id: number;
  jogador: string;
  time: string;
  escudo: string;
  campeonato: string;
  motivoCartao: TipoCartao | "Acúmulo";
  jogosFaltam: number;
  proximoJogo: string;
}

// ── Mock ─────────────────────────────────────────────────────────────────────
const CARTOES_MOCK: Cartao[] = [
  { id: 1,  jogador: "Rafael Souza",     time: "Tubarões FC", escudo: "🦈", tipo: "Amarelo",  campeonato: "Copa Verão 2025",   rodada: "Rodada 8", data: "28/05/2025", acumulados: 3 },
  { id: 2,  jogador: "Diego Martins",    time: "Trovões EC",  escudo: "⚡", tipo: "Vermelho", campeonato: "Liga Empresarial",  rodada: "Rodada 7", data: "25/05/2025", suspensaoJogos: 2 },
  { id: 3,  jogador: "Lucas Ferreira",   time: "Panteras FC", escudo: "🐆", tipo: "Amarelo",  campeonato: "Copa Verão 2025",   rodada: "Rodada 8", data: "28/05/2025", acumulados: 2 },
  { id: 4,  jogador: "André Lima",       time: "Leões FC",    escudo: "🦁", tipo: "Amarelo",  campeonato: "Liga Empresarial",  rodada: "Rodada 6", data: "22/05/2025", acumulados: 3 },
  { id: 5,  jogador: "Marcos Oliveira",  time: "Dragões SC",  escudo: "🐉", tipo: "Vermelho", campeonato: "Torneio Relâmpago", rodada: "Rodada 5", data: "20/05/2025", suspensaoJogos: 1 },
  { id: 6,  jogador: "Bruno Santos",     time: "Falcões EC",  escudo: "🦆", tipo: "Amarelo",  campeonato: "Copa da Cidade",    rodada: "Rodada 9", data: "29/05/2025", acumulados: 2 },
  { id: 7,  jogador: "Thiago Alves",     time: "Lobos SC",    escudo: "🐺", tipo: "Amarelo",  campeonato: "Copa Verão 2025",   rodada: "Rodada 8", data: "28/05/2025", acumulados: 1 },
  { id: 8,  jogador: "Felipe Costa",     time: "Águias SC",   escudo: "🦅", tipo: "Vermelho", campeonato: "Copa da Cidade",    rodada: "Rodada 7", data: "26/05/2025", suspensaoJogos: 3 },
  { id: 9,  jogador: "Rodrigo Nunes",    time: "Tubarões FC", escudo: "🦈", tipo: "Amarelo",  campeonato: "Liga Empresarial",  rodada: "Rodada 8", data: "27/05/2025", acumulados: 3 },
  { id: 10, jogador: "Gustavo Pinto",    time: "Trovões EC",  escudo: "⚡", tipo: "Amarelo",  campeonato: "Torneio Relâmpago", rodada: "Rodada 6", data: "21/05/2025", acumulados: 2 },
];

const SUSPENSOS_MOCK: Suspenso[] = [
  { id: 1, jogador: "Diego Martins",   time: "Trovões EC",  escudo: "⚡", campeonato: "Liga Empresarial",  motivoCartao: "Vermelho",  jogosFaltam: 2, proximoJogo: "01/06/2025" },
  { id: 2, jogador: "Rafael Souza",    time: "Tubarões FC", escudo: "🦈", campeonato: "Copa Verão 2025",   motivoCartao: "Acúmulo",   jogosFaltam: 1, proximoJogo: "02/06/2025" },
  { id: 3, jogador: "Felipe Costa",    time: "Águias SC",   escudo: "🦅", campeonato: "Copa da Cidade",    motivoCartao: "Vermelho",  jogosFaltam: 3, proximoJogo: "03/06/2025" },
  { id: 4, jogador: "André Lima",      time: "Leões FC",    escudo: "🦁", campeonato: "Liga Empresarial",  motivoCartao: "Acúmulo",   jogosFaltam: 1, proximoJogo: "01/06/2025" },
];

// ── Sub-aba interna ───────────────────────────────────────────────────────────
const SUB_TABS = [
  { id: "todos",     label: "Todos"      },
  { id: "amarelos",  label: "Amarelos"   },
  { id: "vermelhos", label: "Vermelhos"  },
  { id: "suspensos", label: "Suspensões" },
] as const;

type SubTab = (typeof SUB_TABS)[number]["id"];

// ── Componentes auxiliares ────────────────────────────────────────────────────
function BadgeCartao({ tipo }: { tipo: TipoCartao }) {
  return tipo === "Amarelo" ? (
    <span className="inline-flex items-center gap-1 bg-[#FEF9C3] text-[#CA8A04] border border-[#FDE047] rounded-full px-2 py-0.5 text-[11px] font-semibold">
      <Square size={9} fill="#CA8A04" strokeWidth={0} />
      Amarelo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-full px-2 py-0.5 text-[11px] font-semibold">
      <Square size={9} fill="#DC2626" strokeWidth={0} />
      Vermelho
    </span>
  );
}

function AcumuladoDots({ n }: { n: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-sm ${i <= n ? "bg-[#CA8A04]" : "bg-[#E5E7EB]"}`}
        />
      ))}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function CartoesTab() {
  const [subTab, setSubTab] = useState<SubTab>("todos");

  const cartoesFiltrados = useMemo(() => {
    if (subTab === "amarelos")  return CARTOES_MOCK.filter((c) => c.tipo === "Amarelo");
    if (subTab === "vermelhos") return CARTOES_MOCK.filter((c) => c.tipo === "Vermelho");
    if (subTab === "todos")     return CARTOES_MOCK;
    return [];
  }, [subTab]);

  const totalAmarelos  = CARTOES_MOCK.filter((c) => c.tipo === "Amarelo").length;
  const totalVermelhos = CARTOES_MOCK.filter((c) => c.tipo === "Vermelho").length;

  return (
    <div className="flex flex-col gap-4">

      {/* ── Cards de resumo ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">

        <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#FEF9C3] flex items-center justify-center">
              <Square size={13} fill="#CA8A04" strokeWidth={0} />
            </div>
            <span className="text-[#64748B] text-[12px] font-medium">Amarelos</span>
          </div>
          <p className="text-[#1E293B] font-extrabold text-[22px] leading-tight">{totalAmarelos}</p>
        </div>

        <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#FEE2E2] flex items-center justify-center">
              <Square size={13} fill="#DC2626" strokeWidth={0} />
            </div>
            <span className="text-[#64748B] text-[12px] font-medium">Vermelhos</span>
          </div>
          <p className="text-[#1E293B] font-extrabold text-[22px] leading-tight">{totalVermelhos}</p>
        </div>

        <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center">
              <Ban size={13} color="#4F6BED" />
            </div>
            <span className="text-[#64748B] text-[12px] font-medium">Suspensos</span>
          </div>
          <p className="text-[#1E293B] font-extrabold text-[22px] leading-tight">{SUSPENSOS_MOCK.length}</p>
        </div>

      </div>

      {/* ── Sub-tabs ─────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 bg-white border border-[#C4C9D4] rounded-[10px] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.04)] w-fit">
        {SUB_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all ${
              subTab === id
                ? "bg-[#4F6BED] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tabela de cartões ────────────────────────────────────────── */}
      {subTab !== "suspensos" && (
        <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Cabeçalho */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_140px_120px_90px] items-center gap-3 px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
            <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">Jogador</span>
            <span className="hidden sm:block text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">Campeonato</span>
            <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Tipo</span>
            <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Acum.</span>
          </div>

          {cartoesFiltrados.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_140px_120px_90px] items-center gap-3 px-4 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors"
            >
              {/* Jogador */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center shrink-0">
                  <span className="text-[16px]">{c.escudo}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[#1E293B] font-semibold text-[13px] truncate">{c.jogador}</p>
                  <p className="text-[#94A3B8] text-[11px] truncate">{c.time} · {c.rodada}</p>
                </div>
              </div>

              {/* Campeonato */}
              <span className="hidden sm:block text-[#64748B] text-[12px] truncate">{c.campeonato}</span>

              {/* Badge tipo */}
              <div className="flex justify-center">
                <BadgeCartao tipo={c.tipo} />
              </div>

              {/* Acumulados / jogos suspensão */}
              <div className="flex justify-center">
                {c.tipo === "Amarelo" && c.acumulados !== undefined ? (
                  <AcumuladoDots n={c.acumulados} />
                ) : c.suspensaoJogos !== undefined ? (
                  <span className="text-[#DC2626] font-bold text-[13px]">{c.suspensaoJogos}j</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Lista de suspensos ───────────────────────────────────────── */}
      {subTab === "suspensos" && (
        <div className="bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Cabeçalho */}
          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_110px_100px] items-center gap-3 px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
            <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">Jogador</span>
            <span className="hidden sm:block text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide">Campeonato</span>
            <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Motivo</span>
            <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wide text-center">Jogos rest.</span>
          </div>

          {SUSPENSOS_MOCK.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_110px_100px] items-center gap-3 px-4 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors"
            >
              {/* Jogador */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center shrink-0">
                  <span className="text-[16px]">{s.escudo}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[#1E293B] font-semibold text-[13px] truncate">{s.jogador}</p>
                    <ShieldOff size={12} color="#DC2626" className="shrink-0" />
                  </div>
                  <p className="text-[#94A3B8] text-[11px] truncate">{s.time}</p>
                </div>
              </div>

              {/* Campeonato */}
              <span className="hidden sm:block text-[#64748B] text-[12px] truncate">{s.campeonato}</span>

              {/* Motivo */}
              <div className="flex justify-center">
                {s.motivoCartao === "Vermelho" ? (
                  <span className="inline-flex items-center gap-1 bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-full px-2 py-0.5 text-[11px] font-semibold">
                    <Square size={9} fill="#DC2626" strokeWidth={0} />
                    Vermelho
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-[#FEF9C3] text-[#CA8A04] border border-[#FDE047] rounded-full px-2 py-0.5 text-[11px] font-semibold">
                    <Square size={9} fill="#CA8A04" strokeWidth={0} />
                    Acúmulo
                  </span>
                )}
              </div>

              {/* Jogos restantes */}
              <div className="flex justify-center items-center gap-1">
                <span className="text-[#DC2626] font-extrabold text-[14px]">{s.jogosFaltam}</span>
                <span className="text-[#94A3B8] text-[11px]">jogo{s.jogosFaltam > 1 ? "s" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}