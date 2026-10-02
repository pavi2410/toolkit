import { createFileRoute } from '@tanstack/react-router'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import { ToolDirectory } from '#/components/ToolDirectory'
import { SITE_DESCRIPTION, seo } from '#/utils/seo'

export const Route = createFileRoute('/')({
  head: () => seo({ title: 'Toolkit | pavi2410', description: SITE_DESCRIPTION, path: '/' }),
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-4 sm:py-14">
        <ToolDirectory />
      </main>
      <Footer />
    </div>
  )
}
