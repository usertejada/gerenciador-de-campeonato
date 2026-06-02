// app/historico/page.tsx

"use client";

import { useState, useMemo } from "react";
import {
  Clock,
  Search,
  Calendar,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Swords,
  MapPin,
  X,
} from "lucide-react";

// ─── Mock de dados ─────────────────────────────────────────────────────────────
const HISTORICO_MOCK = [
  { id: 1,  data: "2025-06-01", hora: "08:00", timeA: { nome: "Águias SC",   escudo: "🦅" }, timeB: { nome: "Leões FC",    escudo: "🦁" }, placarA: 3, placarB: 1, campeonato: "Copa Verão 2025",    local: "Arena Central" },
  { id: 2,  data: "2025-06-01", hora: "08:50", timeA: { nome: "Panteras FC", escudo: "🐆" }, timeB: { nome: "Dragões SC",  escudo: "🐉" }, placarA: 2, placarB: 2, campeonato: "Copa Verão 2025",    local: "Arena Central" },
  { id: 3,  data: "2025-06-01", hora: "09:40", timeA: { nome: "Falcões EC",  escudo: "🦆" }, timeB: { nome: "Tubarões FC", escudo: "🦈" }, placarA: 1, placarB: 4, campeonato: "Copa Verão 2025",    local: "Arena Central" },
  { id: 4,  data: "2025-05-28", hora: "09:00", timeA: { nome: "Lobos SC",    escudo: "🐺" }, timeB: { nome: "Trovões EC",  escudo: "⚡" }, placarA: 0, placarB: 2, campeonato: "Liga Empresarial",   local: "Quadra Norte" },
  { id: 5,  data: "2025-05-28", hora: "09:50", timeA: { nome: "Leões FC",    escudo: "🦁" }, timeB: { nome: "Falcões EC",  escudo: "🦆" }, placarA: 3, placarB: 3, campeonato: "Liga Empresarial",   local: "Quadra Norte" },
  { id: 6,  data: "2025-05-20", hora: "08:00", timeA: { nome: "Dragões SC",  escudo: "🐉" }, timeB: { nome: "Águias SC",   escudo: "🦅" }, placarA: 1, placarB: 2, campeonato: "Torneio Relâmpago",  local: "Campo Sul" },
  { id: 7,  data: "2025-05-20", hora: "08:40", timeA: { nome: "Tubarões FC", escudo: "🦈" }, timeB: { nome: "Panteras FC", escudo: "🐆" }, placarA: 5, placarB: 2, campeonato: "Torneio Relâmpago",  local: "Campo Sul" },
  { id: 8,  data: "2025-05-20", hora: "09:20", timeA: { nome: "Trovões EC",  escudo: "⚡" }, timeB: { nome: "Lobos SC",    escudo: "🐺" }, placarA: 3, placarB: 1, campeonato: "Torneio Relâmpago",  local: "Campo Sul" },
  { id: 9,  data: "2025-05-10", hora: "10:00", timeA: { nome: "Águias SC",   escudo: "🦅" }, timeB: { nome: "Trovões EC",  escudo: "⚡" }, placarA: 2, placarB: 0, campeonato: "Copa da Cidade",     local: "Estádio Municipal" },
  { id: 10, data: "2025-05-10", hora: "11:00", timeA: { nome: "Leões FC",    escudo: "🦁" }, timeB: { nome: "Tubarões FC", escudo: "🦈" }, placarA: 1, placarB: 1, campeonato: "Copa da Cidade",     local: "Estádio Municipal" },
  { id: 11, data: "2025-05-10", hora: "12:00", timeA: { nome: "Panteras FC", escudo: "🐆" }, timeB: { nome: "Lobos SC",    escudo: "🐺" }, placarA: 4, placarB: 2, campeonato: "Copa da Cidade",     local: "Estádio Municipal" },
  { id: 12, data: "2025-05-10", hora: "13:00", timeA: { nome: "Dragões SC",  escudo: "🐉" }, timeB: { nome: "Falcões EC",  escudo: "🦆" }, placarA: 0, placarB: 1, campeonato: "Copa da Cidade",     local: "Estádio Municipal" },
  { id: 13, data: "2025-05-02", hora: "08:00", timeA: { nome: "Falcões EC",  escudo: "🦆" }, timeB: { nome: "Águias SC",   escudo: "🦅" }, placarA: 2, placarB: 3, campeonato: "Liga Empresarial",   local: "Quadra Norte" },
  { id: 14, data: "2025-05-02", hora: "08:50", timeA: { nome: "Lobos SC",    escudo: "🐺" }, timeB: { nome: "Leões FC",    escudo: "🦁" }, placarA: 1, placarB: 2, campeonato: "Liga Empresarial",   local: "Quadra Norte" },
  { id: 15, data: "2025-04-25", hora: "09:00", timeA: { nome: "Trovões EC",  escudo: "⚡" }, timeB: { nome: "Dragões SC",  escudo: "🐉" }, placarA: 3, placarB: 3, campeonato: "Copa Verão 2025",    local: "Arena Central" },
  { id: 16, data: "2025-04-25", hora: "09:50", timeA: { nome: "Tubarões FC", escudo: "🦈" }, timeB: { nome: "Falcões EC",  escudo: "🦆" }, placarA: 2, placarB: 0, campeonato: "Copa Verão 2025",    local: "Arena Central" },
];

const GRUPOS_POR_PAGINA = 3;

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatarDataBR(data: string) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatarDataCurta(data: string) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── EscudoTime ────────────────────────────────────────────────────────────────
function EscudoTime({ nome, escudo, size = 40 }: { nome: string; escudo?: string; size?: number }) {
  const initials = nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const isEmoji = escudo && [...escudo].length <= 2 && /\p{Emoji}/u.test(escudo);
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center shrink-0 overflow-hidden"
    >
      {isEmoji ? (
        <span style={{ fontSize: size * 0.5 }}>{escudo}</span>
      ) : escudo ? (
        <img src={escudo} alt={nome} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-[#4F6BED]" style={{ fontSize: size * 0.3 }}>{initials}</span>
      )}
    </div>
  );
}

// ─── CardHistorico ─────────────────────────────────────────────────────────────
function CardHistorico({ jogo }: { jogo: typeof HISTORICO_MOCK[0] }) {
  const empate = jogo.placarA === jogo.placarB;
  const venceuA = jogo.placarA > jogo.placarB;

  function corPlacar(isA: boolean) {
    if (empate) return "#D97706";
    return (isA ? venceuA : !venceuA) ? "#16A34A" : "#94A3B8";
  }

  return (
    <div className="bg-white rounded-[14px] border border-[#C4C9D4] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-3 hover:border-[#C7D2FE] hover:shadow-md transition-all">

      {/* Status + hora */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
          empate
            ? "text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]"
            : "text-[#16A34A] bg-[#F0FDF4] border-[#86EFAC]"
        }`}>
          {empate ? "Empate" : venceuA ? `${jogo.timeA.escudo} Vitória` : `${jogo.timeB.escudo} Vitória`}
        </span>
        <span className="flex items-center gap-1 text-[#5d646d] text-[11px]">
          <Clock size={10} color="#5d646d" />
          {jogo.hora}
        </span>
      </div>

      {/* Times + placar */}
      <div className="flex items-center justify-between gap-2">
        {/* Time A */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <EscudoTime nome={jogo.timeA.nome} escudo={jogo.timeA.escudo} size={40} />
          <span className="text-[#1E293B] font-bold text-[12px] text-center leading-tight">{jogo.timeA.nome}</span>
          <span className="font-extrabold text-[24px] leading-none" style={{ color: corPlacar(true) }}>
            {jogo.placarA}
          </span>
        </div>

        {/* Separador */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[#CBD5E1] font-bold text-[15px] leading-none">×</span>
        </div>

        {/* Time B */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <EscudoTime nome={jogo.timeB.nome} escudo={jogo.timeB.escudo} size={40} />
          <span className="text-[#1E293B] font-bold text-[12px] text-center leading-tight">{jogo.timeB.nome}</span>
          <span className="font-extrabold text-[24px] leading-none" style={{ color: corPlacar(false) }}>
            {jogo.placarB}
          </span>
        </div>
      </div>

      {/* Rodapé */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F1F5F9]">
        <span className="flex items-center gap-1 text-[#5d646d] text-[11px] truncate">
          <Trophy size={10} color="#5d646d" />
          <span className="truncate">{jogo.campeonato}</span>
        </span>
        {jogo.local && (
          <span className="flex items-center gap-1 text-[#5d646d] text-[11px] truncate">
            <MapPin size={10} color="#5d646d" />
            <span className="truncate">{jogo.local}</span>
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Página ────────────────────────────────────────────────────────────────────
export default function HistoricoPage() {
  const [filtroData, setFiltroData] = useState("");
  const [pagina, setPagina] = useState(1);

  const jogosFiltrados = useMemo(() => {
    if (!filtroData) return HISTORICO_MOCK;
    return HISTORICO_MOCK.filter((j) => j.data === filtroData);
  }, [filtroData]);

  const gruposPorData = useMemo(() => {
    const mapa = new Map<string, typeof HISTORICO_MOCK>();
    for (const jogo of jogosFiltrados) {
      if (!mapa.has(jogo.data)) mapa.set(jogo.data, []);
      mapa.get(jogo.data)!.push(jogo);
    }
    return Array.from(mapa.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [jogosFiltrados]);

  const totalPaginas = Math.ceil(gruposPorData.length / GRUPOS_POR_PAGINA);
  const gruposPagina = gruposPorData.slice(
    (pagina - 1) * GRUPOS_POR_PAGINA,
    pagina * GRUPOS_POR_PAGINA
  );

  function limparFiltro() {
    setFiltroData("");
    setPagina(1);
  }

  function mudarPagina(nova: number) {
    if (nova < 1 || nova > totalPaginas) return;
    setPagina(nova);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function paginasVisiveis(): (number | "...")[] {
    if (totalPaginas <= 5) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (pagina > 3) pages.push("...");
    for (let i = Math.max(2, pagina - 1); i <= Math.min(totalPaginas - 1, pagina + 1); i++) pages.push(i);
    if (pagina < totalPaginas - 2) pages.push("...");
    pages.push(totalPaginas);
    return pages;
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 mb-6 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between">
        <div>
          <h1 className="text-[#1E293B] font-extrabold text-[26px] leading-tight">Histórico</h1>
          <p className="text-[#94A3B8] text-[14px] mt-0.5">
            Todos os jogos finalizados, organizados por data
          </p>
        </div>

        {/* Filtro */}
        <div className="flex items-center gap-2 self-start min-[640px]:self-auto">
          <div className="relative">
            <Search size={13} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={filtroData}
              onChange={(e) => { setFiltroData(e.target.value); setPagina(1); }}
              className="h-[40px] pl-8 pr-3 rounded-[10px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[13px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all shadow-sm"
            />
          </div>
          {filtroData && (
            <button
              onClick={limparFiltro}
              className="flex items-center gap-1.5 h-[40px] px-3 rounded-[10px] border border-[#D1D5DB] bg-white text-[#94A3B8] text-[13px] hover:bg-[#F9FAFB] hover:text-[#374151] transition-colors shadow-sm"
            >
              <X size={13} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Aviso de filtro ativo */}
      {filtroData && (
        <div className="flex items-center gap-2 mb-5 bg-[#EEF2FF] border border-[#C7D2FE] rounded-[8px] px-4 py-2.5 w-fit">
          <Calendar size={13} color="#4F6BED" />
          <span className="text-[#4F6BED] text-[13px] font-medium">
            {jogosFiltrados.length} {jogosFiltrados.length === 1 ? "jogo encontrado" : "jogos encontrados"} em {formatarDataCurta(filtroData)}
          </span>
        </div>
      )}

      {/* ── Vazio ── */}
      {gruposPagina.length === 0 && (
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] flex flex-col items-center justify-center py-16 gap-3">
          <Swords size={40} color="#CBD5E1" />
          <p className="text-[#94A3B8] text-[15px]">
            {filtroData ? "Nenhum jogo encontrado nessa data." : "Nenhum jogo finalizado ainda."}
          </p>
          {filtroData && (
            <button
              onClick={limparFiltro}
              className="flex items-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[13px] px-4 py-2 rounded-[8px] transition-colors"
            >
              <X size={14} />
              Limpar filtro
            </button>
          )}
        </div>
      )}

      {/* ── Grupos por data ── */}
      <div className="flex flex-col gap-8">
        {gruposPagina.map(([data, jogos]) => (
          <div key={data}>

            {/* Separador de data — igual ao partidas/page.tsx */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 bg-white border border-[#C4C9D4] rounded-full px-3 py-1 shadow-sm">
                <Calendar size={13} color="#4F6BED" />
                <span className="text-[#374151] text-[13px] font-semibold capitalize">
                  {formatarDataBR(data)}
                </span>
              </div>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-[#94A3B8] text-[12px]">
                {jogos.length} {jogos.length === 1 ? "jogo" : "jogos"}
              </span>
            </div>

            {/* Grid 3 colunas — igual ao partidas/page.tsx */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {jogos.map((jogo) => (
                <CardHistorico key={jogo.id} jogo={jogo} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Paginação ── */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8 pb-4">
          <button
            onClick={() => mudarPagina(pagina - 1)}
            disabled={pagina === 1}
            className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={15} />
          </button>

          {paginasVisiveis().map((p, i) =>
            p === "..." ? (
              <span key={`el-${i}`} className="w-[34px] h-[34px] flex items-center justify-center text-[#94A3B8] text-[13px]">...</span>
            ) : (
              <button
                key={p}
                onClick={() => mudarPagina(p as number)}
                className={`w-[34px] h-[34px] rounded-[8px] text-[13px] font-semibold transition-colors border ${
                  pagina === p
                    ? "bg-[#4F6BED] text-white border-[#4F6BED]"
                    : "bg-white text-[#374151] border-[#D1D5DB] hover:bg-[#F9FAFB]"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => mudarPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
            className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

    </div>
  );
}