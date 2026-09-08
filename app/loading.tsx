export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24" role="status">
      <span className="sr-only">Carregando…</span>
      <div className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-950 dark:border-zinc-700 dark:border-t-zinc-50" />
    </div>
  );
}
