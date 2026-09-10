"use client";

import { useState } from "react";

import { api, ErroApi } from "@/lib/cliente";
import type { Usuario } from "@/lib/api";
import Dialogo from "../ui/dialogo";
import {
  BotaoNeutro,
  BotaoPrimario,
  Campo,
  Erro,
  estiloCampo,
} from "../ui/campos";

const PAPEIS = [
  { valor: "leitor", nome: "Leitor", texto: "Só visualiza o acervo." },
  { valor: "editor", nome: "Editor", texto: "Cria, edita e apaga itens." },
  { valor: "admin", nome: "Administrador", texto: "Também gerencia usuários." },
] as const;

export default function FormUsuario({
  usuario,
  aoFechar,
  aoSalvar,
}: {
  /** Preenchido = edição; vazio = criação */
  usuario?: Usuario | null;
  aoFechar: () => void;
  aoSalvar: () => void;
}) {
  const editando = Boolean(usuario);

  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [sobrenome, setSobrenome] = useState(usuario?.sobrenome ?? "");
  const [username, setUsername] = useState(usuario?.username ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<string>(usuario?.role ?? "leitor");
  const [ativo, setAtivo] = useState(usuario?.ativo ?? true);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const base = {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        role,
        ativo,
      };

      if (editando) {
        // Senha em branco significa "não mexer", e não "apagar"
        await api.patch(`/users/${usuario!.id}`, {
          ...base,
          ...(senha ? { senha } : {}),
        });
      } else {
        await api.post("/users", { ...base, senha });
      }

      aoSalvar();
      aoFechar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialogo
      titulo={editando ? "Editar usuário" : "Novo usuário"}
      aberto
      aoFechar={aoFechar}
    >
      <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
        <Erro>{erro}</Erro>

        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Nome" id="nome">
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
              className={estiloCampo}
            />
          </Campo>

          <Campo rotulo="Sobrenome" id="sobrenome">
            <input
              id="sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              className={estiloCampo}
            />
          </Campo>
        </div>

        <Campo
          rotulo="Usuário"
          id="username"
          dica="Letras, números, hífen e sublinhado. Serve para entrar."
        >
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="rafael"
            className={estiloCampo}
          />
        </Campo>

        <Campo rotulo="E-mail" id="email">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="pessoa@exemplo.com"
            className={estiloCampo}
          />
        </Campo>

        <Campo
          rotulo={editando ? "Nova senha" : "Senha"}
          id="senha"
          dica={
            editando
              ? "Deixe em branco para manter a senha atual."
              : "Mínimo de 10 caracteres."
          }
        >
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••••"
            autoComplete="new-password"
            className={estiloCampo}
          />
        </Campo>

        <Campo rotulo="Papel">
          <div className="flex flex-col gap-2">
            {PAPEIS.map((p) => (
              <label
                key={p.valor}
                className={`flex cursor-pointer items-start gap-3 rounded-[10px] border px-3 py-2.5 transition-colors ${
                  role === p.valor
                    ? "border-iris bg-iris/10"
                    : "border-line bg-field hover:border-line-hover"
                }`}
              >
                <input
                  type="radio"
                  name="papel"
                  checked={role === p.valor}
                  onChange={() => setRole(p.valor)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border ${
                    role === p.valor ? "border-iris" : "border-line-hover"
                  }`}
                >
                  {role === p.valor && (
                    <span className="size-2 rounded-full bg-iris" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] text-cream">{p.nome}</span>
                  <span className="block text-[11.5px] text-faint">{p.texto}</span>
                </span>
              </label>
            ))}
          </div>
        </Campo>

        <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-muted select-none">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="grid size-4 place-items-center rounded-[5px] border border-line-hover bg-field text-transparent transition-colors peer-checked:border-iris peer-checked:bg-iris peer-checked:text-white"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Conta ativa
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <BotaoNeutro type="button" onClick={aoFechar}>
            Cancelar
          </BotaoNeutro>
          <BotaoPrimario type="submit" carregando={salvando}>
            {editando ? "Salvar" : "Criar"}
          </BotaoPrimario>
        </div>
      </form>
    </Dialogo>
  );
}
