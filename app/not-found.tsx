import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Página não encontrada
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link
        href="/"
        className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Voltar para a home
      </Link>
    </div>
  );
}
