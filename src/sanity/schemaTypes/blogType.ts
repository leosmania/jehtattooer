import { defineField, defineType } from 'sanity';

export const blogType = defineType({
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título do Post',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL do Post (slug)',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagem em Destaque',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo (para listagem)',
      type: 'text',
      rows: 3,
      description: 'Breve resumo do post - aparece na listagem',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Conteúdo do Post',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      initialValue: 'Jéssica Barboza',
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Cuidados', value: 'cuidados' },
          { title: 'Inspiração', value: 'inspiracao' },
          { title: 'História', value: 'historia' },
          { title: 'Processo', value: 'processo' },
          { title: 'Tendências', value: 'tendencias' },
          { title: 'Saúde', value: 'saude' },
          { title: 'Estilo', value: 'estilo' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags (palavras-chave)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de Publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO - Título (para Google)',
      type: 'string',
      description: 'Até 60 caracteres. Se vazio, usa o título do post',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO - Descrição (para Google)',
      type: 'text',
      rows: 2,
      description: 'Até 160 caracteres. Aparece nos resultados do Google',
    }),
    defineField({
      name: 'published',
      title: 'Publicado?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      date: 'publishedAt',
      published: 'published',
    },
    prepare(selection) {
      const { title, media, date, published } = selection;
      const status = published ? '✅' : '📝 Rascunho';
      const formatted = new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return {
        title: `${status} ${title}`,
        subtitle: formatted,
        media,
      };
    },
  },
});
