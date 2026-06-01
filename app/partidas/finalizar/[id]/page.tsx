// app/partidas/finalizar/[id]/page.tsx

"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Flag, CheckCircle2, AlertCircle,
  FileText, Plus, Minus, X,
} from "lucide-react";

import {
  mockPartidas,
  jogadoresMock,
  DadosFinalizacao,
  Partida,
  Jogador,
} from "../../types-and-data";
import { EscudoTime } from "../../components";

// ── ContadorGols ──────────────────────────────────────────────────────────────

function ContadorGols({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
        className="w-[32px] h-[32px] rounded-[8px] border border-[#E5E7EB] bg-white text-[#374151] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
        <Minus size={14} />
      </button>
      <span className="text-[#1E293B] font-extrabold text-[32px] w-[40px] text-center leading-none">
        {value}
      </span>
      <button type="button" onClick={() => onChange(value + 1)}
        className="w-[32px] h-[32px] rounded-[8px] border border-[#E5E7EB] bg-white text-[#374151] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
        <Plus size={14} />
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FinalizarPartidaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const partida: Partida | undefined = mockPartidas.find((p) => p.id === id);

  const jogadoresA: Jogador[] = partida ? (jogadoresMock[partida.timeA] ?? []) : [];
  const jogadoresB: Jogador[] = partida ? (jogadoresMock[partida.timeB] ?? []) : [];
  const todosJogadores = [...jogadoresA, ...jogadoresB];

  const [golsA, setGolsA] = useState(0);
  const [golsB, setGolsB] = useState(0);
  const [artilheiros, setArtilheiros] = useState<{ jogadorId: number; gols: number }[]>([]);
  const [selectArtilheiro, setSelectArtilheiro] = useState("");
  const [golsSelect, setGolsSelect] = useState(1);
  const [cartoes, setCartoes] = useState<{ jogadorId: number; tipo: "amarelo" | "vermelho" }[]>([]);
  const [selectCartao, setSelectCartao] = useState("");
  const [tipoCartao, setTipoCartao] = useState<"amarelo" | "vermelho">("amarelo");
  const [observacoes, setObservacoes] = useState("");

  const totalGolsArtilheiros = artilheiros.reduce((s, a) => s + a.gols, 0);
  const totalGols = golsA + golsB;
  const golsConsistentes = totalGols > 0 && totalGolsArtilheiros === totalGols;

  function getNome(id: number) {
    return todosJogadores.find((j) => j.id === id)?.nome ?? "—";
  }
  function getTime(id: number) {
    return jogadoresA.find((j) => j.id === id) ? partida?.timeA : partida?.timeB;
  }

  function adicionarArtilheiro() {
    const jid = Number(selectArtilheiro);
    if (!jid) return;
    setArtilheiros((prev) => {
      const ex = prev.find((a) => a.jogadorId === jid);
      if (ex) return prev.map((a) => a.jogadorId === jid ? { ...a, gols: a.gols + golsSelect } : a);
      return [...prev, { jogadorId: jid, gols: golsSelect }];
    });
    setSelectArtilheiro("");
    setGolsSelect(1);
  }

  function adicionarCartao() {
    const jid = Number(selectCartao);
    if (!jid) return;
    setCartoes((prev) => [...prev.filter((c) => c.jogadorId !== jid), { jogadorId: jid, tipo: tipoCartao }]);
    setSelectCartao("");
  }

  function handleConfirmar() {
    if (!partida) return;
    const dados: DadosFinalizacao = {
      golsA, golsB, artilheiros,
      cartoesAmarelos: cartoes.filter((c) => c.tipo === "amarelo").map((c) => c.jogadorId),
      cartoesVermelhos: cartoes.filter((c) => c.tipo === "vermelho").map((c) => c.jogadorId),
      observacoes,
    };
    console.log("Partida finalizada:", dados);
    router.push("/partidas");
  }

  const selectStyle = {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  } as React.CSSProperties;

  if (!partida) {
    return (
      <div className="min-h-screen bg-[#F1F3F7] flex items-center justify-center">
        <p className="text-[#94A3B8]">Partida não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* Botão voltar */}
      <button onClick={() => router.push("/partidas")}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6">
        <ArrowLeft size={16} color="#1E293B" />
        Voltar
      </button>

      <div className="max-w-[640px] mx-auto flex flex-col gap-5">

        {/* ── Card principal ── */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[#F1F5F9] bg-[#FAFBFF]">
            <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
              <Flag size={15} color="#4F6BED" />
            </div>
            <div>
              <h1 className="text-[#1E293B] font-bold text-[16px] leading-tight">Finalizar Partida</h1>
              <p className="text-[#94A3B8] text-[13px]">{partida.timeA} × {partida.timeB}</p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-6">

            {/* ── Placar ── */}
            <div className="bg-[#F8FAFC] rounded-[14px] border border-[#E5E7EB] p-5">
              <p className="text-[#64748B] text-[11px] font-semibold uppercase tracking-wider mb-5 text-center">
                Placar Final
              </p>

              <div className="flex items-center justify-between gap-2">

                {/* Time A */}
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <EscudoTime nome={partida.timeA} escudo={partida.escudoA} size={48} />
                  <span className="text-[#1E293B] font-bold text-[13px] text-center leading-tight">
                    {partida.timeA}
                  </span>
                  <div className="mt-2">
                    <ContadorGols value={golsA} onChange={setGolsA} />
                  </div>
                </div>

                {/* Separador × */}
                <span className="text-[#CBD5E1] font-bold text-[24px] mb-2 shrink-0">×</span>

                {/* Time B */}
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <EscudoTime nome={partida.timeB} escudo={partida.escudoB} size={48} />
                  <span className="text-[#1E293B] font-bold text-[13px] text-center leading-tight">
                    {partida.timeB}
                  </span>
                  <div className="mt-2">
                    <ContadorGols value={golsB} onChange={setGolsB} />
                  </div>
                </div>

              </div>
            </div>

            {/* ── Artilheiros ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#374151] font-semibold text-[13px]">Artilheiros</p>
                {totalGols > 0 && (
                  golsConsistentes ? (
                    <span className="flex items-center gap-1 text-[#16A34A] text-[11px] font-medium">
                      <CheckCircle2 size={11} /> Gols conferidos
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#D97706] text-[11px] font-medium">
                      <AlertCircle size={11} /> {totalGolsArtilheiros}/{totalGols} atribuídos
                    </span>
                  )
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <select value={selectArtilheiro} onChange={(e) => setSelectArtilheiro(e.target.value)}
                  style={selectStyle}
                  className="flex-1 h-[38px] rounded-[9px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[13px] px-3 outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-all appearance-none cursor-pointer">
                  <option value="">Selecione o jogador...</option>
                  <optgroup label={`— ${partida.timeA} —`}>
                    {jogadoresA.map((j) => <option key={j.id} value={j.id}>{j.nome}</option>)}
                  </optgroup>
                  <optgroup label={`— ${partida.timeB} —`}>
                    {jogadoresB.map((j) => <option key={j.id} value={j.id}>{j.nome}</option>)}
                  </optgroup>
                </select>

                <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[9px] px-2 h-[38px]">
                  <button type="button" onClick={() => setGolsSelect((v) => Math.max(1, v - 1))}
                    className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center hover:bg-white transition-colors text-[#64748B]">
                    <Minus size={11} />
                  </button>
                  <span className="w-[20px] text-center text-[#1E293B] font-bold text-[13px]">{golsSelect}</span>
                  <button type="button" onClick={() => setGolsSelect((v) => v + 1)}
                    className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center hover:bg-white transition-colors text-[#64748B]">
                    <Plus size={11} />
                  </button>
                </div>

                <button type="button" onClick={adicionarArtilheiro} disabled={!selectArtilheiro}
                  className="w-[38px] h-[38px] rounded-[9px] bg-[#4F6BED] hover:bg-[#3D5BD9] disabled:bg-[#C7D2FE] disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0">
                  <Plus size={16} />
                </button>
              </div>

              {artilheiros.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {artilheiros.map((a) => (
                    <div key={a.jogadorId}
                      className="flex items-center justify-between bg-[#F8FAFC] border border-[#F1F5F9] rounded-[9px] px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                          <span className="text-[#4F6BED] text-[10px] font-bold">
                            {getNome(a.jogadorId).split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#1E293B] text-[12px] font-semibold truncate">{getNome(a.jogadorId)}</p>
                          <p className="text-[#94A3B8] text-[10px]">{getTime(a.jogadorId)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[#4F6BED] font-bold text-[13px] w-[20px] text-center">{a.gols}</span>
                        <span className="text-[#94A3B8] text-[11px]">{a.gols === 1 ? "gol" : "gols"}</span>
                        <button type="button" onClick={() => setArtilheiros((prev) => prev.filter((x) => x.jogadorId !== a.jogadorId))}
                          className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[#94A3B8] hover:bg-[#FEE2E2] hover:text-[#EF4444] transition-colors ml-1">
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Cartões ── */}
            <div>
              <p className="text-[#374151] font-semibold text-[13px] mb-3">Cartões</p>

              <div className="flex items-center gap-2 mb-3">
                <select value={selectCartao} onChange={(e) => setSelectCartao(e.target.value)}
                  style={selectStyle}
                  className="flex-1 h-[38px] rounded-[9px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[13px] px-3 outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-all appearance-none cursor-pointer">
                  <option value="">Selecione o jogador...</option>
                  <optgroup label={`— ${partida.timeA} —`}>
                    {jogadoresA.map((j) => <option key={j.id} value={j.id}>{j.nome}</option>)}
                  </optgroup>
                  <optgroup label={`— ${partida.timeB} —`}>
                    {jogadoresB.map((j) => <option key={j.id} value={j.id}>{j.nome}</option>)}
                  </optgroup>
                </select>

                <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[9px] p-1 h-[38px]">
                  <button type="button" onClick={() => setTipoCartao("amarelo")} title="Amarelo"
                    className={`w-[26px] h-[28px] rounded-[6px] border-2 transition-all ${tipoCartao === "amarelo" ? "bg-[#FDE68A] border-[#F59E0B]" : "bg-white border-[#E5E7EB] hover:border-[#FCD34D]"}`} />
                  <button type="button" onClick={() => setTipoCartao("vermelho")} title="Vermelho"
                    className={`w-[26px] h-[28px] rounded-[6px] border-2 transition-all ${tipoCartao === "vermelho" ? "bg-[#FECACA] border-[#EF4444]" : "bg-white border-[#E5E7EB] hover:border-[#FCA5A5]"}`} />
                </div>

                <button type="button" onClick={adicionarCartao} disabled={!selectCartao}
                  className="w-[38px] h-[38px] rounded-[9px] bg-[#4F6BED] hover:bg-[#3D5BD9] disabled:bg-[#C7D2FE] disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0">
                  <Plus size={16} />
                </button>
              </div>

              {cartoes.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {cartoes.map((c) => (
                    <div key={c.jogadorId}
                      className="flex items-center justify-between bg-[#F8FAFC] border border-[#F1F5F9] rounded-[9px] px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                          <span className="text-[#4F6BED] text-[10px] font-bold">
                            {getNome(c.jogadorId).split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#1E293B] text-[12px] font-semibold truncate">{getNome(c.jogadorId)}</p>
                          <p className="text-[#94A3B8] text-[10px]">{getTime(c.jogadorId)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`w-[18px] h-[24px] rounded-[3px] border-2 ${c.tipo === "amarelo" ? "bg-[#FDE68A] border-[#F59E0B]" : "bg-[#FECACA] border-[#EF4444]"}`} />
                        <span className={`text-[11px] font-medium ${c.tipo === "amarelo" ? "text-[#D97706]" : "text-[#EF4444]"}`}>
                          {c.tipo === "amarelo" ? "Amarelo" : "Vermelho"}
                        </span>
                        <button type="button" onClick={() => setCartoes((prev) => prev.filter((x) => x.jogadorId !== c.jogadorId))}
                          className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[#94A3B8] hover:bg-[#FEE2E2] hover:text-[#EF4444] transition-colors ml-1">
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Observações ── */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[#374151] font-semibold text-[13px]">
                <FileText size={13} color="#4F6BED" />
                Observações
                <span className="text-[#94A3B8] font-normal">(opcional)</span>
              </label>
              <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Notas sobre a partida, incidentes, etc." rows={3}
                className="w-full rounded-[10px] border border-[#D1D5DB] bg-white text-[#1E293B] text-[13px] px-3 py-2.5 outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-all resize-none placeholder:text-[#CBD5E1]" />
            </div>

            {/* ── Botões ── */}
            <div className="flex items-center gap-3 pt-1">
              <button type="button" onClick={() => router.push("/partidas")}
                className="flex-1 h-[44px] rounded-[10px] border border-[#D1D5DB] bg-white text-[#374151] text-[13px] font-semibold hover:bg-[#F9FAFB] transition-colors">
                Cancelar
              </button>
              <button type="button" onClick={handleConfirmar}
                className="flex-[2] h-[44px] rounded-[10px] bg-[#4F6BED] hover:bg-[#3D5BD9] text-white text-[13px] font-bold transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 size={15} />
                Confirmar Resultado
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}