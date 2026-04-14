import { Card, Chip } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import { ToolDirectory } from '#/components/ToolDirectory'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <section className="space-y-6">
          <Card>
            <Card.Header className="flex flex-wrap items-center gap-2">
              <Chip color="accent" variant="soft">
                <Chip.Label>Dedicated Toolkit Website</Chip.Label>
              </Chip>
            </Card.Header>

            <Card.Content className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Fast tools for everyday dev workflows.
              </h1>
              <p className="max-w-2xl text-foreground/70">
                Practical browser-based utilities for comparing, converting, and editing without unnecessary friction.
              </p>

              <div className="flex flex-wrap gap-2">
                <a
                  href="#tools"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground no-underline"
                >
                  Explore tools
                </a>
              </div>
            </Card.Content>
          </Card>
        </section>

        <section id="tools" className="mt-6">
          <Card>
            <Card.Header>
              <div className="flex flex-wrap items-center gap-2">
                <Chip color="accent" variant="soft">
                  <Chip.Label>Toolkit directory</Chip.Label>
                </Chip>
                <Chip color="success" variant="soft">
                  <Chip.Label>4 live tools</Chip.Label>
                </Chip>
              </div>
              <Card.Title>
                Choose a tool
              </Card.Title>
              <Card.Description>
                Minimal, practical navigation to each utility.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <ToolDirectory />
            </Card.Content>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  )
}