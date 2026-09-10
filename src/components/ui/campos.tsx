"use client";

/** Peças de formulário reaproveitadas nas telas do acervo. */

export const estiloCampo =
  "h-10 w-full rounded-[10px] border border-line bg-field px-3 text-[14px] text-cream placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-line-hover focus:border-iris focus:outline-none focus:ring-3 focus:ring-iris/15";

export function Rotulo({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[10px] font-medium tracking-[0.15em] text-muted uppercase"
    >
      {children}
    </label>
  );
}

export function Campo({
  rotulo,
  id,
  dica,
  children,
}: {
  rotulo: string;
  id?: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Rotulo htmlFor={id}>{rotulo}</Rotulo>
      {children}
      {dica && <p className="text-[11.5px] leading-relaxed text-faint">{dica}</p>}
    </div>
  );
}

export function Erro({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-[10px] border border-alert/30 bg-alert/[0.07] px-3 py-2.5 text-[13px] text-alert"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5v5M12 16.2v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

export function BotaoPrimario({
  children,
  carregando,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { carregando?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || carregando}
      className="flex h-10 items-center justify-center gap-2 rounded-[10px] bg-linear-to-b from-iris to-iris-deep px-4 text-[13.5px] font-medium text-white transition-[filter,box-shadow] duration-150 not-disabled:hover:brightness-110 not-disabled:hover:shadow-[0_8px_22px_-10px_rgba(124,92,255,0.8)] disabled:cursor-default disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-soft"
    >
      {carregando ? (
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        children
      )}
    </button>
  );
}

export function BotaoNeutro({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-line bg-field px-4 text-[13.5px] text-muted transition-colors duration-150 hover:border-line-hover hover:text-cream disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-soft"
    >
      {children}
    </button>
  );
}
