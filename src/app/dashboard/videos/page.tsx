import Acervo from "@/components/acervo/acervo";

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ pasta?: string }>;
}) {
  const { pasta } = await searchParams;

  return (
    <Acervo
      tipo="video"
      titulo="Vídeos"
      rota="/dashboard/videos"
      pastaId={pasta ?? null}
    />
  );
}
