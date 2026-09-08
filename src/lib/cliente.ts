/**
 * Chamadas feitas pelo navegador. Sempre para /api/..., nunca direto
 * para o Python — quem repassa é o route handler coringa.
 */

export class ErroApi extends Error {
  status: number;
  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.status = status;
  }
}

function mensagemDoErro(dados: unknown, status: number): string {
  if (typeof dados === "object" && dados !== null) {
    const d = dados as Record<string, unknown>;

    // Erro nosso, vindo do route handler
    if (typeof d.erro === "string") return d.erro;

    // Erro do FastAPI: string simples...
    if (typeof d.detail === "string") return d.detail;

    // ...ou lista de problemas de validação
    if (Array.isArray(d.detail)) {
      const primeiro = d.detail[0] as Record<string, unknown> | undefined;
      if (primeiro && typeof primeiro.msg === "string") {
        return primeiro.msg.replace(/^Value error, /, "");
      }
    }
  }
  return `Erro ${status}.`;
}

export async function chamar<T>(
  caminho: string,
  opcoes: RequestInit = {},
): Promise<T> {
  let r: Response;

  try {
    r = await fetch(`/api${caminho}`, {
      ...opcoes,
      headers: { "Content-Type": "application/json", ...opcoes.headers },
    });
  } catch {
    throw new ErroApi("Falha de conexão. Verifique sua rede.", 0);
  }

  if (r.status === 204) return undefined as T;

  const dados = await r.json().catch(() => null);

  if (!r.ok) throw new ErroApi(mensagemDoErro(dados, r.status), r.status);

  return dados as T;
}

export const api = {
  get: <T>(c: string) => chamar<T>(c),
  post: <T>(c: string, corpo: unknown) =>
    chamar<T>(c, { method: "POST", body: JSON.stringify(corpo) }),
  patch: <T>(c: string, corpo: unknown) =>
    chamar<T>(c, { method: "PATCH", body: JSON.stringify(corpo) }),
  delete: (c: string) => chamar<void>(c, { method: "DELETE" }),
};
