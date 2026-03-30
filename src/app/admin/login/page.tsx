import { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Admin Login | JehTattooer',
  description: 'Painel de administração do CRM',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoginForm />
    </div>
  )
}
