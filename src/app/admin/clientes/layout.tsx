import { verifySession } from '@/lib/dal'
import Link from 'next/link'
import styles from '../Admin.module.css'

export default async function ClientesLayout({ children }: { children: React.ReactNode }) {
  // Proteção: redireciona para login se não autenticado
  const session = await verifySession()

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
