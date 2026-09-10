import { redirect } from "next/navigation";

import Sidebar from "@/components/sidebar";
import BuscaTopo from "@/components/busca-topo";
import { usuarioLogado } from "@/lib/api";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Busca no servidor: o nome já chega pronto na primeira renderização,
  // sem piscar "carregando" e sem uma ida e volta extra do navegador.
  const usuario = await usuarioLogado();

  // Sem usuário, mas possivelmente COM um cookie de token válido — é o
  // caso de um usuário apagado ou desativado depois do login. Mandar
  // direto para "/" criaria laço, porque o proxy.ts veria o token bom e
  // devolveria para cá. Então passamos por uma rota que apaga o cookie.
  if (!usuario) redirect("/api/auth/expirar");

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar usuario={usuario} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-line px-6">
          {/* O botão "Adicionar" que ficava aqui foi removido: ele não
              fazia nada, e cada seção já tem o seu próprio, que sabe em
              que pasta você está. */}
          <BuscaTopo />
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-7">
          <div className="mx-auto max-w-295">{children}</div>
        </main>
      </div>
    </div>
  );
}
