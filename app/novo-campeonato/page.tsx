"use client";

import { ArrowLeft, Save, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NovoCampeonatoPage() {
  const router = useRouter();

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
        {/* Header do form */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <Trophy size={18} color="#4F6BED" />
          </div>
          <div>
            <h1 className="text-[#1E293B] font-bold text-[22px] leading-tight">Novo Campeonato</h1>
            <p className="text-[#94A3B8] text-[13px]">Preencha as informações do campeonato</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#374151] font-medium text-[13px]">Nome do Campeonato</label>
            <input
              type="text"
              placeholder="Ex: Copa Verão 2025"
              className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#374151] font-medium text-[13px]">Descrição</label>
            <textarea
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
                className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>

            {/* Data fim */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Data de Término</label>
              <input
                type="date"
                className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>

            {/* Formato */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Formato</label>
              <div className="relative">
                <select className="w-full h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all appearance-none bg-white">
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
                placeholder="Ex: Arena Central"
                className="h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#374151] font-medium text-[13px]">Status</label>
              <div className="relative">
                <select className="w-full h-[38px] px-3 rounded-[8px] border border-[#C4C9D4] text-[#1E293B] text-[14px] outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[rgba(79,107,237,0.2)] transition-all appearance-none bg-white">
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