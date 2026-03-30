'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/actions/crm/loginAction'
import styles from './LoginForm.module.css'

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: '' })

  return (
    <form action={formAction} className={styles.form}>
      <h1 className={styles.title}>Painel do Admin</h1>
      <p className={styles.subtitle}>Entre com suas credenciais</p>

      {state.error && <div className={styles.error}>{state.error}</div>}

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
          disabled={isPending}
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
          disabled={isPending}
        />
      </div>

      <button type="submit" className={styles.button} disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>

      <p className={styles.footer}>
        Painel exclusivo para administradores
      </p>
    </form>
  )
}
