import { defineField, defineType } from 'sanity';

export const availableArtType = defineType({
    name: 'availableArt',
    title: 'Arte Disponível',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título da Arte',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Imagem',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descrição',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'size',
            title: 'Tamanho Estimado',
            type: 'string',
            description: 'Ex: 10cm, 15x20cm, etc.',
        }),
        defineField({
            name: 'category',
            title: 'Estilo',
            type: 'string',
            options: {
                list: [
                    { title: 'Floral', value: 'Floral' },
                    { title: 'Fineline', value: 'Fineline' },
                    { title: 'Botanica', value: 'Botanica' },
                    { title: 'Animais', value: 'Animais' },
                    { title: 'Ornamental', value: 'Ornamental' },
                    { title: 'Pontilhismo', value: 'Pontilhismo' },
                    { title: 'Homenagens', value: 'Homenagens' },
                ],
            },
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Disponível', value: 'disponivel' },
                    { title: 'Reservada', value: 'reservada' },
                ],
                layout: 'radio',
            },
            initialValue: 'disponivel',
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'status',
            media: 'image',
        },
        prepare(selection) {
            const { title, subtitle, media } = selection;
            return {
                title,
                subtitle: subtitle === 'disponivel' ? '🟢 Disponível' : '🟡 Reservada',
                media,
            };
        },
    },
});
