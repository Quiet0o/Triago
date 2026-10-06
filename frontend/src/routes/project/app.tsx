import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project/app')({
  component: AppLayoutComponent,
})

function AppLayoutComponent() {
  return (
    <div>
      <h1>App Layout</h1>
      <Outlet />
    </div>
  )
}