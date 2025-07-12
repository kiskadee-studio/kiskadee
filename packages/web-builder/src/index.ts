import { schema, type InteractionState } from '@kiskadee/schema';
import { convertElementSchemaToStyleKeys } from './phase-1-convert-schema-to-style-keys/convertElementSchemaToStyleKeys';
import { generateCssFromStyleKeyList } from './phase-3-convert-style-keys-to-css-rules/generateCss';
import { mapStyleKeyUsage } from './phase-2-map-style-key-usage/mapStyleKeyUsage';

// Phase 1 - Convert Element Schema to Style Keys
const styleKeys = convertElementSchemaToStyleKeys(schema);

// Phase 2 - Map style key usage for optimization purposes
const styleKeyUsage = mapStyleKeyUsage(styleKeys);

// Phase 3 - Convert Style Keys to CSS rules
// const cssGenerated = await generateCssFromStyleKeyList(styleKeyList);

// Phase 4 - Shorten CSS class names

// Output
console.log({ styleKeyUsage });
// console.log({ cssGenerated });
