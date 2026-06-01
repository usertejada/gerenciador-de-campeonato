// app/times/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import {  Users,
  MapPin,
  Trophy,
  Pencil,
  ArrowRightLeft,
  ArrowLeft,
  UserPlus,
  Trash2,
  Eye,
} from "lucide-react";
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
  telefone?: string;
  foto?: string;
  gols?: number;
  cartoesAmarelos?: number;
  cartoesVermelhos?: number;
}

const mockTimes: Time[] = [
  { id: 1, nome: "Águias SC",   sigla: "AGU", cidade: "São Paulo, SP",      campeonato: "Copa Verão 2025",   v: 8,  e: 2, d: 1 },
  { id: 2, nome: "Leões FC",    sigla: "LEO", cidade: "Rio de Janeiro, RJ", campeonato: "Copa Verão 2025",   v: 6,  e: 3, d: 2 },
  { id: 3, nome: "Panteras FC", sigla: "PAN", cidade: "Belo Horizonte, MG", campeonato: "Liga Empresarial",  v: 5,  e: 1, d: 4 },
  { id: 4, nome: "Trovões EC",  sigla: "TRO", cidade: "Curitiba, PR",       campeonato: "Liga Empresarial",  v: 7,  e: 0, d: 3 },
  { id: 5, nome: "Dragões SC",  sigla: "DRA", cidade: "Porto Alegre, RS",   campeonato: "Torneio Relâmpago", v: 3,  e: 2, d: 2 },
  { id: 6, nome: "Falcões EC",  sigla: "FAL", cidade: "Fortaleza, CE",      campeonato: "Champions Interno", v: 10, e: 1, d: 0 },
];

const mockJogadores: Record<number, Jogador[]> = {
  1: [
    {
      id: 1,
      nome: "Carlos Eduardo Silva",
      nacionalidade: "Brasileiro",
      documento: "123.456.789-00",
      dataNascimento: "1998-04-12",
      telefone: "(11) 99999-1234",
      gols: 5,
      cartoesAmarelos: 2,
      cartoesVermelhos: 0,
    },
    {
      id: 2,
      nome: "Juan Pérez Torres",
      nacionalidade: "Colombiano",
      documento: "CC 1023456789",
      dataNascimento: "2000-07-23",
      telefone: "+57 311 222 3344",
      gols: 3,
      cartoesAmarelos: 1,
      cartoesVermelhos: 1,
    },
  ],
  2: [
    {
      id: 3,
      nome: "Diego Alves Costa",
      nacionalidade: "Brasileiro",
      documento: "987.654.321-00",
      dataNascimento: "1995-11-05",
      gols: 0,
      cartoesAmarelos: 0,
      cartoesVermelhos: 0,
    },
  ],
};

const bandeiraNacionalidade: Record<string, string> = {
  Brasileiro: "🇧🇷",
  Colombiano: "🇨🇴",
  Peruano: "🇵🇪",
};

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

// Modal de confirmação de exclusão
function ModalExcluir({
  jogador,
  onConfirm,
  onCancel,
}: {
  jogador: Jogador;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.18)] p-6 max-w-[380px] w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
            <Trash2 size={18} color="#EF4444" />
          </div>
          <div>
            <h2 className="text-[#1E293B] font-bold text-[16px]">
              Excluir Jogador
            </h2>
            <p className="text-[#94A3B8] text-[12px]">
              Esta ação não pode ser desfeita
            </p>
          </div>
        </div>
        <p className="text-[#374151] text-[14px] mb-5">
          Tem certeza que deseja excluir{" "}
          <span className="font-semibold text-[#1E293B]">{jogador.nome}</span>{" "}
          do elenco?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="h-[38px] px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="h-[38px] px-4 rounded-[8px] bg-[#EF4444] hover:bg-[#DC2626] text-white text-[14px] font-semibold transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de transferência
function ModalTransferir({
  jogador,
  times,
  timeAtualId,
  onConfirm,
  onCancel,
}: {
  jogador: Jogador;
  times: Time[];
  timeAtualId: number;
  onConfirm: (novoTimeId: number) => void;
  onCancel: () => void;
}) {
  const [destinoId, setDestinoId] = useState<number | "">("");
  const opcoes = times.filter((t) => t.id !== timeAtualId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.18)] p-6 max-w-[400px] w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <ArrowRightLeft size={18} color="#4F6BED" />
          </div>
          <div>
            <h2 className="text-[#1E293B] font-bold text-[16px]">
              Transferir Jogador
            </h2>
            <p className="text-[#94A3B8] text-[12px]">
              Mover para outro time
            </p>
          </div>
        </div>
        <p className="text-[#374151] text-[14px] mb-4">
          Transferir{" "}
          <span className="font-semibold text-[#1E293B]">{jogador.nome}</span>{" "}
          para:
        </p>
        <div className="relative mb-5">
          <select
            value={destinoId}
            onChange={(e) =>
              setDestinoId(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full h-[38px] px-3 pr-8 rounded-[8px] border border-[#D1D5DB] text-[#1E293B] text-[14px] outline-none appearance-none bg-white focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
          >
            <option value="">Selecione o time destino...</option>
            {opcoes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} — {t.cidade}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="h-[38px] px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!destinoId}
            onClick={() => destinoId && onConfirm(destinoId as number)}
            className="flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-[#4F6BED] hover:bg-[#3D5BD9] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors"
          >
            <ArrowRightLeft size={14} />
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TimeDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState<Time | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  // Modais
  const [modalExcluir, setModalExcluir] = useState<Jogador | null>(null);
  const [modalTransferir, setModalTransferir] = useState<Jogador | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const found = mockTimes.find((t) => t.id === id) ?? null;
      setTime(found);
      setJogadores(mockJogadores[id] ?? []);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [id]);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  function handleExcluir(jogador: Jogador) {
    setJogadores((prev) => prev.filter((j) => j.id !== jogador.id));
    setModalExcluir(null);
    showToast(`${jogador.nome} foi removido do elenco.`);
  }

  function handleTransferir(jogador: Jogador, novoTimeId: number) {
    const destino = mockTimes.find((t) => t.id === novoTimeId);
    setJogadores((prev) => prev.filter((j) => j.id !== jogador.id));
    setModalTransferir(null);
    showToast(
      `${jogador.nome} transferido para ${destino?.nome ?? "outro time"}.`
    );
  }

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
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#1E293B] text-white text-[13px] font-medium px-4 py-2.5 rounded-[10px] shadow-lg animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Modais */}
      {modalExcluir && (
        <ModalExcluir
          jogador={modalExcluir}
          onConfirm={() => handleExcluir(modalExcluir)}
          onCancel={() => setModalExcluir(null)}
        />
      )}
      {modalTransferir && (
        <ModalTransferir
          jogador={modalTransferir}
          times={mockTimes}
          timeAtualId={id}
          onConfirm={(novoId) => handleTransferir(modalTransferir, novoId)}
          onCancel={() => setModalTransferir(null)}
        />
      )}

      {/* Voltar */}
      <button
        onClick={() => router.push("/times")}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft size={16} color="#1E293B" />
        Voltar
      </button>

      <div className="max-w-[860px] mx-auto">
        {/* Card principal do time */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden mb-6">
          <div className="h-[6px] bg-[#4F6BED]" />
          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Escudo */}
            <div className="w-24 h-24 rounded-[16px] bg-[#EEF2FF] border-2 border-[#C7D2FE] flex items-center justify-center shrink-0 overflow-hidden shadow-[0_4px_16px_rgba(79,107,237,0.15)]">
              {time.escudo ? (
                <img
                  src={time.escudo}
                  alt={`Escudo ${time.nome}`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <span className="text-[#4F6BED] font-extrabold text-[28px] tracking-wider">
                  {time.sigla}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-[#1E293B] font-extrabold text-[26px] leading-tight">
                {time.nome}
              </h1>
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
                  { label: "Pontos", value: pts, color: "#4F6BED" },
                  { label: "Vitórias", value: time.v, color: "#22C55E" },
                  { label: "Empates", value: time.e, color: "#F59E0B" },
                  { label: "Derrotas", value: time.d, color: "#EF4444" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center">
                    <span
                      className="font-extrabold text-[20px] leading-tight"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </span>
                    <span className="text-[#94A3B8] text-[11px] font-medium">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão adicionar jogador */}
            <button
              onClick={() =>
                router.push(`/times/${time.id}/adicionar-jogador`)
              }
              className="flex items-center justify-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-colors shrink-0 self-center sm:self-start w-full sm:w-auto"
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
              <span className="text-[#1E293B] font-semibold text-[15px]">
                Jogadores
              </span>
              <span className="bg-[#EEF2FF] text-[#4F6BED] text-[12px] font-bold px-2 py-0.5 rounded-full">
                {jogadores.length}
              </span>
            </div>
            <button
              onClick={() =>
                router.push(`/times/${time.id}/adicionar-jogador`)
              }
              className="flex items-center gap-1.5 text-[#4F6BED] hover:text-[#3D5BD9] text-[13px] font-medium transition-colors"
            >
              <UserPlus size={14} />
              Adicionar
            </button>
          </div>

          {jogadores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Users size={36} color="#CBD5E1" />
              <p className="text-[#94A3B8] text-[14px]">
                Nenhum jogador cadastrado ainda.
              </p>
              <button
                onClick={() =>
                  router.push(`/times/${time.id}/adicionar-jogador`)
                }
                className="flex items-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[13px] px-4 py-2 rounded-[8px] transition-colors"
              >
                <UserPlus size={14} color="#FFFFFF" />
                Cadastrar primeiro jogador
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#F1F5F9]">
              {jogadores.map((j) => {
                const bandeira =
                  bandeiraNacionalidade[j.nacionalidade] ?? "🌐";
                const nascimento = new Date(j.dataNascimento + "T00:00:00");
                const idade = Math.floor(
                  (Date.now() - nascimento.getTime()) /
                    (1000 * 60 * 60 * 24 * 365.25)
                );
                const iniciais = j.nome
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <li
                    key={j.id}
                    className="flex flex-col gap-2 px-4 py-4 hover:bg-[#FAFBFF] transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-6"
                  >
                    {/* Linha superior: avatar + info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0 overflow-hidden">
                        {j.foto ? (
                          <img
                            src={j.foto}
                            alt={j.nome}
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
                          {j.nome}
                        </p>
                        <p className="text-[#94A3B8] text-[12px]">
                          {j.documento} · {idade} anos
                        </p>
                      </div>

                      {/* Stats e bandeira — só desktop */}
                      <div className="hidden sm:flex items-center gap-3 mr-2">
                        {(j.gols ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-[#22C55E] text-[12px] font-semibold">
                            ⚽ {j.gols}
                          </span>
                        )}
                        {(j.cartoesAmarelos ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-[12px] font-semibold text-[#F59E0B]">
                            🟨 {j.cartoesAmarelos}
                          </span>
                        )}
                        {(j.cartoesVermelhos ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-[12px] font-semibold text-[#EF4444]">
                            🟥 {j.cartoesVermelhos}
                          </span>
                        )}
                      </div>
                      <span className="text-[20px] hidden sm:block" title={j.nacionalidade}>
                        {bandeira}
                      </span>

                      {/* 4 ações — só desktop */}
                      <div className="hidden sm:flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => router.push(`/times/${time.id}/jogadores/${j.id}`)}
                          title="Ver ficha do jogador"
                          className="w-8 h-8 flex items-center justify-center rounded-[7px] text-[#4F6BED] hover:bg-[#EEF2FF] transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/times/${time.id}/jogadores/${j.id}/editar`)}
                          title="Editar jogador"
                          className="w-8 h-8 flex items-center justify-center rounded-[7px] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setModalTransferir(j)}
                          title="Transferir jogador"
                          className="w-8 h-8 flex items-center justify-center rounded-[7px] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                        >
                          <ArrowRightLeft size={15} />
                        </button>
                        <button
                          onClick={() => setModalExcluir(j)}
                          title="Excluir jogador"
                          className="w-8 h-8 flex items-center justify-center rounded-[7px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Linha inferior: 4 ícones — só mobile */}
                    <div className="flex items-center gap-2 sm:hidden border-t border-[#F1F5F9] pt-2">
                      <button
                        onClick={() => router.push(`/times/${time.id}/jogadores/${j.id}`)}
                        title="Ver ficha do jogador"
                        className="flex-1 h-8 flex items-center justify-center rounded-[7px] text-[#4F6BED] hover:bg-[#EEF2FF] transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => router.push(`/times/${time.id}/jogadores/${j.id}/editar`)}
                        title="Editar jogador"
                        className="flex-1 h-8 flex items-center justify-center rounded-[7px] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setModalTransferir(j)}
                        title="Transferir jogador"
                        className="flex-1 h-8 flex items-center justify-center rounded-[7px] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                      >
                        <ArrowRightLeft size={15} />
                      </button>
                      <button
                        onClick={() => setModalExcluir(j)}
                        title="Excluir jogador"
                        className="flex-1 h-8 flex items-center justify-center rounded-[7px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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