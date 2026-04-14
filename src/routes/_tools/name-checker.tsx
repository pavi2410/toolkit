import { createFileRoute } from '@tanstack/react-router'
import NameCheckerTool from '#/components/tools/name-checker'

export const Route = createFileRoute('/_tools/name-checker')({
  head: () => ({
    meta: [
      { title: 'Name Checker | Toolkit' },
      {
        name: 'description',
        content:
          'Check name availability across package registries, code platforms, and domains.',
      },
    ],
  }),
  component: NameCheckerPage,
})

function NameCheckerPage() {
  return (
    <div className="h-full min-h-[75vh] overflow-hidden">
      <NameCheckerTool />
    </div>
  )
}