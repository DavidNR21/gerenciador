import Acervo from "@/components/acervo/acervo";

export default async function FotosPage({
  searchParams,
}: {
  searchParams: Promise<{ pasta?: string }>;
}) {
  const { pasta } = await searchParams;

  return (
    <Acervo
      tipo="imagem"
      titulo="Fotos"
      rota="/dashboard/fotos"
      pastaId={pasta ?? null}
    />
  );
}
