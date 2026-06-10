// app/times/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  type Time,
  type Jogador,
  buscarTime,
  listarTimes,
  listarJogadores,
  excluirJogador,
  transferirJogador,
} from "@/lib/services/times";
import { supabase } from "@/lib/supabase";

import { ModalExcluir } from "./_components/ModalExcluir";
import { ModalTransferir } from "./_components/ModalTransferir";
import { CardTime } from "./_components/CardTime";
import { ListaJogadores } from "./_components/ListaJogadores";

// ─── Spinner inline (simples demais pra virar arquivo próprio) ────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function TimeDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // ── Estados ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState<Time | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [todosOsTimes, setTodosOsTimes] = useState<Time[]>([]);

  const [modalExcluir, setModalExcluir] = useState<Jogador | null>(null);
  const [modalTransferir, setModalTransferir] = useState<Jogador | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastErro, setToastErro] = useState<string | null>(null);

  // ── Efeitos ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    carregarDados();
  }, [id]);

  // ── Handlers de dados ──────────────────────────────────────────────────────
  async function carregarDados() {
    setLoading(true);
    try {
      const [timeData, jogadoresData, timesData] = await Promise.all([
        buscarTime(id),
        listarJogadores(id),
        listarTimes(),
      ]);
      setTime(timeData);
      setJogadores(jogadoresData);
      setTodosOsTimes(timesData);
    } catch {
      setTime(null);
    }
    setLoading(false);
  }

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  function showErro(msg: string) {
    setToastErro(msg);
    setTimeout(() => setToastErro(null), 4000);
  }

  async function handleExcluir(jogador: Jogador) {
    setActionLoading(true);

    if (jogador.foto_url) {
      const match = jogador.foto_url.match(/fotos-jogadores\/(.+)$/);
      if (match) {
        await supabase.storage.from("fotos-jogadores").remove([match[1]]);
      }
    }

    try {
      await excluirJogador(jogador.id);
      setJogadores((prev) => prev.filter((j) => j.id !== jogador.id));
      showToast(`${jogador.nome} foi removido do elenco.`);
    } catch {
      showErro("Erro ao excluir jogador. Tente novamente.");
    }

    setActionLoading(false);
    setModalExcluir(null);
  }

  async function handleTransferir(jogador: Jogador, novoTimeId: string) {
    setActionLoading(true);

    try {
      await transferirJogador(jogador.id, novoTimeId);
      const destino = todosOsTimes.find((t) => t.id === novoTimeId);
      setJogadores((prev) => prev.filter((j) => j.id !== jogador.id));
      showToast(
        `${jogador.nome} transferido para ${destino?.nome ?? "outro time"}.`
      );
    } catch {
      showErro("Erro ao transferir jogador. Tente novamente.");
    }

    setActionLoading(false);
    setModalTransferir(null);
  }

  // ── Navegação helpers ──────────────────────────────────────────────────────
  const nav = {
    verFicha: (j: Jogador) => router.push(`/times/${id}/jogadores/${j.id}`),
    editarJogador: (j: Jogador) =>
      router.push(`/times/${id}/jogadores/${j.id}/editar`),
    carteirinha: (j: Jogador) =>
      router.push(`/times/${id}/jogadores/${j.id}/carteirinha`),
    adicionarJogador: () => router.push(`/times/${id}/adicionar-jogador`),
    editarTime: () => router.push(`/times/${id}/editar`),
  };

  // ── Render: loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F3F7]">
        <Spinner />
      </div>
    );
  }

  // ── Render: time não encontrado ────────────────────────────────────────────
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

  // ── Render principal ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      {/* Toasts */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#1E293B] text-white text-[13px] font-medium px-4 py-2.5 rounded-[10px] shadow-lg animate-fade-in">
          {toastMsg}
        </div>
      )}
      {toastErro && (
        <div className="fixed top-4 right-4 z-50 bg-[#EF4444] text-white text-[13px] font-medium px-4 py-2.5 rounded-[10px] shadow-lg">
          {toastErro}
        </div>
      )}

      {/* Modais */}
      {modalExcluir && (
        <ModalExcluir
          jogador={modalExcluir}
          loading={actionLoading}
          onConfirm={() => handleExcluir(modalExcluir)}
          onCancel={() => setModalExcluir(null)}
        />
      )}
      {modalTransferir && (
        <ModalTransferir
          jogador={modalTransferir}
          times={todosOsTimes}
          timeAtualId={id}
          loading={actionLoading}
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
        {/* Card do time */}
        <CardTime
          time={time}
          totalJogadores={jogadores.length}
          onEditar={nav.editarTime}
        />

        {/* Cabeçalho da seção de jogadores */}
        <div className="flex flex-col min-[640px]:flex-row min-[640px]:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[#1E293B] font-bold text-[18px]">Elenco</h2>
            <p className="text-[#94A3B8] text-[13px]">
              Gerencie os jogadores deste time
            </p>
          </div>
          <button
            onClick={nav.adicionarJogador}
            className="flex items-center justify-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-colors shrink-0 self-center sm:self-start w-full sm:w-auto"
          >
            <UserPlus size={16} color="#FFFFFF" />
            Adicionar Jogador
          </button>
        </div>

        {/* Lista de jogadores */}
        <ListaJogadores
          jogadores={jogadores}
          timeId={id}
          onAdicionarJogador={nav.adicionarJogador}
          onVerFicha={nav.verFicha}
          onEditar={nav.editarJogador}
          onCarteirinha={nav.carteirinha}
          onTransferir={(j) => setModalTransferir(j)}
          onExcluir={(j) => setModalExcluir(j)}
        />
      </div>
    </div>
  );
}