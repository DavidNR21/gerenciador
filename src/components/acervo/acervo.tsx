"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api, ErroApi } from "@/lib/cliente";
import type { Colecao, Item, Pagina, TipoItem } from "@/lib/tipos";
import {
  IconDatabase,
  IconDownload,
  IconFolder,
  IconFolderPlus,
  IconImage,
  IconLeft,
  IconNote,
  IconPencil,
  IconPlus,
  IconRight,
  IconStar,
  IconTrash,
  IconVideo,
} from "../icons";
import Dialogo from "../ui/dialogo";
import FormItem from "./form-item";
import LeitorNota from "./leitor-nota";
import PlayerVideo from "./player-video";
import Visualizador from "./visualizador";
import { BotaoNeutro, BotaoPrimario, Campo, Erro, estiloCampo } from "../ui/campos";

const POR_PAGINA = 24;

function formatarDuracao(segundos: number): string {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  if (h > 0) return `${h}h${String(m).padStart(2, "0")}`;
  return `${m} min`;
}

function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const unidades = ["KB", "MB", "GB", "TB"];
  let valor = bytes / 1024;
  let i = 0;
  while (valor >= 1024 && i < unidades.length - 1) {
    valor /= 1024;
    i++;
  }
  return `${valor < 10 ? valor.toFixed(1) : Math.round(valor)} ${unidades[i]}`;
}

// O ícone é escolhido aqui pelo tipo, e não recebido de fora: a página
// que usa este componente roda no servidor, e componente de servidor não
// consegue passar função para componente de cliente.
const ICONES = {
  imagem: IconImage,
  video: IconVideo,
  arquivo: IconDatabase,
  nota: IconNote,
} as const;

type Props = {
  tipo: TipoItem;
  titulo: string;
  rota: string; // ex: "/dashboard/fotos"
  pastaId: string | null;
};

export default function Acervo({ tipo, titulo, rota, pastaId }: Props) {
  const router = useRouter();
  const IconeItem = ICONES[tipo];

  const [pastas, setPastas] = useState<Colecao[]>([]);
  const [itens, setItens] = useState<Item[]>([]);
  const [atual, setAtual] = useState<Colecao | null>(null);
  const [total, setTotal] = useState(0);
  const [paginas, setPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Item | null>(null);
  const [pastaAberta, setPastaAberta] = useState(false);
  const [nomePasta, setNomePasta] = useState("");

  function fecharPasta() {
    setPastaAberta(false);
    setNomePasta(""); // some o que foi digitado, mesmo ao cancelar
  }
  const [salvandoPasta, setSalvandoPasta] = useState(false);
  const [visualizando, setVisualizando] = useState<number | null>(null);
  const [lendo, setLendo] = useState<Item | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const busca = new URLSearchParams({
        tipo,
        pagina: String(pagina),
        por_pagina: String(POR_PAGINA),
        ordenar: "recentes",
      });
      if (pastaId) busca.set("colecao_id", pastaId);
      // Na raiz, só os itens que não estão em pasta nenhuma. Sem isto,
      // um item guardado numa pasta apareceria também aqui fora.
      else busca.set("raiz", "true");

      const [listaPastas, listaItens, pasta] = await Promise.all([
        // O tipo é essencial: sem ele, uma pasta criada em Fotos
        // apareceria também em Vídeos, Arquivos e Notas.
        api.get<Colecao[]>(
          `/colecoes?tipo=${tipo}${pastaId ? `&pai_id=${pastaId}` : ""}`,
        ),
        api.get<Pagina<Item>>(`/itens?${busca}`),
        pastaId ? api.get<Colecao>(`/colecoes/${pastaId}`) : Promise.resolve(null),
      ]);

      setPastas(listaPastas);
      setItens(listaItens.itens);
      setTotal(listaItens.total);
      setPaginas(listaItens.paginas);
      setAtual(pasta);
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível carregar.");
    } finally {
      setCarregando(false);
    }
  }, [tipo, pastaId, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Trocar de pasta volta para a primeira página, senão você cai na
  // página 3 de uma pasta que só tem uma.
  useEffect(() => setPagina(1), [pastaId]);

  function irPara(id: string | null) {
    router.push(id ? `${rota}?pasta=${id}` : rota);
  }

  async function criarPasta(e: React.FormEvent) {
    e.preventDefault();
    if (!nomePasta.trim()) return;

    setSalvandoPasta(true);
    try {
      await api.post("/colecoes", {
        nome: nomePasta.trim(),
        tipo,
        pai_id: pastaId,
      });
      fecharPasta();
      carregar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível criar.");
    } finally {
      setSalvandoPasta(false);
    }
  }

  async function apagarItem(item: Item) {
    if (!confirm(`Apagar "${item.titulo}"? Isso não pode ser desfeito.`)) return;
    try {
      await api.delete(`/itens/${item.id}`);
      carregar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível apagar.");
    }
  }

  async function apagarPasta(pasta: Colecao) {
    const dentro = pasta.total_itens + pasta.total_subpastas;
    const aviso =
      dentro > 0
        ? `Apagar a pasta "${pasta.nome}"? O que está dentro não some — sobe um nível.`
        : `Apagar a pasta "${pasta.nome}"?`;
    if (!confirm(aviso)) return;

    try {
      await api.delete(`/colecoes/${pasta.id}`);
      carregar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : "Não foi possível apagar.");
    }
  }

  /** O que acontece ao clicar num card, conforme o tipo do acervo. */
  function abrirItem(item: Item, indice: number) {
    if (tipo === "imagem") {
      setVisualizando(indice);
      return;
    }
    if (tipo === "nota") {
      setLendo(item);
      return;
    }
    if (tipo === "video") {
      setVisualizando(indice);
      return;
    }
    // Arquivo abre em outra aba. Se o host mandar cabeçalho de download,
    // o navegador baixa; senão, exibe. Quem decide é o host, não nós.
    if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
  }

  const vazio = !carregando && pastas.length === 0 && itens.length === 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[21px] font-semibold tracking-[-0.015em]">
            {titulo}
          </h1>

          {/* Trilha de pastas */}
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[13px] text-muted">
            <button
              type="button"
              onClick={() => irPara(null)}
              className="transition-colors hover:text-cream"
            >
              Início
            </button>
            {atual?.caminho.map((m, i) => (
              <span key={m.id} className="flex items-center gap-1">
                <span className="text-faint">/</span>
                {i === atual.caminho.length - 1 ? (
                  <span className="text-cream">{m.nome}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => irPara(m.id)}
                    className="transition-colors hover:text-cream"
                  >
                    {m.nome}
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <BotaoNeutro type="button" onClick={() => setPastaAberta(true)}>
            <IconFolderPlus className="size-[17px]" />
            Nova pasta
          </BotaoNeutro>
          <BotaoPrimario
            type="button"
            onClick={() => {
              setEditando(null);
              setFormAberto(true);
            }}
          >
            <IconPlus className="size-[17px]" />
            Adicionar
          </BotaoPrimario>
        </div>
      </div>

      {erro && (
        <div className="mt-5">
          <Erro>{erro}</Erro>
        </div>
      )}

      {carregando ? (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[104px] animate-pulse rounded-xl border border-line bg-surface"
            />
          ))}
        </div>
      ) : vazio ? (
        <div className="mt-16 text-center">
          <IconeItem className="mx-auto size-9 text-faint" />
          <p className="mt-3 text-[14px] text-cream">
            {pastaId ? "Esta pasta está vazia." : "Nada aqui ainda."}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">
            Use o botão Adicionar para cadastrar links, um por vez ou vários de
            uma vez.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
            {/* Pastas primeiro, como num explorador de arquivos */}
            {pastas.map((p) => (
              <div
                key={p.id}
                className="group relative flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3.5 transition-colors hover:border-line-hover"
              >
                <button
                  type="button"
                  onClick={() => irPara(p.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <IconFolder className="size-6 shrink-0 text-iris-soft" />
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium text-cream">
                      {p.nome}
                    </p>
                    <p className="text-[11.5px] text-faint">
                      {p.total_subpastas > 0 && `${p.total_subpastas} pastas · `}
                      {p.total_itens} {p.total_itens === 1 ? "item" : "itens"}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => apagarPasta(p)}
                  aria-label={`Apagar pasta ${p.nome}`}
                  className="absolute top-2 right-2 hidden size-7 place-items-center rounded-lg text-faint transition-colors group-hover:grid hover:bg-white/5 hover:text-alert"
                >
                  <IconTrash className="size-[15px]" />
                </button>
              </div>
            ))}

            {/* Depois os itens soltos */}
            {itens.map((item, i) => (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-xl border border-line bg-surface transition-colors hover:border-line-hover"
              >
                <button
                  type="button"
                  onClick={() => abrirItem(item, i)}
                  className="flex flex-1 flex-col items-start px-3.5 py-3.5 text-left"
                >
                  <div className="flex w-full items-center gap-2">
                    <IconeItem className="size-6 shrink-0 text-faint transition-colors group-hover:text-iris-soft" />
                    {item.favorito && (
                      <IconStar className="size-[13px] shrink-0 text-iris-soft" />
                    )}
                    {item.status === "morto" && (
                      <span className="rounded bg-alert/15 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-alert uppercase">
                        morto
                      </span>
                    )}
                  </div>

                  <p className="mt-2.5 line-clamp-2 w-full text-[13.5px] font-medium text-cream">
                    {item.titulo}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-faint">
                    {item.extensao.toUpperCase()}
                    {item.duracao_seg !== null &&
                      ` · ${formatarDuracao(item.duracao_seg)}`}
                    {item.tamanho_bytes !== null &&
                      ` · ${formatarTamanho(item.tamanho_bytes)}`}
                    {item.ordem !== null && ` · #${item.ordem}`}
                  </p>
                </button>

                <div className="absolute top-2 right-2 hidden gap-0.5 group-hover:flex">
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(item);
                      setFormAberto(true);
                    }}
                    aria-label="Editar"
                    className="grid size-7 place-items-center rounded-lg bg-surface text-faint transition-colors hover:bg-white/5 hover:text-cream"
                  >
                    <IconPencil className="size-[15px]" />
                  </button>

                  {item.url && (
                    <a
                      href={item.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Baixar"
                      className="grid size-7 place-items-center rounded-lg bg-surface text-faint transition-colors hover:bg-white/5 hover:text-cream"
                    >
                      <IconDownload className="size-[15px]" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => apagarItem(item)}
                    aria-label="Apagar"
                    className="grid size-7 place-items-center rounded-lg bg-surface text-faint transition-colors hover:bg-white/5 hover:text-alert"
                  >
                    <IconTrash className="size-[15px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {paginas > 1 && (
            <div className="mt-7 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={pagina === 1}
                onClick={() => setPagina((p) => p - 1)}
                aria-label="Página anterior"
                className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-cream disabled:opacity-40"
              >
                <IconLeft className="size-4" />
              </button>
              <span className="text-[13px] text-muted">
                {pagina} de {paginas} · {total} itens
              </span>
              <button
                type="button"
                disabled={pagina === paginas}
                onClick={() => setPagina((p) => p + 1)}
                aria-label="Próxima página"
                className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-cream disabled:opacity-40"
              >
                <IconRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Montado só quando aberto, e desmontado ao fechar: é o que
          garante o formulário limpo na próxima vez. Escondê-lo com CSS
          preservaria o que foi digitado antes. */}
      {formAberto && (
        <FormItem
          aberto
          aoFechar={() => setFormAberto(false)}
          aoSalvar={carregar}
          tipo={tipo}
          pastaId={pastaId}
          item={editando}
        />
      )}

      <Dialogo
        titulo="Nova pasta"
        aberto={pastaAberta}
        aoFechar={fecharPasta}
        largura="max-w-sm"
      >
        <form onSubmit={criarPasta} className="flex flex-col gap-4">
          <Campo
            rotulo="Nome"
            id="nome-pasta"
            dica={atual ? `Será criada dentro de "${atual.nome}".` : undefined}
          >
            <input
              id="nome-pasta"
              value={nomePasta}
              onChange={(e) => setNomePasta(e.target.value)}
              placeholder="Assets do jogo"
              autoFocus
              className={estiloCampo}
            />
          </Campo>

          <div className="flex justify-end gap-2">
            <BotaoNeutro type="button" onClick={fecharPasta}>
              Cancelar
            </BotaoNeutro>
            <BotaoPrimario type="submit" carregando={salvandoPasta}>
              Criar
            </BotaoPrimario>
          </div>
        </form>
      </Dialogo>

      {tipo === "video" && (
        <PlayerVideo
          itens={itens}
          indice={visualizando}
          aoMudar={setVisualizando}
          aoFechar={() => setVisualizando(null)}
        />
      )}

      {tipo === "nota" && (
        <LeitorNota item={lendo} aoFechar={() => setLendo(null)} />
      )}

      {tipo === "imagem" && (
        <Visualizador
          itens={itens}
          indice={visualizando}
          aoMudar={setVisualizando}
          aoFechar={() => setVisualizando(null)}
        />
      )}
    </>
  );
}