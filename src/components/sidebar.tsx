"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import type { Usuario } from "@/lib/api";
import {
  IconOverview,
  IconImage,
  IconVideo,
  IconDatabase,
  IconNote,
  IconUsers,
  IconLogout,
  Logo,
} from "./icons";

const itens = [
  { href: "/dashboard", nome: "Visão geral", Icone: IconOverview },
  { href: "/dashboard/fotos", nome: "Fotos", Icone: IconImage },
  { href: "/dashboard/videos", nome: "Vídeos", Icone: IconVideo },
  { href: "/dashboard/arquivos", nome: "Arquivos", Icone: IconDatabase },
  { href: "/dashboard/notas", nome: "Notas", Icone: IconNote },
  { href: "/dashboard/usuarios", nome: "Usuários", Icone: IconUsers, soAdmin: true },
];

const PAPEL: Record<Usuario["role"], string> = {
  admin: "Administrador",
  editor: "Editor",
  leitor: "Leitor",
};

export default function Sidebar({ usuario }: { usuario: Usuario }) {
  const router = useRouter();
  const caminho = usePathname();
  const [aberta, setAberta] = useState(true);
  const [saindo, setSaindo] = useState(false);

  const iniciais = `${usuario.nome[0] ?? ""}${usuario.sobrenome[0] ?? ""}`.toUpperCase();
  const visiveis = itens.filter((i) => !i.soAdmin || usuario.role === "admin");

  async function sair() {
    setSaindo(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  const usadoGb = 341;
  const totalGb = 500;
  const pct = Math.round((usadoGb / totalGb) * 100);

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 ease-out ${
        aberta ? "w-62.5" : "w-19"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -right-px h-40 w-px bg-linear-to-b from-iris-soft/45 to-transparent"
      />

      <div className={`flex h-16 items-center ${aberta ? "px-4" : "justify-center"}`}>
        <button
          type="button"
          onClick={() => setAberta((v) => !v)}
          aria-expanded={aberta}
          aria-label={aberta ? "Recolher menu" : "Expandir menu"}
          className="grid size-11 shrink-0 place-items-center rounded-[13px] transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-soft"
        >
          <Logo className="size-11" />
        </button>
        {aberta && (
          <span className="ml-3 truncate font-display text-[15px] font-semibold tracking-[-0.01em]">
            Gerenciador
          </span>
        )}
      </div>

      <nav className={`mt-3 flex flex-col gap-1 ${aberta ? "px-3" : "px-3.5"}`}>
        {visiveis.map(({ href, nome, Icone }) => {
          // "/dashboard" só ativa exato, senão fica aceso em todas as telas
          const selecionado =
            href === "/dashboard" ? caminho === href : caminho.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              title={!aberta ? nome : undefined}
              aria-current={selecionado ? "page" : undefined}
              className={`group relative flex h-10 items-center rounded-[10px] text-[13.5px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-soft ${
                aberta ? "gap-3 px-3" : "justify-center"
              } ${
                selecionado
                  ? "bg-iris/12 font-medium text-cream"
                  : "text-muted hover:bg-white/4 hover:text-cream"
              }`}
            >
              <Icone
                className={`size-4.75 shrink-0 ${
                  selecionado ? "text-iris-soft" : "text-faint group-hover:text-muted"
                }`}
              />
              {aberta && <span className="truncate">{nome}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        {aberta && (
          <div className="px-5 pb-5">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-mono text-[10px] tracking-[0.15em] text-faint uppercase">
                Espaço
              </span>
              <span className="text-[11.5px] text-muted">
                {usadoGb} de {totalGb} GB
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-field">
              <div
                className="h-full rounded-full bg-linear-to-r from-iris to-iris-soft"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <div
          className={`flex h-17 items-center border-t border-line ${
            aberta ? "gap-3 px-4" : "justify-center"
          }`}
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-iris/15 text-[13px] font-medium text-iris-soft">
            {iniciais}
          </div>
          {aberta && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-cream">
                  {usuario.nome} {usuario.sobrenome}
                </p>
                <p className="truncate text-[11.5px] text-faint">
                  {PAPEL[usuario.role]}
                </p>
              </div>
              <button
                type="button"
                onClick={sair}
                disabled={saindo}
                aria-label="Sair"
                title="Sair"
                className="grid size-8 shrink-0 place-items-center rounded-lg text-faint transition-colors duration-150 hover:bg-white/5 hover:text-alert disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-soft"
              >
                <IconLogout className="size-4.25" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
