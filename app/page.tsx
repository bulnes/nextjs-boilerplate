export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        nextjs-boilerplate
      </h1>
      <p className="mt-4 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Base de produção para os projetos do workspace. Edite{" "}
        <code className="rounded bg-black/6 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/8">
          app/page.tsx
        </code>{" "}
        para começar.
      </p>
    </div>
  );
}
