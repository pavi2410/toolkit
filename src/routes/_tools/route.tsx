import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import ToolHeader from '#/components/ToolHeader'
import { getToolByPath } from '#/components/ToolDirectory'

export const Route = createFileRoute('/_tools')({
  component: ToolLayout,
})

function ToolLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const activeTool = getToolByPath(pathname)

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface-secondary">
      <ToolHeader title={activeTool?.name ?? 'Toolkit'} />

      <main id="main-content" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden [&>*]:min-h-0 [&>*]:w-full [&>*]:flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}