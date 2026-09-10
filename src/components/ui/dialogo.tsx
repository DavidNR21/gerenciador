"use client";

import { useEffect } from "react";

import { IconClose } from "../icons";

export default function Dialogo({
  titulo,
  aberto,
  aoFechar,
  children,
  largura = "max-w-lg",
}: {
  titulo: string;
  aberto: boolean;
  aoFechar: () => void;
  children: React.ReactNode;
  largura?: string;
}) {
  // Esc fecha. Sem isso, formulário em tela cheia vira armadilha.
  useEffect(() => {
    if (!aberto) return;
    const escutar = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", escutar);
    return () => window.removeEventListener("keydown", escutar);
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={aoFechar}
        className="absolute inset-0 bg-ink/80 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`relative max-h-[85dvh] w-full ${largura} overflow-y-auto rounded-2xl border border-line bg-surface`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-line bg-surface px-5 py-4">
          <h2 className="text-[15px] font-semibold">{titulo}</h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="grid size-8 place-items-center rounded-lg text-faint transition-colors hover:bg-white/5 hover:text-cream"
          >
            <IconClose className="size-4" />
          </button>
        </div>

        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
