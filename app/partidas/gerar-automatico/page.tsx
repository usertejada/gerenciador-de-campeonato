// app/partidas/gerar-automatico/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Zap,
  Calendar,
  Clock,
  Hash,
  MapPin,
  Trophy,
  Save,
  Timer,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

type TempoJogo = "45/45" | "20/20" | "15/15";

interface FormAuto {
  campeonato: string;
  data: string;
  tempoJogo: TempoJogo | "";
  horaInicial: string;
  qtdPartidas: number;
  intervaloMinutos: number;
  local: string;
}

const TEMPOS: { value: TempoJogo; label: string; desc: string }[] = [
  { value: "45/45", label: "45/45", desc: "Campo grande" },
  { value: "20/20", label: "20/20", desc: "Society / Futsal" },
  { value: "15/15", label: "15/15", desc: "Torneio rápido" },
];

const CAMPEONATOS = [
  "Copa Verão 2025",
  "Liga Empresarial",
  "Torneio Relâmpago",
  "Champions Interno",
];

function fieldClass(error?: boolean) {
  return `h-[40px] px-3 rounded-[8px] border text-[#1E293B] text-[14px] outline-none transition-all bg-white ${
    error
      ? "border-[#EF4444] focus:ring-2 focus:ring-[rgba(239,68,68,0.2)]"
      : "border-[#D1D5DB] focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)]"
  }`;
}

// Calcula o horário de cada jogo a partir da hora inicial
function calcularHorarios(
  horaInicial: string,
  qtd: number,
  tempoJogo: TempoJogo | "",
  intervalo: number
): string[] {
  if (!horaInicial || !tempoJogo || qtd <= 0) return [];

  const duracaoJogo =
    tempoJogo === "45/45" ? 90 + 15 : // 90min de jogo + 15 intervalo entre tempos
    tempoJogo === "20/20" ? 40 + 10 :
    30 + 10; // 15/15

  const [hh, mm] = horaInicial.split(":").map(Number);
  const horarios: string[] = [];
  let totalMinutos = hh * 60 + mm;

  for (let i = 0; i < qtd; i++) {
    const h = Math.floor(totalMinutos / 60) % 24;
    const m = totalMinutos % 60;
    horarios.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    totalMinutos += duracaoJogo + intervalo;
  }

  return horarios;
}

export default function GerarAutomaticoPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormAuto>({
    campeonato: "",
    data: "",
    tempoJogo: "",
    horaInicial: "",
    qtdPartidas: 4,
    intervaloMinutos: 10,
    local: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormAuto, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const horarios = calcularHorarios(
    form.horaInicial,
    form.qtdPartidas,
    form.tempoJogo,
    form.intervaloMinutos
  );

  function set<K extends keyof FormAuto>(key: K, value: FormAuto[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.campeonato) e.campeonato = "Selecione o campeonato";
    if (!form.data) e.data = "Data obrigatória";
    if (!form.tempoJogo) e.tempoJogo = "Selecione o tempo de jogo";
    if (!form.horaInicial) e.horaInicial = "Hora inicial obrigatória";
    if (!form.qtdPartidas || form.qtdPartidas < 1)
      e.qtdPartidas = "Mínimo 1 partida";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSalvar() {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/partidas"), 1200);
  }

  const duracaoLabel =
    form.tempoJogo === "45/45"
      ? "105min (90 + 15 de intervalo)"
      : form.tempoJogo === "20/20"
      ? "50min (40 + 10 de intervalo)"
      : form.tempoJogo === "15/15"
      ? "40min (30 + 10 de intervalo)"
      : null;

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      {/* Voltar */}
      <button
        onClick={() => router.push("/partidas")}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="max-w-[620px] mx-auto flex flex-col gap-5">
        {/* Cabeçalho */}
        <div className="bg-white rounded-[14px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
              <Zap size={18} color="#4F6BED" />
            </div>
            <div>
              <h1 className="text-[#1E293B] font-bold text-[20px] leading-tight">
                Gerar Jogos Automáticos
              </h1>
              <p className="text-[#94A3B8] text-[13px]">
                O sistema monta os confrontos e os horários automaticamente
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-[14px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6">

          {saved && (
            <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#86EFAC] text-[#16A34A] text-[13px] font-medium rounded-[8px] px-4 py-2.5 mb-5">
              ✓ Partidas geradas com sucesso! Redirecionando…
            </div>
          )}

          <div className="flex flex-col gap-5">

            {/* Campeonato */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                <Trophy size={12} color="#4F6BED" />
                Campeonato
              </label>
              <div className="relative">
                <select
                  value={form.campeonato}
                  onChange={(e) => set("campeonato", e.target.value)}
                  className={`${fieldClass(!!errors.campeonato)} w-full appearance-none pr-8`}
                >
                  <option value="">Selecione...</option>
                  {CAMPEONATOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {errors.campeonato && <span className="text-[#EF4444] text-[12px]">{errors.campeonato}</span>}
            </div>

            {/* Data + Local */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                  <Calendar size={12} color="#4F6BED" />
                  Data do Jogo
                </label>
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => set("data", e.target.value)}
                  className={`${fieldClass(!!errors.data)} w-full`}
                />
                {errors.data && <span className="text-[#EF4444] text-[12px]">{errors.data}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                  <MapPin size={12} color="#4F6BED" />
                  Local / Campo
                  <span className="text-[#94A3B8] font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Campo Principal"
                  value={form.local}
                  onChange={(e) => set("local", e.target.value)}
                  className={`${fieldClass()} w-full`}
                />
              </div>
            </div>

            {/* Tempo de jogo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                <Timer size={12} color="#4F6BED" />
                Tempo de Jogo
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TEMPOS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("tempoJogo", t.value)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-[10px] border-2 py-3 px-2 transition-all ${
                      form.tempoJogo === t.value
                        ? "border-[#4F6BED] bg-[#EEF2FF]"
                        : "border-[#E5E7EB] bg-white hover:border-[#C7D2FE]"
                    }`}
                  >
                    <span
                      className={`font-bold text-[15px] ${
                        form.tempoJogo === t.value ? "text-[#4F6BED]" : "text-[#1E293B]"
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className="text-[#94A3B8] text-[11px]">{t.desc}</span>
                  </button>
                ))}
              </div>
              {errors.tempoJogo && <span className="text-[#EF4444] text-[12px]">{errors.tempoJogo}</span>}
              {duracaoLabel && (
                <span className="flex items-center gap-1.5 text-[#64748B] text-[12px]">
                  <Info size={11} color="#94A3B8" />
                  Duração estimada por jogo: {duracaoLabel}
                </span>
              )}
            </div>

            {/* Hora inicial + Qtd partidas + Intervalo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                  <Clock size={12} color="#4F6BED" />
                  Hora Inicial
                </label>
                <input
                  type="time"
                  value={form.horaInicial}
                  onChange={(e) => set("horaInicial", e.target.value)}
                  className={`${fieldClass(!!errors.horaInicial)} w-full`}
                />
                {errors.horaInicial && <span className="text-[#EF4444] text-[12px]">{errors.horaInicial}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                  <Hash size={12} color="#4F6BED" />
                  Nº de Partidas
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.qtdPartidas}
                  onChange={(e) => set("qtdPartidas", Number(e.target.value))}
                  className={`${fieldClass(!!errors.qtdPartidas)} w-full`}
                />
                {errors.qtdPartidas && <span className="text-[#EF4444] text-[12px]">{errors.qtdPartidas}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                  <Timer size={12} color="#4F6BED" />
                  Intervalo entre jogos
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={form.intervaloMinutos}
                    onChange={(e) => set("intervaloMinutos", Number(e.target.value))}
                    className={`${fieldClass()} w-full pr-10`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[12px]">
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview do cronograma */}
        {horarios.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={15} color="#4F6BED" />
              <h2 className="text-[#1E293B] font-bold text-[15px]">
                Preview do Cronograma
              </h2>
              <span className="bg-[#EEF2FF] text-[#4F6BED] text-[12px] font-bold px-2 py-0.5 rounded-full ml-auto">
                {horarios.length} {horarios.length === 1 ? "jogo" : "jogos"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {horarios.map((hora, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-[10px] bg-[#F8FAFC] border border-[#E5E7EB]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                    <span className="text-[#4F6BED] font-bold text-[12px]">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} color="#94A3B8" />
                    <span className="text-[#1E293B] font-semibold text-[14px]">
                      {hora}
                    </span>
                  </div>
                  <span className="text-[#94A3B8] text-[12px] ml-auto">
                    {form.tempoJogo} · {form.local || "Local a definir"}
                  </span>
                </div>
              ))}
            </div>

            <p className="flex items-center gap-1.5 text-[#94A3B8] text-[11px] mt-3">
              <Info size={11} />
              Os confrontos serão sorteados automaticamente entre os times cadastrados no campeonato.
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => router.push("/partidas")}
            className="h-[40px] px-5 rounded-[10px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={saving || saved}
            className="flex items-center gap-2 h-[40px] px-6 rounded-[10px] bg-[#4F6BED] hover:bg-[#3D5BD9] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Gerando…
              </>
            ) : (
              <>
                <Save size={15} />
                Gerar Partidas
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}