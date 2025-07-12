import { schema, type InteractionState } from '@kiskadee/schema';
import { convertElementSchemaToStyleKeys } from './phase-1-convert-schema-to-style-keys/convertElementSchemaToStyleKeys';
import { generateCssFromStyleKeyList } from './phrase-3-convert-style-keys-to-css-rules/generateCss';

// Phase 1 - Convert Element Schema to Style Kyes
const styleKeyList = convertElementSchemaToStyleKeys(schema);

// Phase 2 - Map style key usage for optimization purposes

// Phase 3 - Convert Style Keys to CSS rules
// const cssGenerated = await generateCssFromStyleKeyList(styleKeyList);

// Output
console.log({ styleKeyList });
// console.log({ cssGenerated });
