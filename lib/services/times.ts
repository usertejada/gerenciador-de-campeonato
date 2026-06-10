// lib/services/times.ts

import { supabase } from "@/lib/supabase";

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface Time {
  id: string;
  nome: string;
  sigla: string;
  cidade: string | null;
  estado: string | null;
  campeonato_id: string | null;
  logo_url: string | null;
  created_at: string;
  // join opcional com campeonatos
  campeonatos?: { nome: string } | null;
}

export interface Jogador {
  id: string;
  nome: string;
  documento: string | null;
  data_nascimento: string | null;
  nacionalidade: string | null;
  telefone: string | null;
  foto_url: string | null;
  time_id: string;
  created_at: string;
}

export interface NovoTimePayload {
  nome: string;
  sigla: string;
  cidade?: string;
  estado?: string;
  campeonato_id?: string;
  logo_url?: string;
}

export interface NovoJogadorPayload {
  nome: string;
  documento?: string;
  data_nascimento?: string;
  nacionalidade?: string;
  telefone?: string;
  foto_url?: string;
  time_id: string;
}

// ─── TIMES ────────────────────────────────────────────────────────────────────

/** Lista todos os times, com nome do campeonato via join */
export async function listarTimes(): Promise<Time[]> {
  const { data, error } = await supabase
    .from("times")
    .select("*, campeonatos(nome)")
    .order("nome");

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Busca um time pelo ID */
export async function buscarTime(id: string): Promise<Time | null> {
  const { data, error } = await supabase
    .from("times")
    .select("*, campeonatos(nome)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(error.message);
  }
  return data;
}

/** Cria um novo time */
export async function criarTime(payload: NovoTimePayload): Promise<Time> {
  const { data, error } = await supabase
    .from("times")
    .insert(payload)
    .select("*, campeonatos(nome)")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Atualiza um time existente */
export async function atualizarTime(
  id: string,
  payload: Partial<NovoTimePayload>
): Promise<Time> {
  const { data, error } = await supabase
    .from("times")
    .update(payload)
    .eq("id", id)
    .select("*, campeonatos(nome)")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Exclui um time pelo ID */
export async function excluirTime(id: string): Promise<void> {
  const { error } = await supabase.from("times").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Faz upload do logo e retorna a URL pública */
export async function uploadLogoTime(
  file: File,
  timeId: string
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${timeId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("logos-times")
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("logos-times").getPublicUrl(path);
  return data.publicUrl;
}

// ─── JOGADORES ────────────────────────────────────────────────────────────────

/** Lista todos os jogadores de um time */
export async function listarJogadores(timeId: string): Promise<Jogador[]> {
  const { data, error } = await supabase
    .from("jogadores")
    .select("*")
    .eq("time_id", timeId)
    .order("nome");

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Busca um jogador pelo ID */
export async function buscarJogador(id: string): Promise<Jogador | null> {
  const { data, error } = await supabase
    .from("jogadores")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return data;
}

/** Cria um novo jogador */
export async function criarJogador(
  payload: NovoJogadorPayload
): Promise<Jogador> {
  const { data, error } = await supabase
    .from("jogadores")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Atualiza um jogador existente */
export async function atualizarJogador(
  id: string,
  payload: Partial<Omit<NovoJogadorPayload, "time_id">>
): Promise<Jogador> {
  const { data, error } = await supabase
    .from("jogadores")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Exclui um jogador pelo ID */
export async function excluirJogador(id: string): Promise<void> {
  const { error } = await supabase.from("jogadores").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Transfere jogador para outro time (atualiza time_id) */
export async function transferirJogador(
  jogadorId: string,
  novoTimeId: string
): Promise<Jogador> {
  const { data, error } = await supabase
    .from("jogadores")
    .update({ time_id: novoTimeId })
    .eq("id", jogadorId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Faz upload da foto do jogador e retorna URL pública */
export async function uploadFotoJogador(
  file: File,
  jogadorId: string
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${jogadorId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("fotos-jogadores")
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage
    .from("fotos-jogadores")
    .getPublicUrl(path);
  return data.publicUrl;
}