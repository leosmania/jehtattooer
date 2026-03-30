import { verifySession } from '@/lib/dal'
import Link from 'next/link'
import styles from './Admin.module.css'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession() // redireciona se não autenticado

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Admin</h2>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin/clientes" className={styles.navLink}>
            👥 Clientes
          </Link>
          <Link href="/admin/calendario" className={styles.navLink}>
            📅 Calendário
          </Link>
        </nav>

        <div className={styles.footer}>
          <p className={styles.userEmail}>{session.email}</p>
          <form action="/admin/api/logout" method="POST">
            <button type="submit" className={styles.logoutBtn}>
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
