import { jwtVerify } from "jose";

export const COOKIE = "sessao";

/**
 * Precisa ser exatamente o mesmo AUTH_SECRET do .env da API em Python.
 * O FastAPI assina o token com essa chave; aqui a gente só confere a
 * assinatura. Chaves diferentes = todo token parece falso, e o login
 * entra em laço: entra, grava o cookie, e é chutado de volta.
 */
const SEGREDO = new TextEncoder().encode(
  process.env.AUTH_SECRET ??
    (() => {
      throw new Error("AUTH_SECRET não está definida no .env.local");
    })(),
);

export type Sessao = {
  sub: string; // id do usuário
  username: string;
  role: "admin" | "editor" | "leitor";
};

export async function lerSessao(token?: string): Promise<Sessao | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SEGREDO);
    return {
      sub: payload.sub as string,
      username: payload.username as string,
      role: payload.role as Sessao["role"],
    };
  } catch {
    // Expirado, adulterado ou assinado com outra chave
    return null;
  }
}
