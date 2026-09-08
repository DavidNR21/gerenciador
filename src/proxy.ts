import { NextResponse, type NextRequest } from "next/server";
import { lerSessao, COOKIE } from "@/lib/sessao";

/**
 * Roda antes da página renderizar. Serve só para a navegação não ficar
 * estranha — não é a segurança do sistema.
 *
 * A segurança de verdade está no FastAPI, que exige o cabeçalho
 * Authorization em toda rota protegida. Mesmo que alguém force a entrada
 * em /dashboard, a tela abre vazia porque a API recusa os dados.
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessao = await lerSessao(req.cookies.get(COOKIE)?.value);

  // Sem sessão dentro do painel: volta para o login
  if (pathname.startsWith("/dashboard") && !sessao) {
    const url = new URL("/", req.url);
    url.searchParams.set("de", pathname); // para voltar aqui depois de entrar
    return NextResponse.redirect(url);
  }

  // Já logado tentando ver a tela de login: manda direto para o painel
  if (pathname === "/" && sessao) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
