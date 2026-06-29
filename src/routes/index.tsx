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

const features = [
  {
    Icon: IconLayoutGrid,
    title: 'Fast Discovery',
    description:
      'Every tool stays one click away so utility tasks feel like part of the same workspace.',
    iconColor: 'text-accent',
  },
  {
    Icon: IconBolt,
    title: 'Dense, Not Crowded',
    description:
      'Controls stay visible, outputs stay large, and the layout favors working area over decoration.',
    iconColor: 'text-warning',
  },
  {
    Icon: IconShieldHalf,
    title: 'Privacy First',
    description:
      'Text, images, and documents are handled locally in your browser when the workflow allows it.',
    iconColor: 'text-success',
  },
] as const

function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Atmospheric aurora + grid — purely decorative, lives behind everything */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="aurora-blob animate-aurora absolute -left-24 -top-40 h-[42rem] w-[42rem] rounded-full bg-accent/25 blur-3xl" />
        <div
          className="aurora-blob animate-aurora absolute -right-32 top-1/3 h-[38rem] w-[38rem] rounded-full bg-success/20 blur-3xl"
          style={{ animationDelay: '-7s' }}
        />
        <div
          className="aurora-blob animate-aurora absolute -bottom-48 left-1/4 h-[40rem] w-[40rem] rounded-full bg-warning/15 blur-3xl"
          style={{ animationDelay: '-14s' }}
        />
        <div className="bg-grid mask-fade absolute inset-0" />
      </div>

      <Header />

      <main
        id="main-content"
        className="mx-auto flex w-full max-w-400 flex-1 flex-col gap-10 px-4 py-8 sm:py-12"
      >
        {/* Hero */}
        <section>
          <Surface
            variant="transparent"
            className="glass animate-rise relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-12 sm:py-16"
          >
            {/* Film grain for glass texture */}
            <div
              aria-hidden="true"
              className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            />

            <div className="relative space-y-7">
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

              <div className="max-w-3xl space-y-4">
                <h1 className="font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                  Utility workflows with less hunting, less setup, and more usable screen space.
                </h1>

                <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                  Open the tool you need, stay in one workspace, and finish the job without bouncing
                  through disposable tabs.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/diff-checker" className={buttonVariants({ variant: 'primary' })}>
                  Open Diff Checker
                  <IconArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link to="/name-checker" className={buttonVariants({ variant: 'secondary' })}>
                  Check a Project Name
                </Link>
              </div>
            </div>
          </Surface>
        </section>

        {/* Feature tiles */}
        <section className="grid gap-3 sm:grid-cols-3">
          {features.map(({ Icon, title, description, iconColor }) => (
            <Surface
              key={title}
              variant="transparent"
              className="glass-soft space-y-2.5 rounded-2xl p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary/70">
                <Icon aria-hidden="true" className={`h-5 w-5 ${iconColor}`} />
              </div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-sm text-muted">{description}</p>
            </Surface>
          ))}
        </section>

        {/* Tools */}
        <section id="tools" className="space-y-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">All Tools</h2>
            <p className="text-sm text-muted">Choose a card to open it in the workspace.</p>
          </div>
          <ToolDirectory />
        </section>
      </main>

      <Footer />
    </div>
  )
}
