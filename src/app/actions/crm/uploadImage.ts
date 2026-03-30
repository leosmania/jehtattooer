'use server'

import { supabase } from '@/lib/supabase'

const BUCKET_NAME = 'quotation-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadQuotationImage(formData: FormData): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  try {
    const file = formData.get('file') as File | null
    if (!file) {
      return { success: false, error: 'Nenhum arquivo enviado' }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'Imagem muito grande (máximo 5MB)' }
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Arquivo deve ser uma imagem' }
    }

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.find((b) => b.name === BUCKET_NAME)) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: true })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = `references/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: 'Erro ao enviar imagem' }
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Erro ao enviar imagem' }
  }
}
