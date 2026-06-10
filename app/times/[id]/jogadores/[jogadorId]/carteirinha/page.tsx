// app/times/[id]/jogadores/[jogadorId]/carteirinha/page.tsx

"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  buscarJogador,
  buscarTime,
  type Jogador,
  type Time,
} from "@/lib/services/times";
import { calcularIdade, bandeiraNacionalidade } from "@/lib/utils/jogadores";

// ─── Utilitários ──────────────────────────────────────────────────────────────

function formatarData(data: string | null): string {
  if (!data) return "—";
  const [y, m, d] = data.split("-");
  return `${d}/${m}/${y}`;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#E5E7EB] border-t-[#4F6BED] animate-spin" />
    </div>
  );
}

// ─── SVG: padrão hexagonal de fundo ──────────────────────────────────────────

const HexPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    style={{ opacity: 0.055 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="hex" x="0" y="0" width="28" height="32" patternUnits="userSpaceOnUse">
        <polygon
          points="14,2 26,9 26,23 14,30 2,23 2,9"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" />
  </svg>
);

// ─── SVG: assinatura estilizada ───────────────────────────────────────────────

const AssinaturasSVG = () => (
  <svg
    viewBox="0 0 180 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[180px] h-[40px]"
  >
    <path
      d="M10 28 C20 10, 35 8, 45 20 C50 26, 55 30, 65 22 C75 14, 80 10, 92 18 C100 24, 108 30, 118 20 C125 13, 132 8, 145 16 C155 22, 162 28, 170 20"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 34 C30 30, 50 32, 68 30 C86 28, 100 34, 120 30 C138 26, 155 32, 168 28"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="0.8"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Bandeiras via flagcdn ────────────────────────────────────────────────────

const BANDEIRAS: Record<string, string> = {
  Brasileiro: "br",
  Colombiano: "co",
  Peruano: "pe",
  Argentino: "ar",
  Uruguaio: "uy",
  Chileno: "cl",
  Paraguaio: "py",
  Boliviano: "bo",
  Venezuelano: "ve",
  Equatoriano: "ec",
};

// ─── Frente do cartão ─────────────────────────────────────────────────────────

function CartaoFrente({ jogador, time }: { jogador: Jogador; time: Time }) {
  const idade = calcularIdade(jogador.data_nascimento);
  const codigoBandeira = BANDEIRAS[jogador.nacionalidade ?? ""] ?? "br";
  const nomeCampeonato = time.campeonatos?.nome ?? "Liga Umari";

  return (
    <div
      className="relative overflow-hidden rounded-[14px] flex-shrink-0"
      style={{
        width: "360px",
        height: "227px",
        background: "linear-gradient(135deg, #0A1628 0%, #1B3A6B 45%, #0D4D6E 100%)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,194,184,0.2)",
      }}
    >
      <HexPattern />

      {/* Faixa dourada diagonal — assinatura visual */}
      <div
        className="absolute"
        style={{
          bottom: "-18px",
          left: "-18px",
          width: "110px",
          height: "110px",
          background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
          transform: "rotate(45deg)",
          opacity: 0.18,
        }}
      />

      {/* Linha turquesa topo */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, #00C2B8, #4F6BED, #00C2B8)" }}
      />

      {/* ── CABEÇALHO ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-3 pb-2">
        {/* Logo liga (escudo genérico) */}
        <div
          className="flex items-center justify-center rounded-[6px] overflow-hidden"
          style={{ width: "32px", height: "32px", background: "rgba(0,194,184,0.15)", border: "1px solid rgba(0,194,184,0.4)" }}
        >
          {time.logo_url ? (
            <img src={time.logo_url} alt={time.nome} className="w-full h-full object-contain p-0.5" />
          ) : (
            <span style={{ color: "#00C2B8", fontSize: "9px", fontWeight: 900, letterSpacing: "0.05em" }}>
              {time.sigla}
            </span>
          )}
        </div>

        {/* Título central */}
        <div className="text-center">
          <p
            style={{
              color: "#00C2B8",
              fontSize: "9px",
              fontWeight: 300,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              textShadow: "0 0 12px rgba(0,194,184,0.6)",
            }}
          >
            CARTEIRA DO ATLETA
          </p>
          <p
            style={{
              color: "#F0F4FF",
              fontSize: "15px",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              lineHeight: 1.1,
            }}
          >
            {nomeCampeonato.toUpperCase()}
          </p>
        </div>

        {/* Escudo time (direita) */}
        <div
          className="flex items-center justify-center rounded-[6px]"
          style={{ width: "32px", height: "32px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)" }}
        >
          <span style={{ color: "#C9A84C", fontSize: "9px", fontWeight: 900 }}>⚽</span>
        </div>
      </div>

      {/* Linha separadora */}
      <div className="relative z-10 mx-4 mb-2.5" style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,194,184,0.5), transparent)" }} />

      {/* ── CORPO ── */}
      <div className="relative z-10 flex gap-3 px-4">
        {/* Foto */}
        <div
          className="flex-shrink-0 overflow-hidden"
          style={{
            width: "72px",
            height: "92px",
            borderRadius: "8px",
            border: "2px solid rgba(0,194,184,0.5)",
            background: "rgba(0,194,184,0.08)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          {jogador.foto_url ? (
            <img
              src={jogador.foto_url}
              alt={jogador.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: "32px", opacity: 0.4 }}>👤</span>
            </div>
          )}
        </div>

        {/* Dados */}
        <div className="flex-1 flex flex-col justify-center gap-[6px]">
          {[
            { label: "TIME", value: time.nome },
            { label: "NOME", value: jogador.nome },
            {
              label: "NAC.",
              value: jogador.nacionalidade ?? "—",
            },
          ].map(({ label, value }) => (
            <div key={label} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "4px" }}>
              <span style={{ color: "#8FA8C8", fontSize: "7px", fontWeight: 300, letterSpacing: "0.2em", display: "block" }}>
                {label}
              </span>
              <span
                style={{
                  color: "#F0F4FF",
                  fontSize: "11px",
                  fontWeight: 600,
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "100%",
                }}
              >
                {value}
              </span>
            </div>
          ))}

          {/* Nº ID + Data na mesma linha */}
          <div className="flex gap-3">
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "4px", flex: 1 }}>
              <span style={{ color: "#8FA8C8", fontSize: "7px", fontWeight: 300, letterSpacing: "0.2em", display: "block" }}>
                DOC.
              </span>
              <span style={{ color: "#F0F4FF", fontSize: "10px", fontWeight: 600 }}>
                {jogador.documento ?? "—"}
              </span>
            </div>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "4px", flex: 1 }}>
              <span style={{ color: "#8FA8C8", fontSize: "7px", fontWeight: 300, letterSpacing: "0.2em", display: "block" }}>
                NASC.
              </span>
              <span style={{ color: "#F0F4FF", fontSize: "10px", fontWeight: 600 }}>
                {formatarData(jogador.data_nascimento)}
                {idade !== null && (
                  <span style={{ color: "#8FA8C8", fontSize: "9px", fontWeight: 300 }}> · {idade}a</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RODAPÉ ── */}
      <div className="relative z-10 flex items-center justify-between px-4 mt-2.5">
        {/* Bandeiras sul-americanas */}
        <div className="flex items-center gap-1.5">
          {["co", "br", "pe"].map((code) => (
            <img
              key={code}
              src={`https://flagcdn.com/w20/${code}.png`}
              alt={code}
              className="rounded-[2px]"
              style={{ width: "20px", height: "14px", objectFit: "cover", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
            />
          ))}
        </div>

        {/* Bandeira do jogador em destaque */}
        <div className="flex items-center gap-1.5">
          <img
            src={`https://flagcdn.com/w20/${codigoBandeira}.png`}
            alt={jogador.nacionalidade ?? ""}
            className="rounded-[2px]"
            style={{ width: "22px", height: "15px", objectFit: "cover", border: "1px solid rgba(0,194,184,0.5)", boxShadow: "0 0 8px rgba(0,194,184,0.3)" }}
          />
          <span style={{ color: "#8FA8C8", fontSize: "8px", letterSpacing: "0.1em" }}>
            {jogador.nacionalidade?.toUpperCase() ?? ""}
          </span>
        </div>
      </div>

      {/* Linha turquesa base */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #00C2B8, transparent)" }}
      />
    </div>
  );
}

// ─── Verso do cartão ──────────────────────────────────────────────────────────

function CartaoVerso({ jogador, time }: { jogador: Jogador; time: Time }) {
  const nomeCampeonato = time.campeonatos?.nome ?? "Liga Umari";

  return (
    <div
      className="relative overflow-hidden rounded-[14px] flex-shrink-0"
      style={{
        width: "360px",
        height: "227px",
        background: "linear-gradient(135deg, #0D4D6E 0%, #1B3A6B 55%, #0A1628 100%)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,194,184,0.2)",
      }}
    >
      <HexPattern />

      {/* Faixa dourada (espelhada) */}
      <div
        className="absolute"
        style={{
          bottom: "-18px",
          right: "-18px",
          width: "110px",
          height: "110px",
          background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
          transform: "rotate(45deg)",
          opacity: 0.18,
        }}
      />

      {/* Linha turquesa topo */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, #00C2B8, #4F6BED, #00C2B8)" }}
      />

      {/* ── CABEÇALHO VERSO ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-3 pb-2">
        <div>
          <p style={{ color: "#8FA8C8", fontSize: "7px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Nº CAMISA
          </p>
          <p
            style={{
              color: "#00C2B8",
              fontSize: "26px",
              fontWeight: 900,
              lineHeight: 1,
              textShadow: "0 0 20px rgba(0,194,184,0.5)",
              letterSpacing: "-0.02em",
            }}
          >
            —
          </p>
        </div>

        <div className="text-center">
          <p style={{ color: "#8FA8C8", fontSize: "7px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            VERSO
          </p>
          <p
            style={{
              color: "#F0F4FF",
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {nomeCampeonato.toUpperCase()}
          </p>
        </div>

        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#C9A84C", fontSize: "14px" }}>⚽</span>
        </div>
      </div>

      {/* Linha separadora */}
      <div className="relative z-10 mx-4 mb-2" style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,194,184,0.4), transparent)" }} />

      {/* ── REGRAS ── */}
      <div className="relative z-10 px-4">
        <div
          className="rounded-[8px] p-2.5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p
            style={{
              color: "#8FA8C8",
              fontSize: "7.5px",
              lineHeight: 1.65,
              letterSpacing: "0.01em",
            }}
          >
            • Este cartão é <span style={{ color: "#F0F4FF", fontWeight: 600 }}>pessoal e intransferível</span>, devendo ser apresentado sempre que solicitado pela organização.{"\n"}
            • O portador se compromete a seguir todas as regras e regulamentos da liga durante o período de vigência.{"\n"}
            • Em caso de perda ou dano, a segunda via terá custo a ser definido pela organização.
          </p>
        </div>
      </div>

      {/* ── ASSINATURA ── */}
      <div className="relative z-10 flex flex-col items-center mt-2.5">
        <AssinaturasSVG />
        <div style={{ height: "1px", width: "180px", background: "rgba(255,255,255,0.25)", marginTop: "2px" }} />
        <p style={{ color: "#8FA8C8", fontSize: "7px", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "3px" }}>
          ORGANIZA
        </p>
      </div>

      {/* ── RODAPÉ VERSO ── */}
      <div className="relative z-10 flex items-center justify-center mt-2">
        <p
          style={{
            color: "#00C2B8",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            textShadow: "0 0 12px rgba(0,194,184,0.5)",
          }}
        >
          @LIGAUMARI
        </p>
      </div>

      {/* Linha turquesa base */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #00C2B8, transparent)" }}
      />
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function CarteirinhaPage() {
  const router = useRouter();
  const params = useParams();
  const timeId = params?.id as string;
  const jogadorId = params?.jogadorId as string;

  const [loading, setLoading] = useState(true);
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [time, setTime] = useState<Time | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!jogadorId || !timeId) return;
    async function carregar() {
      setLoading(true);
      try {
        const [j, t] = await Promise.all([buscarJogador(jogadorId), buscarTime(timeId)]);
        if (!j) throw new Error("Jogador não encontrado.");
        if (!t) throw new Error("Time não encontrado.");
        setJogador(j);
        setTime(t);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao carregar.");
      }
      setLoading(false);
    }
    carregar();
  }, [jogadorId, timeId]);

  if (loading) return <div className="min-h-screen bg-[#F1F3F7]"><Spinner /></div>;

  if (!jogador || !time) {
    return (
      <div className="min-h-screen bg-[#F1F3F7] flex flex-col items-center justify-center gap-4">
        <p className="text-[#94A3B8] text-[15px]">{erro ?? "Dados não encontrados."}</p>
        <button onClick={() => router.push(`/times/${timeId}`)} className="flex items-center gap-2 text-[#4F6BED] text-[14px] hover:underline">
          <ArrowLeft size={15} /> Voltar
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body * { visibility: hidden !important; }
          #area-impressao, #area-impressao * { visibility: visible !important; }
          #area-impressao {
            position: fixed !important;
            inset: 0 !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 24px !important;
            background: white !important;
            padding: 0 !important;
            /* escala os dois cartões para caber na folha */
            transform: scale(0.82) !important;
            transform-origin: center center !important;
          }
          /* remove labels frente/verso no print */
          #area-impressao > div > p { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#F1F3F7] px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">

        {/* Botão Voltar — padrão do app */}
        <button
          onClick={() => router.push(`/times/${timeId}`)}
          className="flex items-center gap-2 text-[#1E293B] text-[14px] font-medium px-3 py-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors mb-6"
        >
          <ArrowLeft size={16} color="#1E293B" />
          Voltar
        </button>

        <div className="max-w-[860px] mx-auto">
          {/* Cabeçalho da seção */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[#1E293B] font-bold text-[20px]">Carteira do Atleta</h1>
              <p className="text-[#94A3B8] text-[13px] mt-0.5">{jogador.nome}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 h-[38px] px-5 rounded-[8px] bg-[#4F6BED] hover:bg-[#3D5BD9] text-white text-[14px] font-semibold transition-colors shrink-0"
            >
              <Printer size={15} />
              Imprimir
            </button>
          </div>

          {/* Área da carteirinha — fundo branco/cinza padrão, scroll horizontal em telas pequenas */}
          <div className="bg-white rounded-[16px] border border-[#C4C9D4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 md:p-8 overflow-x-auto">
            <div
              id="area-impressao"
              className="flex items-start justify-center gap-5"
              style={{ minWidth: "fit-content" }}
            >
              {/* Frente */}
              <div className="flex flex-col items-center gap-2.5">
                <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-[0.3em]">
                  Frente
                </p>
                <CartaoFrente jogador={jogador} time={time} />
              </div>

              {/* Divisor vertical */}
              <div
                className="self-stretch"
                style={{
                  width: "1px",
                  background: "linear-gradient(to bottom, transparent, #C4C9D4, transparent)",
                  margin: "28px 0 0",
                  flexShrink: 0,
                }}
              />

              {/* Verso */}
              <div className="flex flex-col items-center gap-2.5">
                <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-[0.3em]">
                  Verso
                </p>
                <CartaoVerso jogador={jogador} time={time} />
              </div>
            </div>
          </div>

          {/* Dica */}
          <p className="text-center text-[#94A3B8] text-[12px] mt-4">
            Clique em{" "}
            <span className="font-semibold text-[#64748B]">Imprimir</span> e selecione{" "}
            <span className="font-semibold text-[#64748B]">Salvar como PDF</span> para exportar.
            Orientação{" "}
            <span className="font-semibold text-[#64748B]">paisagem</span> recomendada.
          </p>
        </div>
      </div>
    </>
  );
}