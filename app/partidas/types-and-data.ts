// partidas/types-and-data.ts

export type StatusPartida = "agendada" | "em_andamento" | "finalizada";

export interface Jogador {
  id: number;
  nome: string;
}

export interface Partida {
  id: number;
  timeA: string;
  timeB: string;
  escudoA?: string;
  escudoB?: string;
  golsA?: number;
  golsB?: number;
  data: string;
  horaInicio: string;
  duracao: string;
  campeonato: string;
  local?: string;
  status: StatusPartida;
  jogadoresA?: Jogador[];
  jogadoresB?: Jogador[];
}

export interface DadosFinalizacao {
  golsA: number;
  golsB: number;
  artilheiros: { jogadorId: number; gols: number }[];
  cartoesAmarelos: number[];
  cartoesVermelhos: number[];
  observacoes: string;
}

// ── Mocks ────────────────────────────────────────────────────────────────────

export const jogadoresMock: Record<string, Jogador[]> = {
  "Águias SC": [
    { id: 1, nome: "Carlos Silva" },
    { id: 2, nome: "Pedro Oliveira" },
    { id: 3, nome: "João Santos" },
    { id: 4, nome: "Lucas Ferreira" },
    { id: 5, nome: "Rafael Costa" },
  ],
  "Leões FC": [
    { id: 6, nome: "Marcos Lima" },
    { id: 7, nome: "André Souza" },
    { id: 8, nome: "Felipe Rocha" },
    { id: 9, nome: "Thiago Alves" },
    { id: 10, nome: "Bruno Nunes" },
  ],
  "Panteras FC": [
    { id: 11, nome: "Gabriel Mendes" },
    { id: 12, nome: "Diego Castro" },
    { id: 13, nome: "Mateus Pires" },
    { id: 14, nome: "Vinicius Leal" },
    { id: 15, nome: "Eduardo Dias" },
  ],
  "Trovões EC": [
    { id: 16, nome: "Alexandre Fonseca" },
    { id: 17, nome: "Rodrigo Melo" },
    { id: 18, nome: "Henrique Teixeira" },
    { id: 19, nome: "Leonardo Barbosa" },
    { id: 20, nome: "Gustavo Ramos" },
  ],
  "Dragões SC": [
    { id: 21, nome: "Fernando Moreira" },
    { id: 22, nome: "Ricardo Cardoso" },
    { id: 23, nome: "Sergio Cunha" },
    { id: 24, nome: "Paulo Freitas" },
    { id: 25, nome: "Claudio Vieira" },
  ],
  "Falcões EC": [
    { id: 26, nome: "Daniel Correia" },
    { id: 27, nome: "Marcelo Andrade" },
    { id: 28, nome: "Roberto Ribeiro" },
    { id: 29, nome: "Anderson Pereira" },
    { id: 30, nome: "Julio Gomes" },
  ],
};

export const mockPartidas: Partida[] = [
  {
    id: 1,
    timeA: "Águias SC",
    timeB: "Leões FC",
    escudoA: "🦅",
    escudoB: "🦁",
    golsA: 2,
    golsB: 1,
    data: "2025-06-01",
    horaInicio: "08:00",
    duracao: "45min/45min",
    campeonato: "Copa Verão 2025",
    local: "Campo Principal",
    status: "finalizada",
  },
  {
    id: 2,
    timeA: "Panteras FC",
    timeB: "Trovões EC",
    escudoA: "🐆",
    escudoB: "⚡",
    golsA: 1,
    golsB: 1,
    data: "2025-06-01",
    horaInicio: "10:00",
    duracao: "45min/45min",
    campeonato: "Copa Verão 2025",
    local: "Campo Principal",
    status: "finalizada",
  },
  {
    id: 3,
    timeA: "Dragões SC",
    timeB: "Falcões EC",
    escudoA: "🐉",
    escudoB: "🦅",
    data: "2025-06-08",
    horaInicio: "09:00",
    duracao: "20min/20min",
    campeonato: "Liga Empresarial",
    local: "Quadra Coberta",
    status: "em_andamento",
  },
  {
    id: 4,
    timeA: "Águias SC",
    timeB: "Panteras FC",
    escudoA: "🦅",
    escudoB: "🐆",
    data: "2025-06-15",
    horaInicio: "08:00",
    duracao: "20min/20min",
    campeonato: "Copa Verão 2025",
    local: "Campo Principal",
    status: "agendada",
  },
  {
    id: 5,
    timeA: "Trovões EC",
    timeB: "Falcões EC",
    escudoA: "⚡",
    escudoB: "🦅",
    data: "2025-06-15",
    horaInicio: "09:30",
    duracao: "20min/20min",
    campeonato: "Copa Verão 2025",
    local: "Campo Principal",
    status: "agendada",
  },
  {
    id: 6,
    timeA: "Leões FC",
    timeB: "Dragões SC",
    escudoA: "🦁",
    escudoB: "🐉",
    data: "2025-06-22",
    horaInicio: "10:00",
    duracao: "15min/15min",
    campeonato: "Torneio Relâmpago",
    status: "agendada",
  },
];

// ── Configs de status ────────────────────────────────────────────────────────

import { CheckCircle2, Timer, Circle } from "lucide-react";
import React from "react";

export const statusConfig: Record<
  StatusPartida,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  finalizada: {
    label: "Finalizada",
    color: "#16A34A",
    bg: "#F0FDF4",
    border: "#86EFAC",
    icon: React.createElement(CheckCircle2, { size: 11 }),
  },
  em_andamento: {
    label: "Em andamento",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: React.createElement(Timer, { size: 11 }),
  },
  agendada: {
    label: "Agendada",
    color: "#4F6BED",
    bg: "#EEF2FF",
    border: "#C7D2FE",
    icon: React.createElement(Circle, { size: 11 }),
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

export function formatarData(data: string) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function agruparPorData(partidas: Partida[]) {
  const grupos: Record<string, Partida[]> = {};
  for (const p of partidas) {
    if (!grupos[p.data]) grupos[p.data] = [];
    grupos[p.data].push(p);
  }
  return Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b));
}