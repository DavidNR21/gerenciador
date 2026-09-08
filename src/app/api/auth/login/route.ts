import { NextResponse } from "next/server";

import { api, ApiForaDoAr } from "@/lib/api";
import { COOKIE } from "@/lib/sessao";

export async function POST(req: Request) {
  let corpo: { identificador?: string; senha?: string; lembrar?: boolean };

  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  let resposta: Response;
  try {
    resposta = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identificador: corpo.identificador ?? "",
        senha: corpo.senha ?? "",
        lembrar: corpo.lembrar ?? false,
      }),
    });
  } catch (e) {
    if (e instanceof ApiForaDoAr) {
      return NextResponse.json(
        { erro: "Servidor indisponível. Tente de novo em instantes." },
        { status: 503 },
      );
    }
    throw e;
  }

  const dados = await resposta.json();

  if (!resposta.ok) {
    // O FastAPI devolve o erro no campo "detail"
    return NextResponse.json(
      { erro: dados.detail ?? "Não foi possível entrar." },
      { status: resposta.status },
    );
  }

  const res = NextResponse.json({ usuario: dados.usuario });

  res.cookies.set(COOKIE, dados.access_token, {
    httpOnly: true, // o JavaScript da página não enxerga o cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Sem maxAge o cookie morre quando o navegador fecha
    ...(corpo.lembrar ? { maxAge: dados.expira_em_dias * 24 * 60 * 60 } : {}),
  });

  return res;
}
