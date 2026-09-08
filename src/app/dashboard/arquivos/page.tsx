import Acervo from "@/components/acervo/acervo";

export default async function ArquivosPage({
  searchParams,
}: {
  searchParams: Promise<{ pasta?: string }>;
}) {
  const { pasta } = await searchParams;

  return (
    <Acervo
      tipo="arquivo"
      titulo="Arquivos"
      rota="/dashboard/arquivos"
      pastaId={pasta ?? null}
    />
  );
}
