"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Item } from "@/lib/tipos";
import { IconClose, IconDownload, IconLeft, IconRight } from "../icons";

/**
 * Player provisório: usa os controles nativos do navegador.
 *
 * Existe para você confirmar que os seus links tocam. Quando o player
 * próprio entrar, é só trocar o miolo — a moldura (título, navegação
 * entre episódios, tratamento de erro) continua valendo.
 */
export default function PlayerVideo({
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
  const video = useRef<HTMLVideoElement>(null);
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
      // Setas são do próprio player: mexem no tempo, não trocam de vídeo
      if (e.key === "Escape") aoFechar();
    };

    window.addEventListener("keydown", escutar);
    return () => window.removeEventListener("keydown", escutar);
  }, [indice, aoFechar]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink">
      <div className="flex h-14 shrink-0 items-center gap-3 px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-cream">
            {item.titulo}
          </p>
          <p className="text-[11.5px] text-faint">
            {indice! + 1} de {itens.length} · {item.extensao.toUpperCase()}
            {item.colecao_nome && ` · ${item.colecao_nome}`}
          </p>
        </div>

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir na origem"
            title="Abrir na origem"
            className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-cream"
          >
            <IconDownload className="size-[18px]" />
          </a>
        )}

        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-cream"
        >
          <IconClose className="size-[18px]" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        {/* O vídeo cresce até o espaço disponível, mas com teto: sem o
            max-w ele encostaria nas bordas em telas largas, e sem o
            h-full/w-full ficaria no tamanho original do arquivo, que
            costuma ser pequeno demais. Ajuste o max-w abaixo para
            mudar o tamanho fora da tela cheia.
            O self-stretch é necessário porque o items-center do
            contêiner impede a altura de resolver sozinha. */}
        {falhou ? (
          <div className="max-w-md text-center">
            <p className="text-[14px] text-cream">Não deu para tocar.</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-faint">
              São três causas possíveis: o link caiu, o host recusa acesso vindo
              de outro site, ou o vídeo está num formato que o navegador não
              toca — mkv e h265 são os casos mais comuns. Abrir o link direto
              separa qual dos três é.
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
          <div className="flex h-full w-full max-w-[850px] items-center justify-center self-stretch">
            <video
              ref={video}
              key={item.id}
              src={item.url ?? ""}
              controls
              autoPlay
              onError={() => setFalhou(true)}
              className="h-full w-full object-contain"
            />
          </div>
        )}
      </div>

      {itens.length > 1 && (
        <div className="flex h-14 shrink-0 items-center justify-center gap-3">
          <button
            type="button"
            onClick={anterior}
            disabled={indice === 0}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-muted transition-colors hover:text-cream disabled:opacity-40"
          >
            <IconLeft className="size-4" />
            Anterior
          </button>
          <button
            type="button"
            onClick={proximo}
            disabled={indice === itens.length - 1}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-muted transition-colors hover:text-cream disabled:opacity-40"
          >
            Próximo
            <IconRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
