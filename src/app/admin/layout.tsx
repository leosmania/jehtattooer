export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Layout raiz do /admin — wrapper simples.
 * A proteção de auth e a sidebar ficam em /admin/clientes/layout.tsx
 * Assim /admin/login renderiza sem grid/sidebar.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
