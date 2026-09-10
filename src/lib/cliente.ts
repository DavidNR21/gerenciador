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

// O FastAPI diz o que está errado, mas não em que campo — a mensagem
// vem como "String should have at least 1 character" e o nome do campo
// fica separado, em "loc". Sem juntar os dois, o erro é inútil num
// formulário com dez campos.
const NOMES_DE_CAMPO: Record<string, string> = {
  nome: "Nome",
  sobrenome: "Sobrenome",
  username: "Usuário",
  email: "E-mail",
  senha: "Senha",
  senha_nova: "Senha nova",
  senha_atual: "Senha atual",
  role: "Papel",
  titulo: "Título",
  url: "Link",
  urls: "Links",
  texto: "Texto",
  descricao: "Descrição",
  tamanho_bytes: "Tamanho",
  tipo: "Tipo",
  tags: "Tags",
  ordem_inicial: "Ordem",
  titulo_base: "Título base",
};

function plural(n: string, singular: string, plural_: string) {
  return n === "1" ? singular : plural_;
}

/** Cada regra devolve a frase pronta a partir dos grupos capturados. */
const TRADUCOES: [RegExp, (g: RegExpMatchArray) => string][] = [
  [
    /String should have at least (\d+) characters?/,
    (g) => `precisa de ao menos ${g[1]} ${plural(g[1], "caractere", "caracteres")}`,
  ],
  [
    /String should have at most (\d+) characters?/,
    (g) => `aceita no máximo ${g[1]} ${plural(g[1], "caractere", "caracteres")}`,
  ],
  [/Field required/, () => "é obrigatório"],
  [/value is not a valid email address.*/, () => "não é um e-mail válido"],
  [/Input should be a valid integer.*/, () => "precisa ser um número inteiro"],
  [
    /Input should be greater than or equal to (\d+)/,
    (g) => `precisa ser ${g[1]} ou mais`,
  ],
  [
    /List should have at most (\d+) items?.*/,
    (g) => `aceita no máximo ${g[1]} ${plural(g[1], "item", "itens")}`,
  ],
  [
    /List should have at least (\d+) items?.*/,
    (g) => `precisa de ao menos ${g[1]} ${plural(g[1], "item", "itens")}`,
  ],
];

function descrever(loc: unknown[], msg: string): string {
  const bruto = String(loc[loc.length - 1] ?? "");
  const campo = NOMES_DE_CAMPO[bruto];

  const limpo = msg.replace(/^Value error, /, "");
  for (const [padrao, montar] of TRADUCOES) {
    const achou = limpo.match(padrao);
    if (achou) {
      const traduzido = montar(achou);
      return campo ? `${campo} ${traduzido}.` : `${traduzido}.`;
    }
  }

  return campo ? `${campo}: ${limpo}` : limpo;
}

function mensagemDoErro(dados: unknown, status: number): string {
  if (typeof dados === "object" && dados !== null) {
    const d = dados as Record<string, unknown>;

    // Erro nosso, vindo do route handler
    if (typeof d.erro === "string") return d.erro;

    // Erro do FastAPI: string simples...
    if (typeof d.detail === "string") return d.detail;

    // ...ou lista de problemas de validação, um por campo
    if (Array.isArray(d.detail)) {
      const problemas = d.detail
        .map((p) => p as Record<string, unknown>)
        .filter((p) => typeof p.msg === "string")
        .map((p) => descrever(Array.isArray(p.loc) ? p.loc : [], p.msg as string));

      // Mais de um campo errado: lista todos, senão você corrige um,
      // salva, e descobre o próximo — uma tentativa por vez.
      if (problemas.length) return problemas.join(" ");
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

