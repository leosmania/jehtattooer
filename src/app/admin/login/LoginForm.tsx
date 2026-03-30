'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/actions/crm/loginAction'
import styles from './LoginForm.module.css'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={styles.button} disabled={pending}>
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  )
}

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await loginAction(formData)

    if (result.error) {
      setError(result.error)
    }
    // Se sucesso, loginAction redireciona automaticamente
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Painel do Admin</h1>
      <p className={styles.subtitle}>Entre com suas credenciais</p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.group}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="jessica@jehtattooer.com.br"
          className={styles.input}
          required
          defaultValue="jessica@jehtattooer.com.br"
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="password" className={styles.label}>
          Senha
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Sua senha"
          className={styles.input}
          required
        />
      </div>

      <SubmitButton />

      <p className={styles.footer}>
        Painel exclusivo para administradores
      </p>
    </form>
  )
}
