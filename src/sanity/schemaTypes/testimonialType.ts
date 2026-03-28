import { defineField, defineType } from 'sanity';

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Depoimento',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Cliente',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Depoimento (texto)',
      type: 'text',
      rows: 4,
      description: 'Opcional se uma imagem for adicionada.',
    }),
    defineField({
      name: 'image',
      title: 'Imagem do Depoimento',
      type: 'image',
      options: { hotspot: true },
      description: 'Print de conversa, foto do resultado, etc. Pode ser usado sozinho ou junto com o texto.',
    }),
    defineField({
      name: 'service',
      title: 'Serviço Realizado',
      type: 'string',
      options: {
        list: [
          { title: 'Tatuagem Floral Autoral', value: 'Tatuagem Floral Autoral' },
          { title: 'Micro-tatuagem Fineline', value: 'Micro-tatuagem Fineline' },
          { title: 'Tatuagem Delicada Personalizada', value: 'Tatuagem Delicada Personalizada' },
          { title: 'Cover-up Delicado', value: 'Cover-up Delicado' },
          { title: 'Outro', value: 'Outro' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'service',
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || 'Depoimento em imagem',
        subtitle: subtitle || '',
        media,
      };
    },
  },
});
