import { defineField, defineType } from 'sanity';

export const leadType = defineType({
  name: 'lead',
  title: 'Leads (Roleta)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'prize',
      title: 'Prêmio Ganho',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'date',
      title: 'Data da Captura',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'prize',
      date: 'date',
    },
    prepare({ title, subtitle, date }) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : '';
      return {
        title,
        subtitle: `${subtitle} (${formattedDate})`,
      };
    },
  },
});
