"use client";

import { useCallback, useEffect, useState } from "react";

import { api, ErroApi } from "@/lib/cliente";
import type { Usuario } from "@/lib/api";
import { IconPlus, IconSearch, IconUsers } from "../icons";
import { BotaoNeutro, BotaoPrimario, Erro, estiloCampo } from "../ui/campos";
import FormSenha from "./form-senha";
import FormUsuario from "./form-usuario";
import LinhaUsuario from "./linha-usuario";

export default function ListaUsuarios({ meuId }: { meuId: string }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [senhaAberta, setSenhaAberta] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const lista = await api.get<Usuario[]>(
        `/users${busca.trim() ? `?q=${encodeURIComponent(busca.trim())}` : ""}`,
      );
      setUsuarios(lista);
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível carregar.");
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  // Espera você parar de digitar antes de consultar. Sem isso, seria uma
  // chamada por tecla apertada.
  useEffect(() => {
    const t = setTimeout(carregar, 300);
    return () => clearTimeout(t);
  }, [carregar]);

  async function apagar(usuario: Usuario) {
    const texto =
      `Apagar ${usuario.nome} ${usuario.sobrenome}?\n\n` +
      "Os itens que a pessoa cadastrou continuam no acervo — só perdem a autoria.";
    if (!confirm(texto)) return;

    try {
      await api.delete(`/users/${usuario.id}`);
      carregar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível apagar.");
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[21px] font-semibold tracking-[-0.015em]">
            Usuários
          </h1>
          <p className="mt-1 text-[13px] text-muted">
            Quem pode entrar e o que cada um pode fazer.
          </p>
        </div>

        <div className="flex gap-2">
          <BotaoNeutro type="button" onClick={() => setSenhaAberta(true)}>
            Minha senha
          </BotaoNeutro>
          <BotaoPrimario
            type="button"
            onClick={() => {
              setEditando(null);
              setFormAberto(true);
            }}
          >
            <IconPlus className="size-[17px]" />
            Novo usuário
          </BotaoPrimario>
        </div>
      </div>

      <div className="relative mt-5 max-w-sm">
        <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-[16px] -translate-y-1/2 text-faint" />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, usuário ou e-mail"
          aria-label="Buscar usuários"
          className={`${estiloCampo} pl-10`}
        />
      </div>

      {erro && (
        <div className="mt-4">
          <Erro>{erro}</Erro>
        </div>
      )}

      {carregando ? (
        <div className="mt-6 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl border border-line bg-surface"
            />
          ))}
        </div>
      ) : usuarios.length === 0 ? (
        <div className="mt-16 text-center">
          <IconUsers className="mx-auto size-9 text-faint" />
          <p className="mt-3 text-[14px] text-cream">
            {busca ? "Nenhum usuário com esse termo." : "Nenhum usuário ainda."}
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-line bg-surface px-4">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] tracking-[0.15em] text-faint uppercase">
                <th className="py-3 pr-3 font-medium">Pessoa</th>
                <th className="py-3 pr-3 font-medium max-md:hidden">E-mail</th>
                <th className="py-3 pr-3 font-medium">Papel</th>
                <th className="py-3 pr-3 font-medium">Conta</th>
                <th className="py-3 pr-3 font-medium max-lg:hidden">
                  Último acesso
                </th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <LinhaUsuario
                  key={u.id}
                  usuario={u}
                  souEu={u.id === meuId}
                  aoEditar={() => {
                    setEditando(u);
                    setFormAberto(true);
                  }}
                  aoApagar={() => apagar(u)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Montados só quando abertos, para o formulário nunca vir sujo */}
      {formAberto && (
        <FormUsuario
          usuario={editando}
          aoFechar={() => setFormAberto(false)}
          aoSalvar={carregar}
        />
      )}

      {senhaAberta && <FormSenha aoFechar={() => setSenhaAberta(false)} />}
    </>
  );
}
