import Link from "next/link";

import { buscarNoServidor } from "@/lib/api";
import type { Colecao, Item, Pagina } from "@/lib/tipos";
import {
  IconDatabase,
  IconFolder,
  IconImage,
  IconNote,
  IconSearch,
  IconVideo,
} from "@/components/icons";

const ICONE = {
  imagem: IconImage,
  video: IconVideo,
  arquivo: IconDatabase,
  nota: IconNote,
} as const;

const ROTA = {
  imagem: "/dashboard/fotos",
  video: "/dashboard/videos",
  arquivo: "/dashboard/arquivos",
  nota: "/dashboard/notas",
} as const;

const NOME_DO_TIPO = {
  imagem: "Foto",
  video: "Vídeo",
  arquivo: "Arquivo",
  nota: "Nota",
} as const;

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const termo = (q ?? "").trim();

  if (!termo) {
    return (
      <div className="mt-16 text-center">
        <IconSearch className="mx-auto size-9 text-faint" />
        <p className="mt-3 text-[14px] text-cream">Digite algo para buscar.</p>
      </div>
    );
  }

  const busca = encodeURIComponent(termo);

  // As duas buscas em paralelo: uma espera pela outra seria o dobro do tempo
  const [itens, pastas] = await Promise.all([
    buscarNoServidor<Pagina<Item>>(`/itens?q=${busca}&por_pagina=50`),
    buscarNoServidor<Colecao[]>(`/colecoes?q=${busca}`),
  ]);

  if (!itens || !pastas) {
    return (
      <>
        <h1 className="text-[21px] font-semibold tracking-[-0.015em]">Busca</h1>
        <p className="mt-4 rounded-[10px] border border-alert/30 bg-alert/[0.07] px-3 py-2.5 text-[13px] text-alert">
          Não foi possível falar com o servidor.
        </p>
      </>
    );
  }

  const total = itens.total + pastas.length;

  return (
    <>
      <h1 className="text-[21px] font-semibold tracking-[-0.015em]">
        Busca por “{termo}”
      </h1>
      <p className="mt-1 text-[13.5px] text-muted">
        {total === 0
          ? "Nada encontrado."
          : `${total} ${total === 1 ? "resultado" : "resultados"}.`}
      </p>

      {total === 0 && (
        <p className="mt-6 max-w-md text-[13px] leading-relaxed text-faint">
          A busca olha o título dos itens e o nome das pastas. Tags e descrição
          ainda não entram.
        </p>
      )}

      {pastas.length > 0 && (
        <>
          <h2 className="mt-8 text-[15px] font-medium">
            Pastas ({pastas.length})
          </h2>
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-3">
            {pastas.map((p) => {
              // A pasta guarda o tipo de conteúdo, e é ele que decide em
              // qual seção ela deve ser aberta
              const rota = p.tipo ? ROTA[p.tipo] : "/dashboard/fotos";
              return (
                <Link
                  key={p.id}
                  href={`${rota}?pasta=${p.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3.5 transition-colors hover:border-line-hover"
                >
                  <IconFolder className="size-6 shrink-0 text-iris-soft" />
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium text-cream">
                      {p.nome}
                    </p>
                    <p className="text-[11.5px] text-faint">
                      {p.total_itens} {p.total_itens === 1 ? "item" : "itens"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {itens.itens.length > 0 && (
        <>
          <h2 className="mt-8 text-[15px] font-medium">
            Itens ({itens.total})
          </h2>
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-3">
            {itens.itens.map((item) => {
              const Icone = ICONE[item.tipo];
              return (
                <Link
                  key={item.id}
                  href={
                    item.colecao_id
                      ? `${ROTA[item.tipo]}?pasta=${item.colecao_id}`
                      : ROTA[item.tipo]
                  }
                  className="group rounded-xl border border-line bg-surface px-3.5 py-3.5 transition-colors hover:border-line-hover"
                >
                  <div className="flex items-center gap-2">
                    <Icone className="size-5 text-faint transition-colors group-hover:text-iris-soft" />
                    <span className="font-mono text-[9.5px] tracking-[0.12em] text-faint uppercase">
                      {NOME_DO_TIPO[item.tipo]}
                    </span>
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-[13.5px] font-medium text-cream">
                    {item.titulo}
                  </p>
                  {item.colecao_nome && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-faint">
                      <IconFolder className="size-3 shrink-0" />
                      <span className="truncate">{item.colecao_nome}</span>
                    </p>
                  )}
                </Link>
              );
            })}
          </div>

          {itens.total > itens.itens.length && (
            <p className="mt-5 text-[12.5px] text-faint">
              Mostrando os {itens.itens.length} primeiros de {itens.total}.
              Use um termo mais específico para reduzir.
            </p>
          )}
        </>
      )}
    </>
  );
}
