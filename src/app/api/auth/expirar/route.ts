import { NextResponse, type NextRequest } from "next/server";

import { COOKIE } from "@/lib/sessao";

/**
 * Apaga o cookie e devolve para o login.
 *
 * Existe para quebrar um laço: o proxy.ts só confere a assinatura do
 * token, então um token válido de um usuário que não existe mais faz o
 * proxy mandar para o painel, o painel mandar de volta para o login, e
 * assim sem parar.
 *
 * O cookie só pode ser apagado num route handler — componente de
 * servidor não consegue mexer em cookie durante a renderização.
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete(COOKIE);
  return res;
}
