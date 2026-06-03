//app/campeonatos/[id]/editar/page.tsx

"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Trophy, ImagePlus, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface FormData {
  nome: string;
  descricao: string;
  formato: string;
  status: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  numero_times: string;
}

export default function EditarCampeonatoPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState<FormData>({
    nome: "",
    descricao: "",
    formato: "",
    status: "",
    data_inicio: "",
    data_fim: "",
    local: "",
    numero_times: "",
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoAtual, setLogoAtual] = useState<string | null>(null);
  const [removerLogo, setRemoverLogo] = useState(false);

  useEffect(() => {
    async function fetchCampeonato() {
      const { data, error } = await supabase
        .from("campeonatos")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setErro("Campeonato não encontrado.");
        setCarregando(false);
        return;
      }

      setForm({
        nome: data.nome ?? "",
        descricao: data.descricao ?? "",
        formato: data.formato ?? "",
        status: data.status ?? "",
        data_inicio: data.data_inicio ?? "",
        data_fim: data.data_fim ?? "",
        local: data.local ?? "",
        numero_times: data.numero_times ? String(data.numero_times) : "",
      });

      setLogoAtual(data.logo_url ?? null);
      setLogoPreview(data.logo_url ?? null);
      setCarregando(false);
    }

    fetchCampeonato();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErro("Selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 2MB.");
      return;
    }

    setErro(null);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setRemoverLogo(false);
  }

  function handleRemoveLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    setRemoverLogo(true);
  }

  async function uploadLogo(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("logos-campeonatos")
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      console.error("Erro no upload:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("logos-campeonatos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSalvar() {
    if (!form.nome.trim()) {
      setErro("O nome do campeonato é obrigatório.");
      return;
    }
    if (!form.formato) {
      setErro("Selecione um formato.");
      return;
    }
    if (!form.status) {
      setErro("Selecione um status.");
      return;
    }

    setErro(null);
    setSalvando(true);

    let logo_url: string | null = logoAtual;

    if (logoFile) {
      const novaUrl = await uploadLogo(logoFile);
      if (!novaUrl) {
        setErro("Erro ao fazer upload da logo. Tente novamente.");
        setSalvando(false);
        return;
      }
      logo_url = novaUrl;
    } else if (removerLogo) {
      logo_url = null;
    }

    const { error } = await supabase
      .from("campeonatos")
      .update({
        nome: form.nome.trim(),
        descricao: form.descricao.trim() || null,
        formato: form.formato,
        status: form.status,
        data_inicio: form.data_inicio || null,
        data_fim: form.data_fim || null,
        local: form.local.trim() || null,
        numero_times: form.numero_times ? parseInt(form.numero_times) : null,
        logo_url,
      })
      .eq("id", id);

    setSalvando(false);

    if (error) {
      console.error("Erro ao salvar:", error);
      setErro("Erro ao salvar o campeonato. Tente novamente.");
      return;
    }

    router.push("/campeonatos");
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#F1F3F7] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
      {/* Botão voltar */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft size={16} color="#1E293B" />
        Voltar
      </button>

      {/* Container do formulário */}
      <div className="max-w-[640px] mx-auto bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <Trophy size={18} color="#4F6BED" />
          </div>
          <div>
            <h1 className="text-[#1E293B] font-bold text-[22px] leading-tight">Editar Campeonato</h1>
            <p className="text-[#94A3B8] text-[13px]">Atualize as informações do campeonato</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Erro */}
          {erro && (
            <div className="px-4 py-3 rounded-[8px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[13px]">
              {erro}
            </div>
          )}

          {/* Logo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#374151] font-medium text-[13px]">Logo do Campeonato</label>
            {logoPreview ? (
              <div className="relative w-full h-[140px] rounded-[10px] border border-[#C4C9D4] overflow-hidden">
                <img
                  src={logoPreview}
                  alt="Preview da logo"
                  className="w-full h-full object-contain bg-[#F8FAFC]"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-[#E5E7EB] shadow flex items-center justify-center hover:bg-[#FEF2F2] transition-colors"
                  aria-label="Remover logo"
                >
                  <X size={14} color="#EF4444" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 w-full h-[140px] rounded-[10px] border-2 border-dashed border-[#C4C9D4] cursor-pointer hover:border-[#4F6BED] hover:bg-[#F8FAFF] transition-all">
                <ImagePlus size={28} color="#94A3B8" />
                <span className="text-[#94A3B8] text-[13px]">Clique para enviar uma imagem</span>
                <span className="text-[#CBD5E1] text-[11px]">PNG, JPG, WEBP • Máx. 2MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </label>
            )}
          </div>

          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#374151] font-medium text-[13px]">
              Nome do Campeonato <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Copa Verão 2025"
              className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#374151] font-medium text-[13px]">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva o campeonato..."
              rows={4}
              className="px-3 py-2 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all resize-vertical min-h-[96px]"
            />
          </div>

          {/* Grid 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data início */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Data de Início</label>
              <input
                type="date"
                name="data_inicio"
                value={form.data_inicio}
                onChange={handleChange}
                className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>

            {/* Data fim */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Data de Término</label>
              <input
                type="date"
                name="data_fim"
                value={form.data_fim}
                onChange={handleChange}
                className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>

            {/* Formato */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">
                Formato <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <select
                  name="formato"
                  value={form.formato}
                  onChange={handleChange}
                  className="w-full h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all appearance-none bg-white"
                >
                  <option value="">Selecione...</option>
                  <option>Mata-mata</option>
                  <option>Pontos corridos</option>
                  <option>Grupos + Mata-mata</option>
                  <option>Eliminatório</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Nº de times */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Número de Times</label>
              <input
                type="number"
                name="numero_times"
                value={form.numero_times}
                onChange={handleChange}
                placeholder="Ex: 16"
                min={2}
                className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>

            {/* Local */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Local</label>
              <input
                type="text"
                name="local"
                value={form.local}
                onChange={handleChange}
                placeholder="Ex: Arena Central"
                className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">
                Status <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all appearance-none bg-white"
                >
                  <option value="">Selecione...</option>
                  <option>Pendente</option>
                  <option>Em Andamento</option>
                  <option>Finalizado</option>
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
              onClick={() => router.back()}
              disabled={salvando}
              className="h-[38px] px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="flex items-center gap-2 h-[38px] px-5 rounded-[8px] bg-[#4F6BED] hover:bg-[#3D5BD9] text-white text-[14px] font-semibold transition-colors disabled:opacity-60"
            >
              {salvando ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <Save size={16} color="#FFFFFF" />
              )}
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}