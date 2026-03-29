import { type SchemaTypeDefinition } from 'sanity';
import { portfolioType } from './portfolioType';
import { testimonialType } from './testimonialType';
import { siteSettingsType } from './siteSettingsType';
import { availableArtType } from './availableArtType';
import { leadType } from './leadType';
import { promotionType } from './promotionType';
import { blogType } from './blogType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [portfolioType, testimonialType, siteSettingsType, availableArtType, leadType, promotionType, blogType],
};
