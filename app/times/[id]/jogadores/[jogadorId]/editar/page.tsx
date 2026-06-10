// app/times/[id]/jogadores/[jogadorId]/editar/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, User, Flag, Upload, X, Phone, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  buscarJogador,
  atualizarJogador,
  uploadFotoJogador,
  type Jogador,
} from "@/lib/services/times";
import { supabase } from "@/lib/supabase";

// ─── Tipos e constantes (mesmo padrão do adicionar-jogador) ───────────────────

type Nacionalidade = "Brasileiro" | "Colombiano" | "Peruano";

interface JogadorForm {
  nomeCompleto: string;
  dataNascimento: string;
  documento: string;
  nacionalidade: Nacionalidade | "";
  telefone: string;
}

const NACIONALIDADES: {
  value: Nacionalidade;
  label: string;
  bandeira: string;
  docLabel: string;
  docPlaceholder: string;
  telPlaceholder: string;
}[] = [
  {
    value: "Brasileiro",
    label: "Brasileiro",
    bandeira: "🇧🇷",
    docLabel: "CPF",
    docPlaceholder: "000.000.000-00",
    telPlaceholder: "(11) 99999-0000",
  },
  {
    value: "Colombiano",
    label: "Colombiano",
    bandeira: "🇨🇴",
    docLabel: "Cédula de Ciudadanía",
    docPlaceholder: "Ex: 1023456789",
    telPlaceholder: "+57 300 000 0000",
  },
  {
    value: "Peruano",
    label: "Peruano",
    bandeira: "🇵🇪",
    docLabel: "DNI",
    docPlaceholder: "Ex: 12345678",
    telPlaceholder: "+51 900 000 000",
  },
];

function fieldClass(error?: boolean) {
  return `h-[38px] px-3 rounded-[8px] border text-[#1E293B] text-[14px] outline-none transition-all ${
    error
      ? "border-[#EF4444] focus:ring-2 focus:ring-[rgba(239,68,68,0.2)]"
      : "border-[#D1D5DB] focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)]"
  }`;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function EditarJogadorPage() {
  const router = useRouter();
  const params = useParams();
  const timeId = params?.id as string;
  const jogadorId = params?.jogadorId as string;

  // ── Estados ────────────────────────────────────────────────────────────────
  const [loadingDados, setLoadingDados] = useState(true);
  const [jogadorOriginal, setJogadorOriginal] = useState<Jogador | null>(null);

  const [form, setForm] = useState<JogadorForm>({
    nomeCompleto: "",
    dataNascimento: "",
    documento: "",
    nacionalidade: "",
    telefone: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof JogadorForm, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  // Foto
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const [removerFotoExistente, setRemoverFotoExistente] = useState(false);

  const nacionalidadeInfo = NACIONALIDADES.find((n) => n.value === form.nacionalidade);

  // ── Carrega dados do jogador ───────────────────────────────────────────────
  useEffect(() => {
    if (!jogadorId) return;
    async function carregar() {
      setLoadingDados(true);
      try {
        const jogador = await buscarJogador(jogadorId);
        if (!jogador) throw new Error("Jogador não encontrado.");
        setJogadorOriginal(jogador);
        setForm({
          nomeCompleto: jogador.nome ?? "",
          dataNascimento: jogador.data_nascimento ?? "",
          documento: jogador.documento ?? "",
          nacionalidade: (jogador.nacionalidade as Nacionalidade) ?? "",
          telefone: jogador.telefone ?? "",
        });
        if (jogador.foto_url) {
          setFotoPreview(jogador.foto_url);
        }
      } catch {
        setErroGeral("Não foi possível carregar os dados do jogador.");
      }
      setLoadingDados(false);
    }
    carregar();
  }, [jogadorId]);

  // ── Helpers de formulário ──────────────────────────────────────────────────
  function set<K extends keyof JogadorForm>(key: K, value: JogadorForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setFotoError("Apenas arquivos JPG ou PNG são aceitos.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFotoError("A foto deve ter no máximo 2 MB.");
      return;
    }
    setFotoError(null);
    setFotoArquivo(file);
    setRemoverFotoExistente(false);
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRemoverFoto() {
    setFotoPreview(null);
    setFotoArquivo(null);
    setFotoError(null);
    // Se havia foto salva no banco, marca para remoção
    if (jogadorOriginal?.foto_url) {
      setRemoverFotoExistente(true);
    }
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.nomeCompleto.trim()) e.nomeCompleto = "Nome obrigatório";
    if (!form.dataNascimento) e.dataNascimento = "Data obrigatória";
    if (!form.documento.trim()) e.documento = "Documento obrigatório";
    if (!form.nacionalidade) e.nacionalidade = "Selecione a nacionalidade";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Salvar ─────────────────────────────────────────────────────────────────
  async function handleSalvar() {
    if (!validate()) return;
    setSaving(true);
    setErroGeral(null);

    try {
      let foto_url: string | undefined = undefined; // undefined = não altera

      // Remove foto antiga do storage se foi pedido
      if (removerFotoExistente && jogadorOriginal?.foto_url) {
        const match = jogadorOriginal.foto_url.match(/fotos-jogadores\/(.+)$/);
        if (match) {
          await supabase.storage.from("fotos-jogadores").remove([match[1]]);
        }
        // foto_url permanece undefined; passamos foto_url: undefined para limpar via spread abaixo
      }

      // Faz upload da nova foto se selecionada
      if (fotoArquivo) {
        // Remove a anterior antes de enviar a nova
        if (jogadorOriginal?.foto_url && !removerFotoExistente) {
          const match = jogadorOriginal.foto_url.match(/fotos-jogadores\/(.+)$/);
          if (match) {
            await supabase.storage.from("fotos-jogadores").remove([match[1]]);
          }
        }
        try {
          foto_url = await uploadFotoJogador(fotoArquivo, jogadorId);
        } catch {
          console.warn("Falha ao fazer upload da foto, dados salvos sem atualizar foto.");
        }
      }

      await atualizarJogador(jogadorId, {
        nome: form.nomeCompleto.trim(),
        data_nascimento: form.dataNascimento || undefined,
        documento: form.documento.trim() || undefined,
        nacionalidade: form.nacionalidade || undefined,
        telefone: form.telefone.trim() || undefined,
        // foto_url só entra no payload se houve mudança
        ...(removerFotoExistente && !fotoArquivo
          ? { foto_url: undefined }   // remove: envia undefined (o service deve tratar ou usar null internamente)
          : foto_url !== undefined
          ? { foto_url }              // nova foto
          : {}),                      // sem mudança: não passa a chave
      });

      setSaved(true);
      setTimeout(() => router.push(`/times/${timeId}`), 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar alterações.";
      setErroGeral(msg);
    } finally {
      setSaving(false);
    }
  }

  // ── Render: carregando ─────────────────────────────────────────────────────
  if (loadingDados) {
    return (
      <div className="min-h-screen bg-[#F1F3F7]">
        <Spinner />
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

      <div className="max-w-[560px] mx-auto bg-white rounded-[12px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <User size={18} color="#4F6BED" />
          </div>
          <div>
            <h1 className="text-[#1E293B] font-bold text-[22px] leading-tight">
              Editar Jogador
            </h1>
            <p className="text-[#94A3B8] text-[13px]">
              {jogadorOriginal?.nome ?? "Atualize os dados do atleta"}
            </p>
          </div>
        </div>

        {/* Feedback sucesso */}
        {saved && (
          <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#86EFAC] text-[#16A34A] text-[13px] font-medium rounded-[8px] px-4 py-2.5 mb-5">
            ✓ Dados atualizados! Redirecionando…
          </div>
        )}

        {/* Feedback erro */}
        {erroGeral && (
          <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[13px] font-medium rounded-[8px] px-4 py-2.5 mb-5">
            ✕ {erroGeral}
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* Nome Completo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#374151] font-medium text-[13px]">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Ex: Carlos Eduardo Silva"
              value={form.nomeCompleto}
              onChange={(e) => set("nomeCompleto", e.target.value)}
              className={`${fieldClass(!!errors.nomeCompleto)} w-full`}
            />
            {errors.nomeCompleto && (
              <span className="text-[#EF4444] text-[12px]">{errors.nomeCompleto}</span>
            )}
          </div>

          {/* Nascimento + Nacionalidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={form.dataNascimento}
                onChange={(e) => set("dataNascimento", e.target.value)}
                className={`${fieldClass(!!errors.dataNascimento)} w-full`}
              />
              {errors.dataNascimento && (
                <span className="text-[#EF4444] text-[12px]">{errors.dataNascimento}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                <Flag size={12} color="#4F6BED" />
                Nacionalidade
              </label>
              <div className="relative">
                <select
                  value={form.nacionalidade}
                  onChange={(e) => set("nacionalidade", e.target.value as Nacionalidade)}
                  className={`${fieldClass(!!errors.nacionalidade)} w-full appearance-none bg-white pr-8`}
                >
                  <option value="">Selecione...</option>
                  {NACIONALIDADES.map((n) => (
                    <option key={n.value} value={n.value}>
                      {n.bandeira} {n.label}
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
              {errors.nacionalidade && (
                <span className="text-[#EF4444] text-[12px]">{errors.nacionalidade}</span>
              )}
            </div>
          </div>

          {/* Documento + Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">
                {nacionalidadeInfo ? nacionalidadeInfo.docLabel : "Documento"}
              </label>
              <input
                type="text"
                placeholder={
                  nacionalidadeInfo
                    ? nacionalidadeInfo.docPlaceholder
                    : "Selecione a nacionalidade"
                }
                disabled={!form.nacionalidade}
                value={form.documento}
                onChange={(e) => set("documento", e.target.value)}
                className={`${fieldClass(!!errors.documento)} w-full disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed`}
              />
              {errors.documento && (
                <span className="text-[#EF4444] text-[12px]">{errors.documento}</span>
              )}
              {!form.nacionalidade && !errors.documento && (
                <span className="text-[#94A3B8] text-[11px]">
                  Selecione a nacionalidade primeiro
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px] flex items-center gap-1.5">
                <Phone size={12} color="#4F6BED" />
                Telefone
                <span className="text-[#94A3B8] font-normal">(opcional)</span>
              </label>
              <input
                type="tel"
                placeholder={
                  nacionalidadeInfo
                    ? nacionalidadeInfo.telPlaceholder
                    : "(11) 99999-0000"
                }
                value={form.telefone}
                onChange={(e) => set("telefone", e.target.value)}
                className={`${fieldClass()} w-full`}
              />
            </div>
          </div>

          {/* Foto 3x4 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#374151] font-medium text-[13px]">
              Foto 3×4
              <span className="text-[#94A3B8] font-normal ml-1.5">(opcional)</span>
            </label>

            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-[72px] h-[96px] rounded-[8px] overflow-hidden border-2 border-[#C7D2FE] bg-[#EEF2FF] flex items-center justify-center shrink-0">
                {fotoPreview && !removerFotoExistente ? (
                  <img
                    src={fotoPreview}
                    alt="Foto do jogador"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={26} color="#818CF8" />
                )}
              </div>

              {/* Área de upload */}
              <button
                type="button"
                onClick={() => fotoInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#C7D2FE] hover:border-[#4F6BED] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-[10px] py-5 px-4 transition-colors cursor-pointer h-[96px]"
              >
                <Upload size={18} color="#4F6BED" />
                <span className="text-[#4F6BED] font-medium text-[13px] text-center leading-tight">
                  {fotoArquivo ? fotoArquivo.name : "Clique para trocar a foto"}
                </span>
                {!fotoArquivo && (
                  <span className="text-[#94A3B8] text-[11px] text-center leading-tight">
                    JPG ou PNG · máx. 2 MB
                  </span>
                )}
              </button>
            </div>

            <input
              ref={fotoInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleFotoChange}
            />

            {fotoError && (
              <span className="text-[#EF4444] text-[12px]">{fotoError}</span>
            )}

            {(fotoArquivo || (jogadorOriginal?.foto_url && !removerFotoExistente)) &&
              !fotoError && (
                <button
                  type="button"
                  onClick={handleRemoverFoto}
                  className="flex items-center gap-1 text-[#EF4444] text-[12px] font-medium self-start hover:underline"
                >
                  <Trash2 size={12} />
                  Remover foto
                </button>
              )}

            <span className="text-[#94A3B8] text-[11px]">
              A foto será usada no cartão de identificação do jogador
            </span>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E7EB] mt-2">
            <button
              onClick={() => router.push(`/times/${timeId}`)}
              className="h-[38px] px-4 rounded-[8px] border border-[#D1D5DB] text-[#374151] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={saving || saved}
              className="flex items-center gap-2 h-[38px] px-5 rounded-[8px] bg-[#4F6BED] hover:bg-[#3D5BD9] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  <Save size={16} color="#FFFFFF" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}