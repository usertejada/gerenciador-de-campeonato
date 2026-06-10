// app/times/[id]/jogadores/[jogadorId]/transferir/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  Search,
  MapPin,
  Trophy,
  Check,
  User,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  buscarJogador,
  buscarTime,
  listarTimes,
  transferirJogador,
  type Jogador,
  type Time,
} from "@/lib/services/times";
import { calcularIdade, iniciaisNome, bandeiraNacionalidade } from "@/lib/utils/jogadores";

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

// ─── Card do jogador (resumo) ─────────────────────────────────────────────────

function CardJogador({ jogador, time }: { jogador: Jogador; time: Time }) {
  const iniciais = iniciaisNome(jogador.nome);
  const idade = calcularIdade(jogador.data_nascimento);
  const bandeira = bandeiraNacionalidade[jogador.nacionalidade ?? ""] ?? "🌐";

  return (
    <div className="bg-white rounded-[16px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5 flex items-center gap-4">
      {/* Avatar */}
      <div className="w-[56px] h-[72px] rounded-[10px] bg-[#EEF2FF] border-2 border-[#C7D2FE] flex items-center justify-center shrink-0 overflow-hidden">
        {jogador.foto_url ? (
          <img
            src={jogador.foto_url}
            alt={jogador.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#4F6BED] font-bold text-[16px]">{iniciais}</span>
        )}
      </div>

      {/* Info jogador */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[#1E293B] font-bold text-[16px] truncate">{jogador.nome}</p>
          <span className="text-[18px] shrink-0">{bandeira}</span>
        </div>
        <p className="text-[#94A3B8] text-[13px] mt-0.5">
          {jogador.documento ?? "—"}
          {idade !== null ? ` · ${idade} anos` : ""}
        </p>
      </div>

      {/* Time atual */}
      <div className="shrink-0 text-right hidden sm:block">
        <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider">
          Time atual
        </p>
        <div className="flex items-center gap-1.5 mt-1 justify-end">
          <div className="w-6 h-6 rounded-[6px] bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center overflow-hidden shrink-0">
            {time.logo_url ? (
              <img src={time.logo_url} alt={time.nome} className="w-full h-full object-contain p-0.5" />
            ) : (
              <span className="text-[#4F6BED] font-bold text-[8px]">{time.sigla}</span>
            )}
          </div>
          <p className="text-[#1E293B] font-semibold text-[13px]">{time.nome}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Card de seleção de time destino ─────────────────────────────────────────

function CardTimeDestino({
  time,
  selecionado,
  onSelecionar,
}: {
  time: Time;
  selecionado: boolean;
  onSelecionar: () => void;
}) {
  const cidade = [time.cidade, time.estado].filter(Boolean).join(", ") || "—";
  const campeonato = time.campeonatos?.nome ?? "Sem campeonato";

  return (
    <button
      onClick={onSelecionar}
      className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-[12px] border-2 transition-all ${
        selecionado
          ? "border-[#4F6BED] bg-[#EEF2FF]"
          : "border-[#E5E7EB] bg-white hover:border-[#C7D2FE] hover:bg-[#F8FAFF]"
      }`}
    >
      {/* Escudo */}
      <div
        className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 overflow-hidden border ${
          selecionado
            ? "bg-[#4F6BED] border-[#4F6BED]"
            : "bg-[#EEF2FF] border-[#C7D2FE]"
        }`}
      >
        {time.logo_url ? (
          <img
            src={time.logo_url}
            alt={time.nome}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <span
            className={`font-extrabold text-[11px] tracking-wider ${
              selecionado ? "text-white" : "text-[#4F6BED]"
            }`}
          >
            {time.sigla}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-[14px] truncate ${
            selecionado ? "text-[#4F6BED]" : "text-[#1E293B]"
          }`}
        >
          {time.nome}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-[#94A3B8] text-[12px]">
            <MapPin size={10} />
            {cidade}
          </span>
          <span className="flex items-center gap-1 text-[#94A3B8] text-[12px]">
            <Trophy size={10} />
            {campeonato}
          </span>
        </div>
      </div>

      {/* Check */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          selecionado
            ? "bg-[#4F6BED] border-[#4F6BED]"
            : "border-[#D1D5DB] bg-white"
        }`}
      >
        {selecionado && <Check size={11} color="white" strokeWidth={3} />}
      </div>
    </button>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function TransferirJogadorPage() {
  const router = useRouter();
  const params = useParams();
  const timeId = params?.id as string;
  const jogadorId = params?.jogadorId as string;

  // ── Estados ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [timeAtual, setTimeAtual] = useState<Time | null>(null);
  const [todosOsTimes, setTodosOsTimes] = useState<Time[]>([]);

  const [busca, setBusca] = useState("");
  const [destinoId, setDestinoId] = useState<string | null>(null);

  const [transferindo, setTransferindo] = useState(false);
  const [transferido, setTransferido] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // ── Carregamento ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!jogadorId || !timeId) return;
    async function carregar() {
      setLoading(true);
      try {
        const [jogadorData, timeData, timesData] = await Promise.all([
          buscarJogador(jogadorId),
          buscarTime(timeId),
          listarTimes(),
        ]);
        if (!jogadorData) throw new Error("Jogador não encontrado.");
        if (!timeData) throw new Error("Time não encontrado.");
        setJogador(jogadorData);
        setTimeAtual(timeData);
        // Remove o time atual da lista de destinos
        setTodosOsTimes(timesData.filter((t) => t.id !== timeId));
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao carregar dados.");
      }
      setLoading(false);
    }
    carregar();
  }, [jogadorId, timeId]);

  // ── Filtragem de times ─────────────────────────────────────────────────────
  const timesFiltrados = todosOsTimes.filter((t) => {
    const q = busca.toLowerCase();
    return (
      t.nome.toLowerCase().includes(q) ||
      (t.cidade ?? "").toLowerCase().includes(q) ||
      (t.estado ?? "").toLowerCase().includes(q) ||
      (t.campeonatos?.nome ?? "").toLowerCase().includes(q) ||
      t.sigla.toLowerCase().includes(q)
    );
  });

  const timeDestino = todosOsTimes.find((t) => t.id === destinoId) ?? null;

  // ── Transferir ─────────────────────────────────────────────────────────────
  async function handleTransferir() {
    if (!destinoId || !jogador) return;
    setTransferindo(true);
    setErro(null);
    try {
      await transferirJogador(jogador.id, destinoId);
      setTransferido(true);
      // Volta para o time de origem após 1.5s
      setTimeout(() => router.push(`/times/${timeId}`), 1500);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao transferir jogador.");
    } finally {
      setTransferindo(false);
    }
  }

  // ── Render: loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F3F7]">
        <Spinner />
      </div>
    );
  }

  // ── Render: erro fatal ─────────────────────────────────────────────────────
  if (!jogador || !timeAtual) {
    return (
      <div className="min-h-screen bg-[#F1F3F7] flex flex-col items-center justify-center gap-4">
        <p className="text-[#94A3B8] text-[15px]">{erro ?? "Dados não encontrados."}</p>
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

  // ── Render principal ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      {/* Voltar */}
      <button
        onClick={() => router.push(`/times/${timeId}`)}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft size={16} color="#1E293B" />
        Voltar
      </button>

      <div className="max-w-[640px] mx-auto flex flex-col gap-5">

        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <ArrowRightLeft size={18} color="#4F6BED" />
          </div>
          <div>
            <h1 className="text-[#1E293B] font-bold text-[20px] leading-tight">
              Transferir Jogador
            </h1>
            <p className="text-[#94A3B8] text-[13px]">
              Selecione o time de destino
            </p>
          </div>
        </div>

        {/* Card do jogador */}
        <CardJogador jogador={jogador} time={timeAtual} />

        {/* Seta de transferência */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <div className="flex items-center gap-2 text-[#94A3B8] text-[12px] font-semibold uppercase tracking-wider">
            <ArrowRightLeft size={13} color="#94A3B8" />
            Transferir para
          </div>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        {/* Busca + Lista de times */}
        <div className="bg-white rounded-[16px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Campo de busca */}
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <div className="relative">
              <Search
                size={15}
                color="#94A3B8"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Buscar por nome, cidade ou campeonato…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full h-[36px] pl-9 pr-3 rounded-[8px] bg-[#F8FAFC] border border-[#E5E7EB] text-[#1E293B] text-[13px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.15)] transition-all placeholder:text-[#CBD5E1]"
              />
            </div>
          </div>

          {/* Lista */}
          <div className="p-3 flex flex-col gap-2 max-h-[340px] overflow-y-auto">
            {timesFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <User size={28} color="#CBD5E1" />
                <p className="text-[#94A3B8] text-[13px]">
                  {busca
                    ? `Nenhum time encontrado para "${busca}"`
                    : "Nenhum time disponível para transferência."}
                </p>
              </div>
            ) : (
              timesFiltrados.map((t) => (
                <CardTimeDestino
                  key={t.id}
                  time={t}
                  selecionado={destinoId === t.id}
                  onSelecionar={() =>
                    setDestinoId((prev) => (prev === t.id ? null : t.id))
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Painel de confirmação — aparece quando time destino selecionado */}
        {destinoId && timeDestino && (
          <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-[14px] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Resumo da transferência */}
            <div className="flex-1 min-w-0">
              <p className="text-[#4F6BED] text-[12px] font-semibold uppercase tracking-wider mb-1">
                Confirmação
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Time origem */}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-[5px] bg-[#C7D2FE] flex items-center justify-center overflow-hidden shrink-0">
                    {timeAtual.logo_url ? (
                      <img src={timeAtual.logo_url} alt={timeAtual.nome} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[#4F6BED] font-bold text-[7px]">{timeAtual.sigla}</span>
                    )}
                  </div>
                  <span className="text-[#1E293B] text-[13px] font-medium truncate max-w-[120px]">
                    {timeAtual.nome}
                  </span>
                </div>
                <ArrowRightLeft size={13} color="#4F6BED" className="shrink-0" />
                {/* Time destino */}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-[5px] bg-[#4F6BED] flex items-center justify-center overflow-hidden shrink-0">
                    {timeDestino.logo_url ? (
                      <img src={timeDestino.logo_url} alt={timeDestino.nome} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-white font-bold text-[7px]">{timeDestino.sigla}</span>
                    )}
                  </div>
                  <span className="text-[#4F6BED] text-[13px] font-bold truncate max-w-[120px]">
                    {timeDestino.nome}
                  </span>
                </div>
              </div>
              <p className="text-[#64748B] text-[12px] mt-1.5">
                <span className="font-semibold text-[#1E293B]">{jogador.nome}</span>{" "}
                será removido do elenco atual e adicionado ao novo time.
              </p>
            </div>

            {/* Botão confirmar */}
            <button
              onClick={handleTransferir}
              disabled={transferindo || transferido}
              className="flex items-center justify-center gap-2 h-[40px] px-5 rounded-[10px] bg-[#4F6BED] hover:bg-[#3D5BD9] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors shrink-0 w-full sm:w-auto"
            >
              {transferido ? (
                <>
                  <Check size={15} color="white" />
                  Transferido!
                </>
              ) : transferindo ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Transferindo…
                </>
              ) : (
                <>
                  <ArrowRightLeft size={15} color="white" />
                  Confirmar Transferência
                </>
              )}
            </button>
          </div>
        )}

        {/* Feedback de sucesso */}
        {transferido && (
          <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#86EFAC] text-[#16A34A] text-[13px] font-medium rounded-[10px] px-4 py-3">
            <Check size={15} color="#16A34A" />
            Transferência realizada com sucesso! Redirecionando…
          </div>
        )}

        {/* Feedback de erro */}
        {erro && !transferido && (
          <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[13px] font-medium rounded-[10px] px-4 py-3">
            ✕ {erro}
          </div>
        )}

      </div>
    </div>
  );
}