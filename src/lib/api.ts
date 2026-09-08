import { cookies } from "next/headers";

import { COOKIE } from "./sessao";

// Sem NEXT_PUBLIC_ de propósito: essa variável só existe no servidor.
// O navegador nunca vê o endereço da API nem fala com ela direto.
export const API_URL = process.env.API_URL ?? "http://localhost:8000";

export type Usuario = {
  id: string;
  nome: string;
  sobrenome: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "leitor";
  ativo: boolean;
  avatar_url: string | null;
  ultimo_login_em: string | null;
};

export class ApiForaDoAr extends Error {
  constructor() {
    super("Não foi possível falar com o servidor.");
  }
}

/**
 * Chama a API em Python. Converte "servidor desligado" numa exceção
 * própria, porque um fetch que falha na rede estoura um erro genérico
 * que não diz nada de útil para quem está usando.
 */
export async function api(
  caminho: string,
  opcoes: RequestInit & { token?: string } = {},
) {
  const { token, ...init } = opcoes;

  try {
    return await fetch(`${API_URL}${caminho}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiForaDoAr();
  }
}

/**
 * Busca o usuário logado. Use em componentes de servidor.
 * Devolve null se não houver cookie, se o token expirou ou se a conta
 * foi desativada depois que o token foi emitido.
 */
export async function usuarioLogado(): Promise<Usuario | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  try {
    const r = await api("/auth/eu", { token });
    if (!r.ok) return null;
    return (await r.json()) as Usuario;
  } catch {
    return null;
  }
}
