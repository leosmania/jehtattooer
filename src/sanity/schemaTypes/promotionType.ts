import { defineField, defineType } from 'sanity';

export const promotionType = defineType({
    name: 'promotion',
    title: 'Promoção',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título da Promoção',
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
            name: 'discount',
            title: 'Desconto (Badge)',
            type: 'string',
            description: 'Ex: 30% OFF, GRÁTIS, -50%, etc.',
        }),
        defineField({
            name: 'link',
            title: 'Link Externo (Opcional)',
            type: 'url',
            description: 'Link para mais informações ou página externa',
        }),
        defineField({
            name: 'active',
            title: 'Ativo',
            type: 'boolean',
            initialValue: true,
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'discount',
            media: 'image',
        },
        prepare(selection) {
            const { title, subtitle, media } = selection;
            return {
                title,
                subtitle: subtitle ? `💰 ${subtitle}` : '📢 Promoção',
                media,
            };
        },
    },
});
