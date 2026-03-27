import { type SchemaTypeDefinition } from 'sanity';
import { portfolioType } from './portfolioType';
import { testimonialType } from './testimonialType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [portfolioType, testimonialType],
};
