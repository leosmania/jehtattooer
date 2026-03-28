'use server';

import { client } from '@/sanity/client';

export async function submitLead(name: string, email: string, whatsapp: string, prize: string) {
  try {
    const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
    
    if (token) {
      const writeClient = client.withConfig({ token, useCdn: false });
      await writeClient.create({
        _type: 'lead',
        name,
        email,
        whatsapp,
        prize,
        date: new Date().toISOString(),
      });
      return { success: true };
    } else {
      console.log('Lead Capturado na Roleta (⚠️ Sem token de Sanity para salvar diretamente):');
      console.log(`Nome: ${name} | Email: ${email} | WhatsApp: ${whatsapp} | Prêmio: ${prize}`);
      return { success: true, message: 'Salvo em log local' };
    }
  } catch (error) {
    console.error('Failed to save lead:', error);
    return { success: false, error: 'Erro ao salvar os dados.' };
  }
}
