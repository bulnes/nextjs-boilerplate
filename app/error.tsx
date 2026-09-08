"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Algo deu errado</h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Ocorreu um erro inesperado. Você pode tentar novamente.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Tentar novamente
      </button>
    </div>
  );
}
