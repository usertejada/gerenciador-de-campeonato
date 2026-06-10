"use client";

import { useState, useEffect, useRef } from "react";
import {
  Users, MapPin, Plus, Pencil, Trash2, ArrowLeft,
  Save, X, ImageIcon, Eye, Loader2, AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  listarTimes,
  criarTime,
  atualizarTime,
  excluirTime,
  uploadLogoTime,
  type Time,
  type NovoTimePayload,
} from "@/lib/services/times";
import { supabase } from "@/lib/supabase";

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
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

// ─── Modal de Confirmação de Exclusão ─────────────────────────────────────────
function ConfirmDeleteModal({
  nomeTime,
  onConfirm,
  onCancel,
  loading,
}: {
  nomeTime: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[12px] shadow-xl border border-[#E5E7EB] w-full max-w-[380px] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
            <AlertTriangle size={20} color="#EF4444" />
          </div>
          <div>
            <h2 className="text-[#1E293B] font-bold text-[16px]">Excluir Time</h2>
            <p className="text-[#64748B] text-[13px]">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <p className="text-[#374151] text-[14px]">
          Tem certeza que deseja excluir o time <strong>{nomeTime}</strong>?
          Todos os jogadores associados também serão removidos.
        </p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-[38px] rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-[38px] rounded-[8px] bg-[#EF4444] hover:bg-[#DC2626] text-white text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Upload de Logo ───────────────────────────────────────────────────────────
function LogoUpload({
  value,
  onChange,
  onFileChange,
}: {
  value: string;
  onChange: (url: string) => void;
  onFileChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileChange(file);
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    onChange("");
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#374151] font-medium text-[13px]">Escudo do Time</label>
      {value ? (
        <div className="relative w-[80px] h-[80px] rounded-[10px] border-2 border-[#4F6BED] overflow-hidden group">
          <img src={value} alt="Escudo" className="w-full h-full object-contain p-1" />
          <button
            onClick={handleRemove}
            type="button"
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <X size={18} color="#FFFFFF" />
          </button>
        </div>
      ) : (
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

// ─── Formulário Novo/Editar Time ──────────────────────────────────────────────
function TimeForm({
  timeParaEditar,
  onVoltar,
  onSalvo,
}: {
  timeParaEditar?: Time | null;
  onVoltar: () => void;
  onSalvo: () => void;
}) {
  const [nome, setNome]         = useState(timeParaEditar?.nome ?? "");
  const [sigla, setSigla]       = useState(timeParaEditar?.sigla ?? "");
  const [cidade, setCidade]     = useState(timeParaEditar?.cidade ?? "");
  const [campId, setCampId]     = useState(timeParaEditar?.campeonato_id ?? "");
  const [logoPreview, setLogoPreview] = useState(timeParaEditar?.logo_url ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [campeonatos, setCampeonatos] = useState<{ id: string; nome: string }[]>([]);
  const [saving, setSaving]     = useState(false);
  const [erro, setErro]         = useState("");

  const isEdit = !!timeParaEditar;

  // Carrega campeonatos do Supabase
  useEffect(() => {
    supabase
      .from("campeonatos")
      .select("id, nome")
      .order("nome")
      .then(({ data }) => setCampeonatos(data ?? []));
  }, []);

  async function handleSalvar() {
    if (!nome.trim() || !sigla.trim()) {
      setErro("Nome e abreviação são obrigatórios.");
      return;
    }
    setErro("");
    setSaving(true);

    try {
      let logo_url = timeParaEditar?.logo_url ?? undefined;

      if (isEdit) {
        // Edição
        let savedTime = timeParaEditar!;
        if (logoFile) {
          logo_url = await uploadLogoTime(logoFile, savedTime.id);
        }
        const payload: Partial<NovoTimePayload> = {
          nome: nome.trim(),
          sigla: sigla.trim().toUpperCase(),
          cidade: cidade.trim() || undefined,
          campeonato_id: campId || undefined,
          logo_url,
        };
        await atualizarTime(savedTime.id, payload);
      } else {
        // Criação — primeiro cria sem logo para obter o ID
        const novo = await criarTime({
          nome: nome.trim(),
          sigla: sigla.trim().toUpperCase(),
          cidade: cidade.trim() || undefined,
          campeonato_id: campId || undefined,
        });
        if (logoFile) {
          const url = await uploadLogoTime(logoFile, novo.id);
          await atualizarTime(novo.id, { logo_url: url });
        }
      }

      onSalvo();
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      <button
        onClick={onVoltar}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft size={16} color="#1E293B" />
        Voltar
      </button>

      <div className="max-w-[640px] mx-auto bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <Users size={18} color="#4F6BED" />
          </div>
          <div>
            <h1 className="text-[#1E293B] font-bold text-[22px] leading-tight">
              {isEdit ? "Editar Time" : "Novo Time"}
            </h1>
            <p className="text-[#94A3B8] text-[13px]">Preencha as informações do time</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Logo */}
          <LogoUpload
            value={logoPreview}
            onChange={setLogoPreview}
            onFileChange={setLogoFile}
          />

          {/* Nome + Sigla */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Nome do Time *</label>
              <input
                type="text"
                placeholder="Ex: Águias SC"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-[38px] px-3 rounded-[8px] border border-[#D1D5DB] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Abreviação (3 letras) *</label>
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
                  value={campId}
                  onChange={(e) => setCampId(e.target.value)}
                  className="w-full h-[38px] px-3 rounded-[8px] border border-[#D1D5DB] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all appearance-none bg-white"
                >
                  <option value="">Selecione...</option>
                  {campeonatos.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <p className="text-[#EF4444] text-[13px] flex items-center gap-1.5">
              <AlertTriangle size={14} />
              {erro}
            </p>
          )}

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E7EB] mt-2">
            <button
              onClick={onVoltar}
              disabled={saving}
              className="h-[38px] px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={saving}
              className="flex items-center gap-2 h-[38px] px-5 rounded-[8px] bg-[#4F6BED] hover:bg-[#3D5BD9] text-white text-[14px] font-semibold transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} color="#FFFFFF" />
              )}
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
type View =
  | { tipo: "lista" }
  | { tipo: "novo" }
  | { tipo: "editar"; time: Time };

export default function TimesPage() {
  const router = useRouter();
  const [view, setView]       = useState<View>({ tipo: "lista" });
  const [loading, setLoading] = useState(true);
  const [times, setTimes]     = useState<Time[]>([]);
  const [erroGlobal, setErroGlobal] = useState("");

  // Modal de confirmação de exclusão
  const [deletando, setDeletando]       = useState<Time | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function carregarTimes() {
    setLoading(true);
    setErroGlobal("");
    try {
      const data = await listarTimes();
      setTimes(data);
    } catch (e: unknown) {
      setErroGlobal(e instanceof Error ? e.message : "Erro ao carregar times.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTimes();
  }, []);

  async function handleConfirmarDelete() {
    if (!deletando) return;
    setLoadingDelete(true);
    try {
      await excluirTime(deletando.id);
      setTimes((prev) => prev.filter((t) => t.id !== deletando.id));
      setDeletando(null);
    } catch (e: unknown) {
      setErroGlobal(e instanceof Error ? e.message : "Erro ao excluir time.");
      setDeletando(null);
    } finally {
      setLoadingDelete(false);
    }
  }

  // ─ Views de formulário ─
  if (view.tipo === "novo") {
    return (
      <TimeForm
        onVoltar={() => setView({ tipo: "lista" })}
        onSalvo={() => { setView({ tipo: "lista" }); carregarTimes(); }}
      />
    );
  }

  if (view.tipo === "editar") {
    return (
      <TimeForm
        timeParaEditar={view.time}
        onVoltar={() => setView({ tipo: "lista" })}
        onSalvo={() => { setView({ tipo: "lista" }); carregarTimes(); }}
      />
    );
  }

  // ─ Lista ─
  return (
    <>
      {/* Modal exclusão */}
      {deletando && (
        <ConfirmDeleteModal
          nomeTime={deletando.nome}
          onConfirm={handleConfirmarDelete}
          onCancel={() => setDeletando(null)}
          loading={loadingDelete}
        />
      )}

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
            onClick={() => setView({ tipo: "novo" })}
            className="flex items-center justify-center gap-2 bg-[#4F6BED] hover:bg-[#3D5BD9] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[10px] transition-colors self-start min-[640px]:self-auto min-[640px]:shrink-0"
          >
            <Plus size={16} color="#FFFFFF" />
            Novo Time
          </button>
        </div>

        {/* Erro global */}
        {erroGlobal && (
          <div className="mb-4 flex items-center gap-2 bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] text-[13px] px-4 py-3 rounded-[8px]">
            <AlertTriangle size={15} />
            {erroGlobal}
            <button onClick={carregarTimes} className="ml-auto underline text-[12px]">Tentar novamente</button>
          </div>
        )}

        {/* Conteúdo */}
        {loading ? (
          <Spinner />
        ) : times.length === 0 ? (
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <EmptyState onNovo={() => setView({ tipo: "novo" })} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {times.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-[12px] border border-[#C4C9D4] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-shadow flex flex-col gap-3"
              >
                {/* Avatar + Nome + Cidade */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0 overflow-hidden">
                    {t.logo_url ? (
                      <img src={t.logo_url} alt={`Escudo ${t.nome}`} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-[#4F6BED] font-bold text-[16px] tracking-wide">{t.sigla}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1E293B] font-semibold text-[15px] truncate">{t.nome}</p>
                    {t.cidade && (
                      <span className="flex items-center gap-1 text-[#94A3B8] text-[12px]">
                        <MapPin size={12} color="#94A3B8" />
                        {t.cidade}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini tabela V/E/D — placeholder, preenchido pela classificação */}
                <div className="grid grid-cols-3 gap-2 bg-[#F1F5F9] rounded-[8px] p-2">
                  {[
                    { label: "V", value: "—" },
                    { label: "E", value: "—" },
                    { label: "D", value: "—" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center py-1">
                      <span className="text-[#1E293B] font-bold text-[14px]">{stat.value}</span>
                      <span className="text-[#94A3B8] text-[11px]">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Campeonato */}
                {t.campeonatos?.nome && (
                  <p className="text-[#94A3B8] text-[11px] flex items-center gap-1">
                    <Users size={11} color="#94A3B8" />
                    {t.campeonatos.nome}
                  </p>
                )}

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

                  {/* Editar */}
                  <button
                    onClick={() => setView({ tipo: "editar", time: t })}
                    className="w-[34px] h-[34px] flex items-center justify-center rounded-[8px] border border-[#10B981] hover:bg-[#F0FDF4] transition-colors shrink-0"
                    aria-label="Editar time"
                  >
                    <Pencil size={12} color="#10B981" />
                  </button>

                  {/* Excluir */}
                  <button
                    onClick={() => setDeletando(t)}
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
    </>
  );
}