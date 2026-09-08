"use client";

import { useCallback, useEffect, useState } from "react";

import type { Item } from "../../lib/tipos";
import { IconClose, IconDownload, IconLeft, IconRight } from "../icons";

export default function Visualizador({
  itens,
  indice,
  aoMudar,
  aoFechar,
}: {
  itens: Item[];
  indice: number | null;
  aoMudar: (i: number) => void;
  aoFechar: () => void;
}) {
  const [falhou, setFalhou] = useState(false);
  const item = indice === null ? null : itens[indice];

  const anterior = useCallback(() => {
    if (indice !== null && indice > 0) aoMudar(indice - 1);
  }, [indice, aoMudar]);

  const proximo = useCallback(() => {
    if (indice !== null && indice < itens.length - 1) aoMudar(indice + 1);
  }, [indice, itens.length, aoMudar]);

  useEffect(() => setFalhou(false), [indice]);

  useEffect(() => {
    if (indice === null) return;
    const escutar = (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") proximo();
    };
    window.addEventListener("keydown", escutar);
    return () => window.removeEventListener("keydown", escutar);
  }, [indice, aoFechar, anterior, proximo]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink/95">
      <div className="flex h-14 shrink-0 items-center gap-3 px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-cream">
            {item.titulo}
          </p>
          <p className="text-[11.5px] text-faint">
            {indice! + 1} de {itens.length} · {item.extensao.toUpperCase()}
          </p>
        </div>

        {item.url && (
          <a
            href={item.url}
            download
            target="_blank"
            rel="noreferrer"
            aria-label="Baixar"
            title="Baixar"
            className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-cream"
          >
            <IconDownload className="size-4.5" />
          </a>
        )}

        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-cream"
        >
          <IconClose className="size-4.5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-6">
        {falhou ? (
          <div className="max-w-md text-center">
            <p className="text-[14px] text-cream">Não deu para carregar.</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-faint">
              O link pode ter caído, ou o host pode estar recusando o acesso
              vindo de outro site. Tente abrir o link direto no navegador para
              descobrir qual dos dois é.
            </p>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-[12.5px] text-iris-soft hover:underline"
              >
                Abrir o link em outra aba
              </a>
            )}
          </div>
        ) : (
          // Imagem crua de propósito: o next/image otimizaria pelo servidor,
          // e a ideia aqui é o navegador buscar direto no host de origem.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url ?? ""}
            alt={item.titulo}
            onError={() => setFalhou(true)}
            className="max-h-full max-w-full object-contain"
          />
        )}

        {indice! > 0 && (
          <button
            type="button"
            onClick={anterior}
            aria-label="Anterior"
            className="absolute left-2 grid size-11 place-items-center rounded-full border border-line bg-surface/80 text-muted transition-colors hover:text-cream"
          >
            <IconLeft className="size-5" />
          </button>
        )}

        {indice! < itens.length - 1 && (
          <button
            type="button"
            onClick={proximo}
            aria-label="Próxima"
            className="absolute right-2 grid size-11 place-items-center rounded-full border border-line bg-surface/80 text-muted transition-colors hover:text-cream"
          >
            <IconRight className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
