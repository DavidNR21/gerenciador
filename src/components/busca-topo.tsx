"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { IconSearch } from "./icons";

function Campo() {
  const router = useRouter();
  const parametros = useSearchParams();
  const [texto, setTexto] = useState("");

  // Ao chegar na página de resultados por link ou recarregando, o campo
  // precisa mostrar o que foi buscado — senão parece que sumiu.
  useEffect(() => {
    setTexto(parametros.get("q") ?? "");
  }, [parametros]);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const termo = texto.trim();
    if (!termo) return;
    router.push(`/dashboard/busca?q=${encodeURIComponent(termo)}`);
  }

  return (
    <form onSubmit={buscar} className="relative mx-auto w-full max-w-110">
      <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4.25 -translate-y-1/2 text-faint" />
      <input
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setTexto("")}
        placeholder="Buscar no acervo"
        aria-label="Buscar no acervo"
        className="h-10 w-full rounded-[10px] border border-line bg-field pr-3.5 pl-10 text-[13.5px] text-cream placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-line-hover focus:border-iris focus:outline-none focus:ring-3 focus:ring-iris/15"
      />
    </form>
  );
}

/**
 * O useSearchParams exige uma fronteira de Suspense — sem ela o Next
 * recusa renderizar a página no servidor. O campo estático abaixo é o
 * que aparece no instante antes de o navegador assumir.
 */
export default function BuscaTopo() {
  return (
    <Suspense
      fallback={
        <div className="relative mx-auto w-full max-w-110">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4.25 -translate-y-1/2 text-faint" />
          <div className="h-10 w-full rounded-[10px] border border-line bg-field" />
        </div>
      }
    >
      <Campo />
    </Suspense>
  );
}

