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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Depoimento',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagem (opcional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Adicione uma imagem ao depoimento (print de conversa, foto do resultado, etc.)',
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
    },
  },
});
