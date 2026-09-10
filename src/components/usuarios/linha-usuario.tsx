"use client";

import type { Usuario } from "@/lib/api";
import { IconPencil, IconTrash } from "../icons";

const PAPEL: Record<Usuario["role"], string> = {
  admin: "Administrador",
  editor: "Editor",
  leitor: "Leitor",
};

function quando(iso: string | null): string {
  if (!iso) return "nunca entrou";
  const data = new Date(iso);
  const dias = Math.floor((Date.now() - data.getTime()) / 86_400_000);
  if (dias === 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 30) return `há ${dias} dias`;
  return data.toLocaleDateString("pt-BR");
}

export default function LinhaUsuario({
  usuario,
  souEu,
  aoEditar,
  aoApagar,
}: {
  usuario: Usuario;
  souEu: boolean;
  aoEditar: () => void;
  aoApagar: () => void;
}) {
  const iniciais =
    `${usuario.nome[0] ?? ""}${usuario.sobrenome[0] ?? ""}`.toUpperCase();

  return (
    <tr className="group border-b border-line last:border-0">
      <td className="py-3 pr-3">
        <div className="flex items-center gap-3">
          <div
            className={`grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-medium ${
              usuario.ativo
                ? "bg-iris/15 text-iris-soft"
                : "bg-white/5 text-faint"
            }`}
          >
            {iniciais}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-cream">
              {usuario.nome} {usuario.sobrenome}
              {souEu && <span className="ml-2 text-[11.5px] text-faint">você</span>}
            </p>
            <p className="truncate text-[11.5px] text-faint">@{usuario.username}</p>
          </div>
        </div>
      </td>

      <td className="py-3 pr-3 text-[13px] text-muted max-md:hidden">
        <span className="block max-w-[220px] truncate">{usuario.email}</span>
      </td>

      <td className="py-3 pr-3 text-[13px] text-muted">{PAPEL[usuario.role]}</td>

      <td className="py-3 pr-3">
        <span
          className={`inline-flex items-center gap-1.5 text-[12.5px] ${
            usuario.ativo ? "text-muted" : "text-alert"
          }`}
        >
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${
              usuario.ativo ? "bg-iris-soft" : "bg-alert"
            }`}
          />
          {usuario.ativo ? "Ativa" : "Desativada"}
        </span>
      </td>

      <td className="py-3 pr-3 text-[12.5px] text-faint max-lg:hidden">
        {quando(usuario.ultimo_login_em)}
      </td>

      <td className="py-3">
        <div className="flex justify-end gap-0.5">
          <button
            type="button"
            onClick={aoEditar}
            aria-label={`Editar ${usuario.username}`}
            className="grid size-8 place-items-center rounded-lg text-faint transition-colors hover:bg-white/5 hover:text-cream"
          >
            <IconPencil className="size-[15px]" />
          </button>

          {/* A própria conta não tem botão de apagar: o back também recusa,
              mas mostrar um botão que sempre falha é só frustração. */}
          {!souEu && (
            <button
              type="button"
              onClick={aoApagar}
              aria-label={`Apagar ${usuario.username}`}
              className="grid size-8 place-items-center rounded-lg text-faint transition-colors hover:bg-white/5 hover:text-alert"
            >
              <IconTrash className="size-[15px]" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
