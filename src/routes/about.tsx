import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Toolkit, extracted into its own home.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          This project now runs as a dedicated toolkit website using TanStack
          Start. The first migration pass focuses on copying working tools and
          routes from the main website with minimal behavior changes. A full UI
          redesign using HeroUI v3 is planned for the next phase.
        </p>
      </section>
    </main>
  )
}
