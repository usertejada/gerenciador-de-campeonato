// app/times/[id]/adicionar-jogador/page.tsx

"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Save, User, Flag, Upload, X, Phone } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

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

export default function AdicionarJogadorPage() {
  const router = useRouter();
  const params = useParams();
  const timeId = params?.id as string;

  const [form, setForm] = useState<JogadorForm>({
    nomeCompleto: "",
    dataNascimento: "",
    documento: "",
    nacionalidade: "",
    telefone: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof JogadorForm, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Foto 3x4
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);

  const nacionalidadeInfo = NACIONALIDADES.find(
    (n) => n.value === form.nacionalidade
  );

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
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRemoverFoto() {
    setFotoPreview(null);
    setFotoArquivo(null);
    setFotoError(null);
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

  async function handleSalvar() {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push(`/times/${timeId}`), 1200);
  }

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
              Adicionar Jogador
            </h1>
            <p className="text-[#94A3B8] text-[13px]">
              Preencha os dados do atleta
            </p>
          </div>
        </div>

        {/* Feedback de sucesso */}
        {saved && (
          <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#86EFAC] text-[#16A34A] text-[13px] font-medium rounded-[8px] px-4 py-2.5 mb-5">
            ✓ Jogador cadastrado! Redirecionando…
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
              className={`${fieldClass(!!errors.nomeCompleto)} w-full border border-[#C4C9D4]`}
            />
            {errors.nomeCompleto && (
              <span className="text-[#EF4444] text-[12px]">
                {errors.nomeCompleto}
              </span>
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
                className={`${fieldClass(!!errors.dataNascimento)} w-full border border-[#C4C9D4]`}
              />
              {errors.dataNascimento && (
                <span className="text-[#EF4444] text-[12px]">
                  {errors.dataNascimento}
                </span>
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
                  onChange={(e) =>
                    set("nacionalidade", e.target.value as Nacionalidade)
                  }
                  className={`${fieldClass(!!errors.nacionalidade)} w-full appearance-none bg-white pr-8 border border-[#C4C9D4]`}
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
                <span className="text-[#EF4444] text-[12px]">
                  {errors.nacionalidade}
                </span>
              )}
            </div>
          </div>

          {/* Documento + Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Documento */}
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
                className={`${fieldClass(!!errors.documento)} w-full disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed border border-[#C4C9D4]`}
              />
              {errors.documento && (
                <span className="text-[#EF4444] text-[12px]">
                  {errors.documento}
                </span>
              )}
              {!form.nacionalidade && !errors.documento && (
                <span className="text-[#94A3B8] text-[11px]">
                  Selecione a nacionalidade primeiro
                </span>
              )}
            </div>

            {/* Telefone */}
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
                className={`${fieldClass(!!errors.telefone)} w-full`}
              />
            </div>
          </div>

          {/* Foto 3x4 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#374151] font-medium text-[13px]">
              Foto 3×4
              <span className="text-[#94A3B8] font-normal ml-1.5">
                (opcional)
              </span>
            </label>

            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-[72px] h-[96px] rounded-[8px] overflow-hidden border-2 border-[#C7D2FE] bg-[#EEF2FF] flex items-center justify-center shrink-0">
                {fotoPreview ? (
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
                  {fotoArquivo
                    ? fotoArquivo.name
                    : "Clique para enviar a foto"}
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

            {fotoArquivo && !fotoError && (
              <button
                type="button"
                onClick={handleRemoverFoto}
                className="flex items-center gap-1 text-[#EF4444] text-[12px] font-medium self-start hover:underline"
              >
                <X size={12} />
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
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}