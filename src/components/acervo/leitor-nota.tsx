"use client";

import { useEffect, useState } from "react";

import { api, ErroApi } from "@/lib/cliente";
import type { Item } from "@/lib/tipos";
import Dialogo from "../ui/dialogo";
import { Erro } from "../ui/campos";
import { IconDownload } from "../icons";

type Conteudo = {
  texto: string;
  bytes: number;
  truncado: boolean;
  origem: "banco" | "link";
};

export default function LeitorNota({
  item,
  aoFechar,
}: {
  item: Item | null;
  aoFechar: () => void;
}) {
  const [conteudo, setConteudo] = useState<Conteudo | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!item) return;

    let cancelado = false;
    setCarregando(true);
    setErro("");
    setConteudo(null);

    api
      .get<Conteudo>(`/itens/${item.id}/conteudo`)
      .then((c) => !cancelado && setConteudo(c))
      .catch((e) => {
        if (cancelado) return;
        setErro(e instanceof ErroApi ? e.message : "Não foi possível ler.");
      })
      .finally(() => !cancelado && setCarregando(false));

    // Se você fechar antes da resposta chegar, o resultado é descartado
    return () => {
      cancelado = true;
    };
  }, [item]);

  if (!item) return null;

  return (
    <Dialogo titulo={item.titulo} aberto aoFechar={aoFechar} largura="max-w-3xl">
      {carregando && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3.5 animate-pulse rounded bg-field" />
          ))}
        </div>
      )}

      {erro && (
        <>
          <Erro>{erro}</Erro>
          {item.url && (
            <p className="mt-3 text-[12.5px] leading-relaxed text-faint">
              Esta nota é um link. Se o host não permitir a leitura, ainda dá
              para{" "}
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-iris-soft hover:underline"
              >
                abrir direto em outra aba
              </a>
              .
            </p>
          )}
        </>
      )}

      {conteudo && (
        <>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] tracking-[0.15em] text-faint uppercase">
              {conteudo.origem === "banco" ? "Escrita aqui" : "Lida do link"}
              {" · "}
              {conteudo.bytes.toLocaleString("pt-BR")} bytes
            </p>

            <a
              href={
                item.tem_texto ? `/api/itens/${item.id}/download` : item.url ?? "#"
              }
              download
              target={item.tem_texto ? undefined : "_blank"}
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12.5px] text-muted transition-colors hover:bg-white/5 hover:text-cream"
            >
              <IconDownload className="size-[15px]" />
              Baixar
            </a>
          </div>

          {conteudo.truncado && (
            <p className="mb-3 rounded-[10px] border border-line bg-field px-3 py-2 text-[12.5px] text-muted">
              Texto muito longo: mostrando só o começo. Baixe para ver inteiro.
            </p>
          )}

          <pre className="max-h-[55dvh] overflow-auto rounded-[10px] border border-line bg-field p-4 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-cream">
            {conteudo.texto}
          </pre>
        </>
      )}
    </Dialogo>
  );
}
