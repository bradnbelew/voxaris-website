export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          <span className="text-gold">Voxaris</span> Orchestrator
        </h1>
        <p className="mx-auto max-w-md text-lg text-gray-400">
          Real-time conversational video AI that visibly controls hotel websites.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/dashboard"
            className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-void transition-colors hover:bg-gold-dim"
          >
            Open Dashboard
          </a>
          <a
            href="https://docs.voxaris.io"
            className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500"
          >
            Documentation
          </a>
        </div>
      </div>
    </main>
  );
}
