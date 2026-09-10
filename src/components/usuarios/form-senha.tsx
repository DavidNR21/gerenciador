"use client";

import { useState } from "react";

import { api, ErroApi } from "@/lib/cliente";
import Dialogo from "../ui/dialogo";
import {
  BotaoNeutro,
  BotaoPrimario,
  Campo,
  Erro,
  estiloCampo,
} from "../ui/campos";

/** Troca da própria senha. Exige a senha atual de propósito: sem isso,
 *  um computador destravado vira uma conta sequestrada. */
export default function FormSenha({ aoFechar }: { aoFechar: () => void }) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [repetir, setRepetir] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [pronto, setPronto] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (nova !== repetir) {
      setErro("As duas senhas novas não são iguais.");
      return;
    }
    if (nova.length < 10) {
      setErro("A senha nova precisa de pelo menos 10 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      await api.patch("/users/eu/senha", {
        senha_atual: atual,
        senha_nova: nova,
      });
      setPronto(true);
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível trocar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialogo titulo="Minha senha" aberto aoFechar={aoFechar} largura="max-w-sm">
      {pronto ? (
        <div className="flex flex-col gap-4">
          <p className="text-[13.5px] leading-relaxed text-cream">
            Senha trocada. As sessões já abertas continuam valendo até o token
            expirar.
          </p>
          <div className="flex justify-end">
            <BotaoPrimario type="button" onClick={aoFechar}>
              Fechar
            </BotaoPrimario>
          </div>
        </div>
      ) : (
        <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
          <Erro>{erro}</Erro>

          <Campo rotulo="Senha atual" id="atual">
            <input
              id="atual"
              type="password"
              value={atual}
              onChange={(e) => setAtual(e.target.value)}
              autoComplete="current-password"
              autoFocus
              className={estiloCampo}
            />
          </Campo>

          <Campo rotulo="Senha nova" id="nova" dica="Mínimo de 10 caracteres.">
            <input
              id="nova"
              type="password"
              value={nova}
              onChange={(e) => setNova(e.target.value)}
              autoComplete="new-password"
              className={estiloCampo}
            />
          </Campo>

          <Campo rotulo="Repetir a nova" id="repetir">
            <input
              id="repetir"
              type="password"
              value={repetir}
              onChange={(e) => setRepetir(e.target.value)}
              autoComplete="new-password"
              className={estiloCampo}
            />
          </Campo>

          <div className="mt-1 flex justify-end gap-2">
            <BotaoNeutro type="button" onClick={aoFechar}>
              Cancelar
            </BotaoNeutro>
            <BotaoPrimario type="submit" carregando={salvando}>
              Trocar
            </BotaoPrimario>
          </div>
        </form>
      )}
    </Dialogo>
  );
}
