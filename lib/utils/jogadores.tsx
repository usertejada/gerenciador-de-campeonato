// lib/utils/jogadores.ts

export const bandeiraNacionalidade: Record<string, string> = {
  Brasileiro: "🇧🇷",
  Colombiano: "🇨🇴",
  Peruano: "🇵🇪",
  Argentino: "🇦🇷",
  Uruguaio: "🇺🇾",
  Chileno: "🇨🇱",
  Paraguaio: "🇵🇾",
  Boliviano: "🇧🇴",
  Venezuelano: "🇻🇪",
  Equatoriano: "🇪🇨",
};

export function calcularIdade(dataNascimento: string | null): number | null {
  if (!dataNascimento) return null;
  const nascimento = new Date(dataNascimento + "T00:00:00");
  return Math.floor(
    (Date.now() - nascimento.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
}

export function iniciaisNome(nome: string): string {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}