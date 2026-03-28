import { defineField, defineType } from 'sanity';

export const portfolioType = defineType({
  name: 'portfolio',
  title: 'Portfolio Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Floral', value: 'Floral' },
          { title: 'Fineline', value: 'Fineline' },
          { title: 'Botanica', value: 'Botanica' },
          { title: 'Animais', value: 'Animais' },
          { title: 'Ornamental', value: 'Ornamental' },
          { title: 'Cicatrizadas', value: 'Cicatrizadas' },
          { title: 'Pontilhismo', value: 'Pontilhismo' },
          { title: 'Homenagens', value: 'Homenagens' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
});
