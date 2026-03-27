import { type SchemaTypeDefinition } from 'sanity';
import { portfolioType } from './portfolioType';
import { testimonialType } from './testimonialType';
import { siteSettingsType } from './siteSettingsType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [portfolioType, testimonialType, siteSettingsType],
};
