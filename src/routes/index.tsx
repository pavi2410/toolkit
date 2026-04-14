import { Button, Chip } from '@heroui/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import IconArrowRight from '~icons/tabler/arrow-right'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import { ToolDirectory } from '#/components/ToolDirectory'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <section className="mb-10 space-y-4">
          <Chip color="accent" variant="soft" size="sm">
            <Chip.Label>Developer Toolkit</Chip.Label>
          </Chip>

          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Fast tools for everyday workflows.
          </h1>

          <p className="max-w-xl text-base text-muted">
            Practical browser-based utilities for comparing, converting, and editing — no installs, no friction.
          </p>

          <Button
            variant="primary"
            render={(props: any) => <Link {...props} to="/diff-checker" />}
          >
            Get started
            <IconArrowRight className="h-4 w-4" />
          </Button>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-foreground">Tools</h2>
            <Chip color="success" variant="soft" size="sm">
              <Chip.Label>4 available</Chip.Label>
            </Chip>
          </div>
          <ToolDirectory />
        </section>
      </main>
      <Footer />
    </>
  )
}