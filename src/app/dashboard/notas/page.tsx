import Acervo from "@/components/acervo/acervo";

export default async function NotasPage({
  searchParams,
}: {
  searchParams: Promise<{ pasta?: string }>;
}) {
  const { pasta } = await searchParams;

  return (
    <Acervo
      tipo="nota"
      titulo="Notas"
      rota="/dashboard/notas"
      pastaId={pasta ?? null}
    />
  );
}
