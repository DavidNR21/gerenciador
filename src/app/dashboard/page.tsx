import { IconImage, IconVideo, IconDatabase, IconNote } from "@/components/icons";

const contadores = [
  { rotulo: "Imagens", valor: "1.284", Icone: IconImage },
  { rotulo: "Vídeos", valor: "96", Icone: IconVideo },
  { rotulo: "Arquivos", valor: "342", Icone: IconDatabase },
  { rotulo: "Notas", valor: "58", Icone: IconNote },
];

const recentes = [
  { nome: "Viagem Jericoacoara", tipo: "Imagem", meta: "34 fotos", quando: "hoje", Icone: IconImage },
  { nome: "Reunião de setembro", tipo: "Vídeo", meta: "42 min", quando: "hoje", Icone: IconVideo },
  { nome: "Backup contratos", tipo: "Arquivo", meta: "128 MB", quando: "ontem", Icone: IconDatabase },
  { nome: "Ideias para o app", tipo: "Nota", meta: "3 páginas", quando: "ontem", Icone: IconNote },
  { nome: "Ensaio estúdio", tipo: "Imagem", meta: "12 fotos", quando: "há 3 dias", Icone: IconImage },
  { nome: "Notas fiscais 2026", tipo: "Arquivo", meta: "56 MB", quando: "há 5 dias", Icone: IconDatabase },
];

export default function VisaoGeral() {
  return (
    <>
      <h1 className="text-[21px] font-semibold tracking-[-0.015em]">Visão geral</h1>
      <p className="mt-1 text-[13.5px] text-muted">
        Tudo o que você guardou, reunido em um lugar.
      </p>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        {contadores.map(({ rotulo, valor, Icone }) => (
          <div
            key={rotulo}
            className="rounded-xl border border-line bg-surface px-4 py-3.5"
          >
            <div className="flex items-center gap-2 text-faint">
              <Icone className="size-4" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase">
                {rotulo}
              </span>
            </div>
            <p className="mt-2 text-[26px] leading-none font-semibold tracking-[-0.02em]">
              {valor}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-9 text-[15px] font-medium">Adicionados recentemente</h2>

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-4">
        {recentes.map(({ nome, tipo, meta, quando, Icone }) => (
          <article
            key={nome}
            className="group cursor-pointer overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-150 hover:border-line-hover"
          >
            <div className="relative grid aspect-4/3 place-items-center bg-field">
              <Icone className="size-8 text-faint transition-colors duration-150 group-hover:text-iris-soft" />
              <span className="absolute top-2.5 left-2.5 rounded-md bg-ink/70 px-2 py-0.5 font-mono text-[9.5px] tracking-[0.12em] text-muted uppercase">
                {tipo}
              </span>
            </div>
            <div className="px-3.5 py-3">
              <p className="truncate text-[13.5px] font-medium text-cream">{nome}</p>
              <p className="mt-0.5 text-[11.5px] text-faint">
                {meta} · {quando}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

