import { redirect } from "next/navigation";

import Sidebar from "@/components/sidebar";
import { IconSearch, IconUpload } from "@/components/icons";
import { usuarioLogado } from "@/lib/api";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Busca no servidor: o nome já chega pronto na primeira renderização,
  // sem piscar "carregando" e sem uma ida e volta extra do navegador.
  const usuario = await usuarioLogado();

  // Sem usuário, mas possivelmente COM um cookie de token válido —
  // é o caso de um usuário apagado ou desativado depois do login.
  // Mandar direto para "/" criaria laço, porque o proxy.ts veria o
  // token bom e devolveria para cá. Então passamos por uma rota que
  // apaga o cookie primeiro.
  if (!usuario) redirect("/api/auth/expirar");

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar usuario={usuario} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line px-6">
          <div className="relative mx-auto w-full max-w-110">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4.25 -translate-y-1/2 text-faint" />
            <input
              type="search"
              placeholder="Buscar no acervo"
              aria-label="Buscar no acervo"
              className="h-10 w-full rounded-[10px] border border-line bg-field pr-3.5 pl-10 text-[13.5px] text-cream placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-line-hover focus:border-iris focus:outline-none focus:ring-3 focus:ring-iris/15"
            />
          </div>

          {usuario.role !== "leitor" && (
            <button
              type="button"
              className="flex h-10 shrink-0 items-center gap-2 rounded-[10px] bg-linear-to-b from-iris to-iris-deep px-4 text-[13.5px] font-medium text-white transition-[filter,box-shadow] duration-150 hover:brightness-110 hover:shadow-[0_8px_22px_-10px_rgba(124,92,255,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-soft"
            >
              <IconUpload className="size-4.25" />
              <span className="max-sm:sr-only">Adicionar</span>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-7">
          <div className="mx-auto max-w-295">{children}</div>
        </main>
      </div>
    </div>
  );
}
