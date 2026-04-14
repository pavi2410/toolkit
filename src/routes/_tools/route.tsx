import { Outlet, createFileRoute } from '@tanstack/react-router'
import { ToolPageShell } from '#/components/ToolDirectory'

export const Route = createFileRoute('/_tools')({
  component: ToolLayout,
})

function ToolLayout() {
  return (
    <ToolPageShell>
      <Outlet />
    </ToolPageShell>
  )
}