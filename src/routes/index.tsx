import { Chip, Surface } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link, createFileRoute } from '@tanstack/react-router'
import IconArrowRight from '~icons/tabler/arrow-right'
import IconBolt from '~icons/tabler/bolt'
import IconLayoutGrid from '~icons/tabler/layout-grid'
import IconShieldHalf from '~icons/tabler/shield-half'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import { ToolDirectory, toolItems } from '#/components/ToolDirectory'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-400 flex-1 flex-col gap-6 px-4 py-6 sm:py-8"
      >
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          <Surface className="space-y-6 rounded-3xl p-6 shadow-none sm:p-8">
            <div className="flex flex-wrap gap-2">
                <Chip color="accent" variant="soft" size="sm">
                  <Chip.Label>Productivity Toolkit</Chip.Label>
                </Chip>
                <Chip color="default" variant="soft" size="sm">
                  <Chip.Label>In-Browser Processing</Chip.Label>
                </Chip>
                <Chip color="success" variant="soft" size="sm">
                  <Chip.Label>{toolItems.length} Tools Ready</Chip.Label>
                </Chip>
            </div>

            <div className="max-w-4xl space-y-3">
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
                  Utility workflows with less hunting, less setup, and more usable screen space.
                </h1>

                <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                  Open the tool you need, stay in one workspace, and finish the job without bouncing through disposable tabs.
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <Link to="/diff-checker" className={buttonVariants({ variant: 'primary' })}>
                  Open Diff Checker
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/name-checker" className={buttonVariants({ variant: 'secondary' })}>
                  Check a Project Name
                </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <Surface variant="secondary" className="space-y-2 rounded-2xl p-4 shadow-none">
                  <IconLayoutGrid className="h-5 w-5 text-accent" />
                  <p className="text-sm font-semibold text-foreground">Fast Discovery</p>
                  <p className="text-sm text-muted">
                    Every tool stays one click away so utility tasks feel like part of the same workspace.
                  </p>
                </Surface>

                <Surface variant="secondary" className="space-y-2 rounded-2xl p-4 shadow-none">
                  <IconBolt className="h-5 w-5 text-warning" />
                  <p className="text-sm font-semibold text-foreground">Dense, Not Crowded</p>
                  <p className="text-sm text-muted">
                    Controls stay visible, outputs stay large, and the layout favors working area over decoration.
                  </p>
                </Surface>

                <Surface variant="secondary" className="space-y-2 rounded-2xl p-4 shadow-none">
                  <IconShieldHalf className="h-5 w-5 text-success" />
                  <p className="text-sm font-semibold text-foreground">Privacy First</p>
                  <p className="text-sm text-muted">
                    Text, images, and documents are handled locally when the workflow allows it.
                  </p>
                </Surface>
            </div>
          </Surface>

          <Surface className="h-full space-y-4 rounded-3xl p-5 shadow-none" variant="secondary">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Quick Access</h2>
              <p className="text-sm text-muted">Start with the task you most likely need right now.</p>
            </div>
            <div className="space-y-2.5">
              {toolItems.map(({ to, name, description, eyebrow }) => (
                <Link key={to} to={to} className="block no-underline">
                  <Surface variant="default" className="space-y-2 rounded-2xl p-4 shadow-none transition-transform duration-200 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <Chip color="default" variant="soft" size="sm">
                        <Chip.Label>{eyebrow}</Chip.Label>
                      </Chip>
                    </div>
                    <p className="text-sm text-muted">{description}</p>
                  </Surface>
                </Link>
              ))}
            </div>
          </Surface>
        </section>

        <section id="tools" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">All Tools</h2>
              <p className="text-sm text-muted">
                Built for quick edits, comparisons, and checks without sacrificing working room.
              </p>
            </div>
            <Chip color="success" variant="soft" size="sm">
              <Chip.Label>{toolItems.length} Available</Chip.Label>
            </Chip>
          </div>
          <ToolDirectory />
        </section>
      </main>
      <Footer />
    </div>
  )
}