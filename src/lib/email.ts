import 'server-only'

import { Resend } from 'resend'

/**
 * Email helper com Resend
 */

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY não configurada. Emails não funcionarão.')
}

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Enviar email com link de anamnese
 */
export async function sendAnamnesisEmail({
  to,
  nome,
  anamnesisUrl,
}: {
  to: string
  nome: string
  anamnesisUrl: string
}): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ Tentando enviar email sem RESEND_API_KEY. Pulando.')
    return { success: true } // fail silently em dev
  }

  try {
    const result = await resend.emails.send({
      from: 'Jéssica <noreply@jehtattooer.com.br>',
      to,
      subject: 'Próximo passo: Preencha sua ficha de anamnese',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #081C15;">Olá ${nome}! 👋</h2>

          <p>Recebemos seu pedido de tatuagem! Que legal 🎨</p>

          <p>Após conversa com você sobre o design, vou enviar este link para que você preencha sua <strong>ficha de anamnese</strong> — um formulário importante de saúde que me ajuda a garantir a melhor qualidade para sua tatuagem.</p>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${anamnesisUrl}" style="display: inline-block; padding: 12px 24px; background-color: #5C726E; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Preencher Ficha de Anamnese</a>
          </p>

          <p style="font-size: 12px; color: #666;">Ou copie e cole este link no navegador:</p>
          <p style="font-size: 12px; color: #666; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${anamnesisUrl}</p>

          <p style="margin-top: 30px; color: #666; font-size: 12px;">Este link é único e exclusivo para você. A ficha leva apenas 5 minutos para preencher! ✨</p>

          <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px;">
            Jéssica Barboza<br/>
            Tatuadora especializada em designs delicados, florais e fineline<br/>
            Florianópolis, SC
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error('❌ Erro ao enviar email:', result.error)
      return { success: false, error: String(result.error) }
    }

    console.log('✅ Email enviado com sucesso:', result.id)
    return { success: true }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return { success: false, error: String(error) }
  }
}
