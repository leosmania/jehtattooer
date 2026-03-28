import { type SchemaTypeDefinition } from 'sanity';
import { portfolioType } from './portfolioType';
import { testimonialType } from './testimonialType';
import { siteSettingsType } from './siteSettingsType';
import { availableArtType } from './availableArtType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [portfolioType, testimonialType, siteSettingsType, availableArtType],
};
