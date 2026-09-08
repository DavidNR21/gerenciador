export type TipoItem = "video" | "imagem" | "arquivo" | "nota";
export type StatusLink = "nao_verificado" | "ok" | "morto";

export type Item = {
  id: string;
  tipo: TipoItem;
  titulo: string;
  descricao: string | null;
  url: string | null;
  tem_texto: boolean;
  extensao: string;
  mime_type: string | null;
  tamanho_bytes: number | null;
  duracao_seg: number | null;
  largura: number | null;
  altura: number | null;
  colecao_id: string | null;
  colecao_nome: string | null;
  parte: number | null;
  ordem: number | null;
  status: StatusLink;
  verificado_em: string | null;
  favorito: boolean;
  tags: string[];
  criado_em: string;
  atualizado_em: string;
};

export type Migalha = { id: string; nome: string };

export type Colecao = {
  id: string;
  nome: string;
  descricao: string | null;
  capa_url: string | null;
  tipo: TipoItem | null;
  pai_id: string | null;
  criado_em: string;
  total_itens: number;
  total_subpastas: number;
  caminho: Migalha[];
};

export type Pagina<T> = {
  itens: T[];
  total: number;
  pagina: number;
  por_pagina: number;
  paginas: number;
};
