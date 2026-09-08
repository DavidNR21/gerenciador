import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { API_URL } from "@/lib/api";
import { COOKIE } from "@/lib/sessao";

/**
 * Repassa qualquer chamada de /api/... para o FastAPI, anexando o token
 * que está guardado no cookie.
 *
 * É o que permite o navegador nunca falar com o Python direto: some o
 * CORS, some o problema de cookie entre domínios, e o endereço da API
 * nunca aparece no código que roda no navegador.
 *
 * As rotas /api/auth/login e /api/auth/logout têm arquivo próprio e
 * continuam valendo — no App Router a rota específica vence a coringa.
 */
async function repassar(
  req: NextRequest,
  ctx: { params: Promise<{ caminho: string[] }> },
) {
  const { caminho } = await ctx.params;
  const token = (await cookies()).get(COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const alvo = `${API_URL}/${caminho.join("/")}${req.nextUrl.search}`;
  const temCorpo = ["POST", "PATCH", "PUT"].includes(req.method);

  try {
    const r = await fetch(alvo, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: temCorpo ? await req.text() : undefined,
      cache: "no-store",
    });

    // 204 não tem corpo: mandar string vazia aqui quebra o navegador
    if (r.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const texto = await r.text();
    return new NextResponse(texto, {
      status: r.status,
      headers: {
        "Content-Type": r.headers.get("Content-Type") ?? "application/json",
        ...(r.headers.get("Content-Disposition")
          ? { "Content-Disposition": r.headers.get("Content-Disposition")! }
          : {}),
      },
    });
  } catch {
    return NextResponse.json(
      { erro: "Servidor indisponível. Tente de novo em instantes." },
      { status: 503 },
    );
  }
}

export {
  repassar as GET,
  repassar as POST,
  repassar as PATCH,
  repassar as PUT,
  repassar as DELETE,
};
