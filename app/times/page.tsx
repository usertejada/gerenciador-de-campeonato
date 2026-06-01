"use client";

import { useState, useEffect, useRef } from "react";
import { Users, MapPin, Plus, Pencil, Trash2, ArrowLeft, Save, Upload, X, ImageIcon, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface Time {
  id: number;
  nome: string;
  sigla: string;
  cidade: string;
  campeonato: string;
  v: number;
  e: number;
  d: number;
  escudo?: string; // base64 ou URL
}

const mockTimes: Time[] = [
  { id: 1, nome: "Águias SC",   sigla: "AGU", cidade: "São Paulo, SP",     campeonato: "Copa Verão 2025",   v: 8,  e: 2, d: 1 },
  { id: 2, nome: "Leões FC",    sigla: "LEO", cidade: "Rio de Janeiro, RJ", campeonato: "Copa Verão 2025",   v: 6,  e: 3, d: 2 },
  { id: 3, nome: "Panteras FC", sigla: "PAN", cidade: "Belo Horizonte, MG", campeonato: "Liga Empresarial",  v: 5,  e: 1, d: 4 },
  { id: 4, nome: "Trovões EC",  sigla: "TRO", cidade: "Curitiba, PR",       campeonato: "Liga Empresarial",  v: 7,  e: 0, d: 3 },
  { id: 5, nome: "Dragões SC",  sigla: "DRA", cidade: "Porto Alegre, RS",   campeonato: "Torneio Relâmpago", v: 3,  e: 2, d: 2 },
  { id: 6, nome: "Falcões EC",  sigla: "FAL", cidade: "Fortaleza, CE",      campeonato: "Champions Interno", v: 10, e: 1, d: 0 },
];

const campeonatosLista = [
  "Copa Verão 2025",
  "Liga Empresarial",
  "Torneio Relâmpago",
  "Champions Interno",
  "Taça Primavera",
  "Super Copa 2024",
];

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

function EmptyState({ onNovo }: { onNovo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
      <Users size={48} color="#CBD5E1" />
      <h3 className="text-[#1E293B] font-semibold text-[17px]">Nenhum time cadastrado</h3>
      <p className="text-[#94A3B8] text-[13px] text-center max-w-xs">
        Você ainda não cadastrou nenhum time. Comece agora!
      </p>
      <button
        onClick={onNovo}
        className="flex items-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-colors mt-2"
      >
        <Plus size={16} color="#FFFFFF" />
        Novo Time
      </button>
    </div>
  );
}

// ── Upload de Escudo ────────────────────────────────────────────────────
function EscudoUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (base64: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#374151] font-medium text-[13px]">Escudo do Time</label>

      {value ? (
        /* Preview do escudo carregado */
        <div className="relative w-[80px] h-[80px] rounded-[10px] border-2 border-[#4F6BED] overflow-hidden group">
          <img src={value} alt="Escudo" className="w-full h-full object-contain p-1" />
          <button
            onClick={handleRemove}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            type="button"
            aria-label="Remover escudo"
          >
            <X size={18} color="#FFFFFF" />
          </button>
        </div>
      ) : (
        /* Área de clique para upload */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-[80px] h-[80px] rounded-[10px] border-2 border-dashed border-[#D1D5DB] hover:border-[#4F6BED] hover:bg-[#EEF2FF] transition-all flex flex-col items-center justify-center gap-1 group"
        >
          <ImageIcon size={20} className="text-[#94A3B8] group-hover:text-[#4F6BED] transition-colors" />
          <span className="text-[#94A3B8] group-hover:text-[#4F6BED] text-[10px] font-medium transition-colors leading-tight text-center">
            Upload
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      <span className="text-[#94A3B8] text-[11px]">PNG, JPG, SVG ou WEBP</span>
    </div>
  );
}

// ── Formulário Novo Time ────────────────────────────────────────────────
function NovoTimeForm({ onVoltar }: { onVoltar: () => void }) {
  const [sigla, setSigla]   = useState("");
  const [nome, setNome]     = useState("");
  const [cidade, setCidade] = useState("");
  const [camp, setCamp]     = useState("");
  const [escudo, setEscudo] = useState("");

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      <button
        onClick={onVoltar}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft size={16} color="#1E293B" />
        Voltar
      </button>

      <div className="max-w-[640px] mx-auto bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <Users size={18} color="#4F6BED" />
          </div>
          <div>
            <h1 className="text-[#1E293B] font-bold text-[22px] leading-tight">Novo Time</h1>
            <p className="text-[#94A3B8] text-[13px]">Preencha as informações do time</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Escudo */}
          <EscudoUpload value={escudo} onChange={setEscudo} />

          {/* Nome + Abreviação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Nome do Time</label>
              <input
                type="text"
                placeholder="Ex: Águias SC"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-[38px] px-3 rounded-[8px] border border-[#D1D5DB] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Abreviação (3 letras)</label>
              <input
                type="text"
                placeholder="Ex: AGU"
                maxLength={3}
                value={sigla}
                onChange={(e) => setSigla(e.target.value.toUpperCase())}
                className="h-[38px] px-3 rounded-[8px] border border-[#D1D5DB] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all tracking-widest font-bold"
              />
            </div>
          </div>

          {/* Cidade + Campeonato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Cidade</label>
              <input
                type="text"
                placeholder="Ex: São Paulo, SP"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="h-[38px] px-3 rounded-[8px] border border-[#D1D5DB] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Campeonato</label>
              <div className="relative">
                <select
                  value={camp}
                  onChange={(e) => setCamp(e.target.value)}
                  className="w-full h-[38px] px-3 rounded-[8px] border border-[#D1D5DB] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all appearance-none bg-white"
                >
                  <option value="">Selecione...</option>
                  {campeonatosLista.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E7EB] mt-2">
            <button
              onClick={onVoltar}
              className="h-[38px] px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors"
            >
              Cancelar
            </button>
            <button className="flex items-center gap-2 h-[38px] px-5 rounded-[8px] bg-[#4F6BED] hover:bg-[#3D5BD9] text-white text-[14px] font-semibold transition-colors">
              <Save size={16} color="#FFFFFF" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Lista ───────────────────────────────────────────────────────────────
export default function TimesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [times, setTimes]     = useState<Time[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setTimes(mockTimes);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  function handleDelete(id: number) {
    setTimes((prev) => prev.filter((t) => t.id !== id));
  }

  if (showForm) {
    return <NovoTimeForm onVoltar={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 min-[640px]:flex-row min-[640px]:items-start min-[640px]:justify-between">
        <div>
          <h1 className="text-[#1E293B] font-extrabold text-[22px] lg:text-[28px] leading-tight">
            Times
          </h1>
          <p className="text-[#94A3B8] text-[14px] font-normal mt-1">
            Gerencie todos os times cadastrados
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-colors self-start min-[640px]:self-auto min-[640px]:shrink-0"
        >
          <Plus size={16} color="#FFFFFF" />
          Novo Time
        </button>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <Spinner />
      ) : times.length === 0 ? (
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <EmptyState onNovo={() => setShowForm(true)} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {times.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-shadow flex flex-col gap-3"
            >
              {/* Avatar + Nome + Cidade */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0 overflow-hidden">
                  {t.escudo ? (
                    <img src={t.escudo} alt={`Escudo ${t.nome}`} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-[#4F6BED] font-bold text-[16px] tracking-wide">{t.sigla}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1E293B] font-semibold text-[15px] truncate">{t.nome}</p>
                  <span className="flex items-center gap-1 text-[#94A3B8] text-[12px]">
                    <MapPin size={12} color="#94A3B8" />
                    {t.cidade}
                  </span>
                </div>
              </div>

              {/* Mini tabela V/E/D */}
              <div className="grid grid-cols-3 gap-2 bg-[#F1F5F9] rounded-[8px] p-2">
                {[
                  { label: "V", value: t.v },
                  { label: "E", value: t.e },
                  { label: "D", value: t.d },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center py-1">
                    <span className="text-[#1E293B] font-bold text-[14px]">{stat.value}</span>
                    <span className="text-[#94A3B8] text-[11px]">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Campeonato */}
              <p className="text-[#94A3B8] text-[11px] flex items-center gap-1">
                <Users size={11} color="#94A3B8" />
                {t.campeonato}
              </p>

              {/* Botões */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#E5E7EB] mt-auto">
                {/* Ver Time */}
                <button
                  onClick={() => router.push(`/times/${t.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-[34px] rounded-[8px] border border-[#4F6BED] text-[#4F6BED] hover:bg-[#EEF2FF] font-medium text-[13px] transition-colors"
                >
                  <Eye size={13} />
                  Ver Time
                </button>

                <button className="w-[34px] h-[34px] flex items-center justify-center rounded-[8px] border border-[#10B981] hover:bg-[#F0FDF4] transition-colors shrink-0">
                  <Pencil size={12} color="#10B981" />
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="w-[34px] h-[34px] flex items-center justify-center rounded-[8px] border border-[#EF4444] hover:bg-[#FEF2F2] transition-colors shrink-0"
                  aria-label="Excluir time"
                >
                  <Trash2 size={12} color="#EF4444" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}