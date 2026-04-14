import { createFileRoute } from '@tanstack/react-router'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import { ToolDirectory } from '#/components/ToolDirectory'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-8 pt-14">
        <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
          <p className="island-kicker mb-3">Dedicated Toolkit Website</p>
          <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-(--sea-ink) sm:text-6xl">
            Fast tools for everyday dev workflows.
          </h1>
          <p className="mb-8 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
            This site now hosts the toolkit independently from the main website,
            keeping focused utilities in one place with client-first processing.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#tools"
              className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
            >
              Explore Tools
            </a>
          </div>
        </section>

        <section id="tools" className="mt-8">
          <ToolDirectory />
        </section>
      </main>
      <Footer />
    </>
  )
}