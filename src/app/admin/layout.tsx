import Link from 'next/link'
import styles from './Admin.module.css'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Layout sem proteção — a proteção acontece em cada página via verifySession()
 * Assim /admin/login não entra em loop de redirect
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminContainer}>
      {children}
    </div>
  )
}
