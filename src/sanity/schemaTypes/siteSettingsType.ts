import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logotipo',
      type: 'image',
      description: 'O logotipo da libélula que aparece no cabeçalho e rodapé do site.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagem de Fundo (Tela Inicial)',
      type: 'image',
      description: 'A imagem de fundo que aparece na tela inicial do site.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutPhoto',
      title: 'Foto do Sobre Mim',
      type: 'image',
      description: 'A foto que aparece na seção "Sobre Mim".',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutTitle',
      title: 'Título do Sobre Mim',
      type: 'string',
      description: 'Ex: "Prazer, Jéssica Barboza"',
    }),
    defineField({
      name: 'aboutText1',
      title: 'Sobre Mim - Parágrafo 1',
      type: 'text',
      rows: 4,
      description: 'Primeiro parágrafo da sua bio.',
    }),
    defineField({
      name: 'aboutText2',
      title: 'Sobre Mim - Parágrafo 2',
      type: 'text',
      rows: 4,
      description: 'Segundo parágrafo da sua bio.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configurações do Site' };
    },
  },
});
