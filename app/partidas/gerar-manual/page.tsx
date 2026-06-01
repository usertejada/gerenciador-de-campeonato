// app/partidas/gerar-manual/page.tsx

"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  MapPin,
  Plus,
  Trash2,
  Swords,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Users,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Mock de times cadastrados ────────────────────────────────────────────────
const TIMES_CADASTRADOS = [
  { id: 1, nome: "Águias SC", escudo: "🦅" },
  { id: 2, nome: "Leões FC", escudo: "🦁" },
  { id: 3, nome: "Panteras FC", escudo: "🐆" },
  { id: 4, nome: "Trovões EC", escudo: "⚡" },
  { id: 5, nome: "Dragões SC", escudo: "🐉" },
  { id: 6, nome: "Falcões EC", escudo: "🦆" },
  { id: 7, nome: "Tubarões FC", escudo: "🦈" },
  { id: 8, nome: "Lobos SC", escudo: "🐺" },
];

const CAMPEONATOS = [
  "Copa Verão 2025",
  "Liga Empresarial",
  "Torneio Relâmpago",
  "Copa da Cidade",
];

const DURACOES = [
  { label: "45min / 45min", sublabel: "Campo grande", value: "45/45" },
  { label: "20min / 20min", sublabel: "Futsal / Society", value: "20/20" },
  { label: "15min / 15min", sublabel: "Torneio rápido", value: "15/15" },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Confronto {
  id: number;
  timeAId: number | null;
  timeBId: number | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function calcularHorarios(
  horaInicial: string,
  duracaoValor: string,
  intervaloMin: number,
  quantidade: number
): string[] {
  if (!horaInicial) return [];
  const [h, m] = horaInicial.split(":").map(Number);
  const minutosDuracao = duracaoValor === "45/45" ? 90 : duracaoValor === "20/20" ? 40 : 30;
  const horarios: string[] = [];
  let totalMin = h * 60 + m;
  for (let i = 0; i < quantidade; i++) {
    const hh = Math.floor(totalMin / 60) % 24;
    const mm = totalMin % 60;
    horarios.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
    totalMin += minutosDuracao + intervaloMin;
  }
  return horarios;
}

function formatarDataBR(data: string) {
  if (!data) return "";
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SelectTime({
  value,
  onChange,
  placeholder,
  excluir,
}: {
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder: string;
  excluir: number[];
}) {
  const [open, setOpen] = useState(false);
  const timeSelecionado = TIMES_CADASTRADOS.find((t) => t.id === value);
  const timesDisponiveis = TIMES_CADASTRADOS.filter((t) => !excluir.includes(t.id));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 h-[42px] px-3 rounded-[10px] border text-[14px] transition-colors ${
          value
            ? "border-[#4F6BED] bg-[#EEF2FF] text-[#1E293B] font-semibold"
            : "border-[#D1D5DB] bg-white text-[#94A3B8]"
        }`}
      >
        <span className="truncate">
          {timeSelecionado
            ? `${timeSelecionado.escudo} ${timeSelecionado.nome}`
            : placeholder}
        </span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} color={value ? "#4F6BED" : "#94A3B8"} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#E5E7EB] rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
          {timesDisponiveis.length === 0 ? (
            <div className="px-4 py-3 text-[#94A3B8] text-[13px]">
              Nenhum time disponível
            </div>
          ) : (
            timesDisponiveis.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { onChange(t.id); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-[14px] text-[#374151] hover:bg-[#F8FAFC] transition-colors text-left"
              >
                <span>{t.escudo}</span>
                <span className="font-medium">{t.nome}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function GerarManualPage() {
  const router = useRouter();

  // Campos do formulário
  const [data, setData] = useState("");
  const [duracao, setDuracao] = useState("20/20");
  const [horaInicial, setHoraInicial] = useState("08:00");
  const [intervalo, setIntervalo] = useState(10);
  const [campeonato, setCampeonato] = useState("");
  const [local, setLocal] = useState("");
  const [confrontos, setConfrontos] = useState<Confronto[]>([
    { id: 1, timeAId: null, timeBId: null },
  ]);
  const [previewAberto, setPreviewAberto] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // ── Confrontos handlers ──────────────────────────────────────────────────
  const adicionarConfronto = () => {
    setConfrontos((prev) => [
      ...prev,
      { id: Date.now(), timeAId: null, timeBId: null },
    ]);
  };

  const removerConfronto = (id: number) => {
    setConfrontos((prev) => prev.filter((c) => c.id !== id));
  };

  const atualizarTimeA = (id: number, timeId: number | null) => {
    setConfrontos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, timeAId: timeId } : c))
    );
  };

  const atualizarTimeB = (id: number, timeId: number | null) => {
    setConfrontos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, timeBId: timeId } : c))
    );
  };

  // ── Validações ───────────────────────────────────────────────────────────
  const confrontosDuplicados = useMemo(() => {
    const pares = new Set<string>();
    const duplicados = new Set<number>();
    for (const c of confrontos) {
      if (!c.timeAId || !c.timeBId) continue;
      const chave = [Math.min(c.timeAId, c.timeBId), Math.max(c.timeAId, c.timeBId)].join("-");
      if (pares.has(chave)) duplicados.add(c.id);
      else pares.add(chave);
    }
    return duplicados;
  }, [confrontos]);

  const confrontosCompletos = confrontos.filter((c) => c.timeAId && c.timeBId && !confrontosDuplicados.has(c.id));
  const horarios = calcularHorarios(horaInicial, duracao, intervalo, confrontosCompletos.length);

  const formularioValido =
    data &&
    horaInicial &&
    campeonato &&
    confrontosCompletos.length > 0 &&
    confrontosDuplicados.size === 0;

  const handleSubmit = () => {
    if (!formularioValido) return;
    setEnviado(true);
    setTimeout(() => router.push("/partidas"), 2000);
  };

  // ── Tela de sucesso ──────────────────────────────────────────────────────
  if (enviado) {
    return (
      <div className="min-h-screen bg-[#F1F3F7] flex items-center justify-center px-4">
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 flex flex-col items-center gap-4 max-w-[400px] w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center">
            <CheckCircle2 size={32} color="#16A34A" />
          </div>
          <h2 className="text-[#1E293B] font-extrabold text-[22px]">Partidas criadas!</h2>
          <p className="text-[#94A3B8] text-[14px]">
            {confrontosCompletos.length} {confrontosCompletos.length === 1 ? "jogo foi gerado" : "jogos foram gerados"} com sucesso.
          </p>
          <p className="text-[#CBD5E1] text-[13px]">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      <div className="max-w-[720px] mx-auto">

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/partidas")}
            className="w-[36px] h-[36px] rounded-[10px] border border-[#E5E7EB] bg-white flex items-center justify-center hover:bg-[#F8FAFC] transition-colors shadow-sm"
          >
            <ArrowLeft size={16} color="#374151" />
          </button>
          <div>
            <h1 className="text-[#1E293B] font-extrabold text-[22px] leading-tight">
              Gerar Jogos Manuais
            </h1>
            <p className="text-[#94A3B8] text-[13px] mt-0.5">
              Selecione os confrontos e configure os detalhes
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          {/* ── Seção 1: Informações gerais ── */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
            <h2 className="text-[#1E293B] font-bold text-[15px] mb-4 flex items-center gap-2">
              <Calendar size={15} color="#4F6BED" />
              Informações do Dia
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Data */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] text-[13px] font-semibold">
                  Data do jogo <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="h-[42px] px-3 rounded-[10px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-all"
                />
              </div>

              {/* Hora inicial */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] text-[13px] font-semibold">
                  Hora do 1º jogo <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Clock size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="time"
                    value={horaInicial}
                    onChange={(e) => setHoraInicial(e.target.value)}
                    className="w-full h-[42px] pl-9 pr-3 rounded-[10px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-all"
                  />
                </div>
              </div>

              {/* Campeonato */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] text-[13px] font-semibold">
                  Campeonato <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Trophy size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={campeonato}
                    onChange={(e) => setCampeonato(e.target.value)}
                    className="w-full h-[42px] pl-9 pr-3 rounded-[10px] border border-[#D1D5DB] bg-white text-[14px] text-[#1E293B] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Selecionar campeonato</option>
                    {CAMPEONATOS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Local */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] text-[13px] font-semibold">
                  Local / Campo
                  <span className="text-[#94A3B8] font-normal ml-1">(opcional)</span>
                </label>
                <div className="relative">
                  <MapPin size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    placeholder="Ex: Campo Principal"
                    className="w-full h-[42px] pl-9 pr-3 rounded-[10px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-all placeholder:text-[#CBD5E1]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Seção 2: Tempo de jogo ── */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
            <h2 className="text-[#1E293B] font-bold text-[15px] mb-4 flex items-center gap-2">
              <Clock size={15} color="#4F6BED" />
              Tempo de Jogo
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {DURACOES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuracao(d.value)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-[12px] border-2 transition-all ${
                    duracao === d.value
                      ? "border-[#4F6BED] bg-[#EEF2FF]"
                      : "border-[#E5E7EB] bg-white hover:border-[#C7D2FE]"
                  }`}
                >
                  <span className={`font-bold text-[14px] ${duracao === d.value ? "text-[#4F6BED]" : "text-[#374151]"}`}>
                    {d.label}
                  </span>
                  <span className="text-[#94A3B8] text-[11px]">{d.sublabel}</span>
                </button>
              ))}
            </div>

            {/* Intervalo */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F1F5F9]">
              <div>
                <span className="text-[#374151] text-[13px] font-semibold">
                  Intervalo entre jogos
                </span>
                <p className="text-[#94A3B8] text-[12px] mt-0.5">
                  Tempo de descanso entre uma partida e outra
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIntervalo((v) => Math.max(0, v - 5))}
                  className="w-[30px] h-[30px] rounded-[8px] border border-[#E5E7EB] bg-white text-[#374151] font-bold text-[16px] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
                >
                  −
                </button>
                <span className="text-[#1E293B] font-bold text-[14px] w-[48px] text-center">
                  {intervalo}min
                </span>
                <button
                  type="button"
                  onClick={() => setIntervalo((v) => v + 5)}
                  className="w-[30px] h-[30px] rounded-[8px] border border-[#E5E7EB] bg-white text-[#374151] font-bold text-[16px] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* ── Seção 3: Confrontos ── */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#1E293B] font-bold text-[15px] flex items-center gap-2">
                <Users size={15} color="#4F6BED" />
                Confrontos
              </h2>
              <span className="text-[#94A3B8] text-[12px]">
                {confrontosCompletos.length} {confrontosCompletos.length === 1 ? "jogo" : "jogos"} prontos
              </span>
            </div>

            {/* Aviso sem times */}
            {TIMES_CADASTRADOS.length < 2 && (
              <div className="flex items-center gap-2 bg-[#FFFBEB] border border-[#FDE68A] rounded-[10px] px-4 py-3 mb-4">
                <AlertCircle size={14} color="#D97706" />
                <span className="text-[#D97706] text-[13px]">
                  Cadastre pelo menos 2 times para montar confrontos.
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {confrontos.map((c, idx) => {
                const isDuplicado = confrontosDuplicados.has(c.id);
                const timeA = TIMES_CADASTRADOS.find((t) => t.id === c.timeAId);
                const timeB = TIMES_CADASTRADOS.find((t) => t.id === c.timeBId);

                return (
                  <div
                    key={c.id}
                    className={`rounded-[12px] border-2 p-4 transition-all ${
                      isDuplicado
                        ? "border-[#FECACA] bg-[#FEF2F2]"
                        : c.timeAId && c.timeBId
                        ? "border-[#86EFAC] bg-[#F0FDF4]"
                        : "border-[#E5E7EB] bg-[#FAFAFA]"
                    }`}
                  >
                    {/* Número do jogo */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#94A3B8] text-[12px] font-semibold uppercase tracking-wide">
                        Jogo {idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {isDuplicado && (
                          <span className="flex items-center gap-1 text-[#EF4444] text-[11px] font-semibold">
                            <AlertCircle size={11} />
                            Confronto duplicado
                          </span>
                        )}
                        {confrontos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removerConfronto(c.id)}
                            className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Selects dos times */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <SelectTime
                        value={c.timeAId}
                        onChange={(id) => atualizarTimeA(c.id, id)}
                        placeholder="Time A"
                        excluir={c.timeBId ? [c.timeBId] : []}
                      />
                      <div className="flex flex-col items-center gap-0.5">
                        <Swords size={16} color="#C7D2FE" />
                        <span className="text-[#CBD5E1] text-[10px] font-bold">VS</span>
                      </div>
                      <SelectTime
                        value={c.timeBId}
                        onChange={(id) => atualizarTimeB(c.id, id)}
                        placeholder="Time B"
                        excluir={c.timeAId ? [c.timeAId] : []}
                      />
                    </div>

                    {/* Card visual do confronto montado */}
                    {timeA && timeB && !isDuplicado && (
                      <div className="mt-3 pt-3 border-t border-[#DCFCE7] flex items-center justify-center gap-2">
                        <span className="text-[13px] font-bold text-[#16A34A]">
                          {timeA.escudo} {timeA.nome}
                        </span>
                        <span className="text-[#86EFAC] font-bold text-[12px]">⚔️</span>
                        <span className="text-[13px] font-bold text-[#16A34A]">
                          {timeB.nome} {timeB.escudo}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botão adicionar */}
            <button
              type="button"
              onClick={adicionarConfronto}
              className="mt-3 w-full h-[42px] rounded-[10px] border-2 border-dashed border-[#D1D5DB] text-[#94A3B8] text-[13px] font-semibold hover:border-[#4F6BED] hover:text-[#4F6BED] hover:bg-[#EEF2FF] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Adicionar confronto
            </button>
          </div>

          {/* ── Seção 4: Preview do cronograma ── */}
          {confrontosCompletos.length > 0 && data && horaInicial && (
            <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
              <button
                type="button"
                onClick={() => setPreviewAberto(!previewAberto)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye size={15} color="#4F6BED" />
                  <span className="text-[#1E293B] font-bold text-[15px]">
                    Preview do cronograma
                  </span>
                  <span className="bg-[#EEF2FF] text-[#4F6BED] text-[12px] font-semibold px-2 py-0.5 rounded-full">
                    {confrontosCompletos.length} jogos
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  color="#94A3B8"
                  className={`transition-transform ${previewAberto ? "rotate-180" : ""}`}
                />
              </button>

              {previewAberto && (
                <div className="px-5 pb-5 border-t border-[#F1F5F9]">
                  <p className="text-[#94A3B8] text-[12px] mt-3 mb-3">
                    📅 {formatarDataBR(data)}
                  </p>
                  <div className="flex flex-col gap-2">
                    {confrontosCompletos.map((c, idx) => {
                      const timeA = TIMES_CADASTRADOS.find((t) => t.id === c.timeAId)!;
                      const timeB = TIMES_CADASTRADOS.find((t) => t.id === c.timeBId)!;
                      return (
                        <div
                          key={c.id}
                          className="flex items-center gap-3 bg-[#F8FAFC] rounded-[10px] px-4 py-3"
                        >
                          <div className="flex items-center gap-1.5 w-[52px] shrink-0">
                            <Clock size={11} color="#4F6BED" />
                            <span className="text-[#4F6BED] font-bold text-[13px]">
                              {horarios[idx] || "—"}
                            </span>
                          </div>
                          <div className="flex-1 flex items-center justify-center gap-2">
                            <span className="text-[#1E293B] font-semibold text-[13px]">
                              {timeA.escudo} {timeA.nome}
                            </span>
                            <span className="text-[#CBD5E1] text-[11px] font-bold">×</span>
                            <span className="text-[#1E293B] font-semibold text-[13px]">
                              {timeB.nome} {timeB.escudo}
                            </span>
                          </div>
                          <span className="text-[#94A3B8] text-[11px] w-[20px] text-right">
                            #{idx + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Botões de ação ── */}
          <div className="flex items-center gap-3 pb-6">
            <button
              type="button"
              onClick={() => router.push("/partidas")}
              className="flex-1 h-[46px] rounded-[12px] border border-[#D1D5DB] bg-white text-[#374151] text-[14px] font-semibold hover:bg-[#F9FAFB] transition-colors shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formularioValido}
              className={`flex-[2] h-[46px] rounded-[12px] text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                formularioValido
                  ? "bg-[#4F6BED] hover:bg-[#3D5BD9] text-white"
                  : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              <Swords size={15} />
              Gerar {confrontosCompletos.length > 0 ? `${confrontosCompletos.length} ` : ""}
              {confrontosCompletos.length === 1 ? "partida" : "partidas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}