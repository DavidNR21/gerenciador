"use client";

import { useEffect, useState } from "react";

import { api, ErroApi } from "@/lib/cliente";
import type { Item, TipoItem } from "@/lib/tipos";
import Dialogo from "./dialogo";
import {
  BotaoNeutro,
  BotaoPrimario,
  Campo,
  Erro,
  estiloCampo,
} from "./campos";

type Props = {
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: () => void;
  tipo: TipoItem;
  pastaId: string | null;
  /** Preenchido = edição; vazio = criação */
  item?: Item | null;
};

export default function FormItem({
  aberto,
  aoFechar,
  aoSalvar,
  tipo,
  pastaId,
  item,
}: Props) {
  const editando = Boolean(item);

  const [aba, setAba] = useState<"um" | "varios">("um");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Um link
  const [titulo, setTitulo] = useState(item?.titulo ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [descricao, setDescricao] = useState(item?.descricao ?? "");
  const [tags, setTags] = useState(item?.tags.join(", ") ?? "");
  const [favorito, setFavorito] = useState(item?.favorito ?? false);

  // Em MB porque ninguém digita byte na mão. Convertido na hora de enviar.
  const [tamanhoMb, setTamanhoMb] = useState(
    item?.tamanho_bytes ? String(+(item.tamanho_bytes / 1024 / 1024).toFixed(1)) : "",
  );

  // Nota tem duas naturezas: texto escrito aqui ou link para um arquivo
  const [modoNota, setModoNota] = useState<"escrever" | "link">(
    editando ? (item!.tem_texto ? "escrever" : "link") : "escrever",
  );
  const [texto, setTexto] = useState("");
  const [carregandoTexto, setCarregandoTexto] = useState(false);

  // O texto não vem na listagem — seria pesado demais numa grade.
  // Ao editar uma nota escrita, buscamos o conteúdo agora.
  useEffect(() => {
    if (!editando || !item?.tem_texto) return;
    setCarregandoTexto(true);
    api
      .get<{ texto: string }>(`/itens/${item.id}/conteudo`)
      .then((c) => setTexto(c.texto))
      .catch(() => setErro("Não foi possível carregar o texto desta nota."))
      .finally(() => setCarregandoTexto(false));
  }, [editando, item]);

  // Vários links
  const [links, setLinks] = useState("");
  const [tituloBase, setTituloBase] = useState("");
  const [ordemInicial, setOrdemInicial] = useState("1");

  function listaDeTags(bruto: string) {
    return bruto
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      if (aba === "um" || editando) {
        const ehNotaEscrita = tipo === "nota" && modoNota === "escrever";

        if (ehNotaEscrita && !texto.trim()) {
          throw new ErroApi("Escreva alguma coisa ou mude para link.", 0);
        }

        const corpo = {
          tipo,
          titulo: titulo.trim(),
          // Uma nota é uma coisa OU outra. Mandar os dois deixaria dados
          // órfãos que nunca mais seriam lidos.
          url: ehNotaEscrita ? null : url.trim(),
          texto: ehNotaEscrita ? texto : null,
          descricao: descricao.trim() || null,
          tags: listaDeTags(tags),
          favorito,
          tamanho_bytes: tamanhoMb
            ? Math.round(Number(tamanhoMb) * 1024 * 1024)
            : null,
          ...(editando ? {} : { colecao_id: pastaId }),
        };

        if (editando) await api.patch(`/itens/${item!.id}`, corpo);
        else await api.post("/itens", corpo);
      } else {
        const urls = links
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        if (urls.length === 0) throw new ErroApi("Cole ao menos um link.", 0);
        if (urls.length > 50)
          throw new ErroApi("No máximo 50 links por vez.", 0);

        await api.post("/itens/lote", {
          tipo,
          urls,
          colecao_id: pastaId,
          titulo_base: tituloBase.trim() || null,
          ordem_inicial: ordemInicial ? Number(ordemInicial) : null,
          tags: listaDeTags(tags),
        });
      }

      aoSalvar();
      aoFechar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  const abaAtiva =
    "border-iris text-cream";
  const abaInativa =
    "border-transparent text-muted hover:text-cream";

  return (
    <Dialogo
      titulo={editando ? "Editar item" : "Adicionar"}
      aberto={aberto}
      aoFechar={aoFechar}
    >
      {!editando && (
        <div className="mb-5 flex gap-1 border-b border-line">
          <button
            type="button"
            onClick={() => setAba("um")}
            className={`-mb-px border-b-2 px-3 pb-2.5 text-[13.5px] transition-colors ${
              aba === "um" ? abaAtiva : abaInativa
            }`}
          >
            Um link
          </button>
          <button
            type="button"
            onClick={() => setAba("varios")}
            className={`-mb-px border-b-2 px-3 pb-2.5 text-[13.5px] transition-colors ${
              aba === "varios" ? abaAtiva : abaInativa
            }`}
          >
            Vários links
          </button>
        </div>
      )}

      <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
        <Erro>{erro}</Erro>

        {aba === "um" || editando ? (
          <>
            <Campo rotulo="Título" id="titulo">
              <input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Nome que aparece no card"
                className={estiloCampo}
              />
            </Campo>

            {tipo === "nota" && (
              <div className="flex gap-2">
                {(["escrever", "link"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModoNota(m)}
                    className={`h-8 rounded-lg border px-3 text-[12.5px] transition-colors ${
                      modoNota === m
                        ? "border-iris bg-iris/12 text-cream"
                        : "border-line bg-field text-muted hover:text-cream"
                    }`}
                  >
                    {m === "escrever" ? "Escrever texto" : "Link para arquivo"}
                  </button>
                ))}
              </div>
            )}

            {tipo === "nota" && modoNota === "escrever" ? (
              <Campo
                rotulo="Texto"
                id="texto"
                dica="Fica guardado aqui dentro. Dá para baixar como .txt depois."
              >
                <textarea
                  id="texto"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  disabled={carregandoTexto}
                  rows={12}
                  placeholder={carregandoTexto ? "Carregando…" : "Escreva aqui…"}
                  className={`${estiloCampo} h-auto py-2.5 font-mono text-[12.5px] leading-relaxed`}
                />
              </Campo>
            ) : (
              <Campo
                rotulo="Link"
                id="url"
                dica="Link direto para o arquivo. Precisa começar com https."
              >
                <input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                  className={estiloCampo}
                />
              </Campo>
            )}

            {tipo === "arquivo" && (
              <Campo
                rotulo="Tamanho em MB"
                id="tamanho"
                dica="Opcional. Aparece no card, para você saber o peso antes de baixar."
              >
                <input
                  id="tamanho"
                  type="number"
                  min={0}
                  step="0.1"
                  value={tamanhoMb}
                  onChange={(e) => setTamanhoMb(e.target.value)}
                  placeholder="82.5"
                  className={estiloCampo}
                />
              </Campo>
            )}

            <Campo rotulo="Descrição" id="descricao">
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
                className={`${estiloCampo} h-auto py-2 leading-relaxed`}
              />
            </Campo>
          </>
        ) : (
          <>
            <Campo
              rotulo="Links"
              id="links"
              dica="Um por linha, até 50. Se algum estiver errado, nenhum é salvo."
            >
              <textarea
                id="links"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                rows={7}
                placeholder={"https://exemplo.com/1.jpg\nhttps://exemplo.com/2.jpg"}
                className={`${estiloCampo} h-auto py-2 font-mono text-[12.5px] leading-relaxed`}
              />
            </Campo>

            <div className="grid grid-cols-[1fr_110px] gap-3">
              <Campo
                rotulo="Título base"
                id="base"
                dica="Vazio: usa o nome do arquivo."
              >
                <input
                  id="base"
                  value={tituloBase}
                  onChange={(e) => setTituloBase(e.target.value)}
                  placeholder="Personagem"
                  className={estiloCampo}
                />
              </Campo>

              <Campo rotulo="Ordem" id="ordem" dica="Numera daqui.">
                <input
                  id="ordem"
                  type="number"
                  min={0}
                  value={ordemInicial}
                  onChange={(e) => setOrdemInicial(e.target.value)}
                  className={estiloCampo}
                />
              </Campo>
            </div>
          </>
        )}

        <Campo rotulo="Tags" id="tags" dica="Separadas por vírgula.">
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="referencia, personagem"
            className={estiloCampo}
          />
        </Campo>

        {(aba === "um" || editando) && (
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-muted select-none">
            <input
              type="checkbox"
              checked={favorito}
              onChange={(e) => setFavorito(e.target.checked)}
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
            Marcar como favorito
          </label>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <BotaoNeutro type="button" onClick={aoFechar}>
            Cancelar
          </BotaoNeutro>
          <BotaoPrimario type="submit" carregando={salvando}>
            {editando ? "Salvar" : "Adicionar"}
          </BotaoPrimario>
        </div>
      </form>
    </Dialogo>
  );
}

