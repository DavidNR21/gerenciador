import { redirect } from "next/navigation";

import ListaUsuarios from "@/components/usuarios/lista-usuarios";
import { usuarioLogado } from "@/lib/api";

export default async function UsuariosPage() {
  const usuario = await usuarioLogado();

  // A API já recusa quem não é admin, mas sem isto a tela abriria vazia
  // com um erro de permissão — pior do que simplesmente não abrir.
  if (!usuario) redirect("/api/auth/expirar");
  if (usuario.role !== "admin") redirect("/dashboard");

  return <ListaUsuarios meuId={usuario.id} />;
}
