import Link from "next/link";

import { buscarNoServidor } from "@/lib/api";
import type { Resumo } from "@/lib/tipos";
import {
  IconDatabase,
  IconFolder,
  IconImage,
  IconNote,
  IconVideo,
} from "@/components/icons";

const SECOES = [
  { chave: "imagens", nome: "Fotos", rota: "/dashboard/fotos", Icone: IconImage },
  { chave: "videos", nome: "Vídeos", rota: "/dashboard/videos", Icone: IconVideo },
  { chave: "arquivos", nome: "Arquivos", rota: "/dashboard/arquivos", Icone: IconDatabase },
  { chave: "notas", nome: "Notas", rota: "/dashboard/notas", Icone: IconNote },
] as const;

const ICONE_POR_TIPO = {
  imagem: IconImage,
  video: IconVideo,
  arquivo: IconDatabase,
  nota: IconNote,
} as const;

const ROTA_POR_TIPO = {
  imagem: "/dashboard/fotos",
  video: "/dashboard/videos",
  arquivo: "/dashboard/arquivos",
  nota: "/dashboard/notas",
} as const;

function quando(iso: string): string {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (dias === 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 30) return `há ${dias} dias`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default async function VisaoGeral() {
  const resumo = await buscarNoServidor<Resumo>("/resumo");

  if (!resumo) {
    return (
      <>
        <h1 className="text-[21px] font-semibold tracking-[-0.015em]">
          Visão geral
        </h1>
        <p className="mt-4 rounded-[10px] border border-alert/30 bg-alert/[0.07] px-3 py-2.5 text-[13px] text-alert">
          Não foi possível falar com o servidor. Verifique se a API está no ar.
        </p>
      </>
    );
  }

  const total =
    resumo.imagens + resumo.videos + resumo.arquivos + resumo.notas;

  return (
    <>
      <h1 className="text-[21px] font-semibold tracking-[-0.015em]">
        Visão geral
      </h1>
      <p className="mt-1 text-[13.5px] text-muted">
        {total === 0
          ? "Seu acervo está vazio. Comece por qualquer seção."
          : `${total} ${total === 1 ? "item" : "itens"} em ${resumo.pastas} ${
              resumo.pastas === 1 ? "pasta" : "pastas"
            }.`}
      </p>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        {SECOES.map(({ chave, nome, rota, Icone }) => (
          <Link
            key={chave}
            href={rota}
            className="group rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-line-hover"
          >
            <div className="flex items-center gap-2 text-faint transition-colors group-hover:text-iris-soft">
              <Icone className="size-4" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase">
                {nome}
              </span>
            </div>
            <p className="mt-2 text-[26px] leading-none font-semibold tracking-[-0.02em]">
              {resumo[chave].toLocaleString("pt-BR")}
            </p>
          </Link>
        ))}
      </div>

      {resumo.links_mortos > 0 && (
        <p className="mt-4 rounded-[10px] border border-alert/30 bg-alert/[0.07] px-3 py-2.5 text-[13px] text-alert">
          {resumo.links_mortos}{" "}
          {resumo.links_mortos === 1
            ? "link não respondeu na última verificação."
            : "links não responderam na última verificação."}
        </p>
      )}

      {resumo.recentes.length > 0 && (
        <>
          <h2 className="mt-9 text-[15px] font-medium">
            Adicionados recentemente
          </h2>

          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-3">
            {resumo.recentes.map((item) => {
              const Icone = ICONE_POR_TIPO[item.tipo];
              const rota = ROTA_POR_TIPO[item.tipo];

              return (
                <Link
                  key={item.id}
                  // Leva para a seção certa, já dentro da pasta do item
                  href={
                    item.colecao_id ? `${rota}?pasta=${item.colecao_id}` : rota
                  }
                  className="group rounded-xl border border-line bg-surface px-3.5 py-3.5 transition-colors hover:border-line-hover"
                >
                  <Icone className="size-5 text-faint transition-colors group-hover:text-iris-soft" />
                  <p className="mt-2.5 line-clamp-2 text-[13.5px] font-medium text-cream">
                    {item.titulo}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-faint">
                    {item.colecao_nome && (
                      <>
                        <IconFolder className="size-3 shrink-0" />
                        <span className="truncate">{item.colecao_nome}</span>
                        <span>·</span>
                      </>
                    )}
                    <span className="shrink-0">{quando(item.criado_em)}</span>
                  </p>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
