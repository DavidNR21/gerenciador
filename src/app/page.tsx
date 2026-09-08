"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!identificador || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificador, senha, lembrar }),
      });

      const dados = await r.json();

      if (!r.ok) {
        setErro(dados.erro ?? "Não foi possível entrar.");
        return;
      }

      // O proxy.ts guarda em ?de= a página que a pessoa tentou abrir
      // antes de ser mandada para cá. Lido sem hook para não precisar
      // envolver a página inteira num Suspense.
      const de = new URLSearchParams(window.location.search).get("de");

      router.push(de?.startsWith("/dashboard") ? de : "/dashboard");
      router.refresh(); // faz o servidor reler o cookie recém-gravado
    } catch {
      setErro("Falha de conexão. Verifique sua rede.");
    } finally {
      setCarregando(false);
    }
  }

  const campo =
    "h-[46px] w-full rounded-[10px] border border-line bg-field px-3.5 text-[14px] text-cream placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-line-hover focus:border-iris focus:outline-none focus:ring-3 focus:ring-iris/15";

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-8">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-[clamp(90px,22vh,190px)] w-px origin-top -translate-x-1/2 animate-seam bg-linear-to-b from-iris-soft/55 to-transparent motion-reduce:animate-none"
      />

      <section className="relative w-full max-w-101 animate-rise rounded-2xl border border-line bg-surface px-9 pt-10 pb-8 before:absolute before:-top-px before:right-[18%] before:left-[18%] before:h-px before:bg-linear-to-r before:from-transparent before:via-iris-soft/75 before:to-transparent motion-reduce:animate-none max-[420px]:px-6">
        <Image
          src="/logo.svg"
          alt="Gerenciador"
          width={46}
          height={46}
          priority
          className="mx-auto mb-5.5 block size-11.5 rounded-[13px]"
        />

        <h1 className="text-center font-display text-[23px] leading-tight font-semibold tracking-[-0.015em]">
          Acesse seu acervo
        </h1>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-muted">
          Vídeos, fotos e arquivos em um lugar só.
        </p>

        <form onSubmit={entrar} noValidate className="mt-7.5 flex flex-col gap-4.25">
          {erro && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-[10px] border border-alert/30 bg-alert/[0.07] px-3 py-2.5 text-[13px] text-alert"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 7.5v5M12 16.2v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {erro}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="identificador"
              className="font-mono text-[10px] font-medium tracking-[0.15em] text-muted uppercase"
            >
              E-mail ou usuário
            </label>
            <input
              id="identificador"
              type="text"
              autoComplete="username"
              placeholder="voce@exemplo.com"
              value={identificador}
              onChange={(e) => {
                setIdentificador(e.target.value);
                setErro("");
              }}
              className={campo}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="senha"
              className="font-mono text-[10px] font-medium tracking-[0.15em] text-muted uppercase"
            >
              Senha
            </label>
            <div className="relative flex items-center">
              <input
                id="senha"
                type={verSenha ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErro("");
                }}
                className={`${campo} pr-11.5`}
              />
              <button
                type="button"
                onClick={() => setVerSenha((v) => !v)}
                aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-1.5 grid size-8.5 place-items-center rounded-lg text-faint transition-colors duration-150 hover:bg-iris/10 hover:text-iris-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-soft"
              >
                {verSenha ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    <path d="M6.7 6.8C4.6 8.2 3 10.3 2.5 12c1 2.6 4.5 7 9.5 7 1.8 0 3.4-.6 4.7-1.4M9.9 5.2A8 8 0 0112 5c5 0 8.5 4.4 9.5 7-.4 1.1-1.2 2.5-2.5 3.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2.5 12C3.5 9.4 7 5 12 5s8.5 4.4 9.5 7c-1 2.6-4.5 7-9.5 7s-8.5-4.4-9.5-7z" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <label className="mt-0.5 inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-muted select-none">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="grid size-4 place-items-center rounded-[5px] border border-line-hover bg-field text-transparent transition-colors duration-150 peer-checked:border-iris peer-checked:bg-iris peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris-soft"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Lembrar de mim
          </label>

          <button
            type="submit"
            disabled={carregando}
            className="mt-2.5 h-11.75 rounded-[10px] bg-linear-to-b from-iris to-iris-deep text-[14px] font-semibold text-white transition-[filter,box-shadow,transform] duration-150 not-disabled:hover:brightness-110 not-disabled:hover:shadow-[0_10px_26px_-10px_rgba(124,92,255,0.75)] not-disabled:active:translate-y-px disabled:cursor-default disabled:opacity-60"
          >
            {carregando ? (
              <span className="inline-block size-3.75 -mb-0.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[12.5px] text-faint">
          As contas são criadas pelo administrador.
        </p>
      </section>
    </main>
  );
}
