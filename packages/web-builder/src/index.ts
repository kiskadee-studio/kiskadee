import { schema, type InteractionState } from '@kiskadee/schema';
import { convertElementSchemaToStyleKeys } from './phase-1-convert-schema-to-style-keys/convertElementSchemaToStyleKeys';
import { generateCssFromStyleKeyList } from './phase-3-convert-style-keys-to-css-rules/generateCss';
import { mapStyleKeyUsage } from './phase-2-map-style-key-usage/mapStyleKeyUsage';
import { shortenCssClassNames } from './phase-3-shorten-css-class-names/shortenCssClassNames';

// Phase 1 - Convert Element Schema to Style Keys
const styleKeys = convertElementSchemaToStyleKeys(schema);

// Phase 2 - Map style key usage for optimization purposes
const styleKeyUsage = mapStyleKeyUsage(styleKeys);

// Phase 3 - Shorten CSS class names for optimization purposes
const shortenCssClassNameMap = shortenCssClassNames(styleKeyUsage);

// Phase 4 - Convert Style Keys to CSS rules
// const cssGenerated = await generateCssFromStyleKeyList(styleKeyList);

// Output
console.log({ styleKeyUsage, shortenCssClassNameMap });
// console.log({ cssGenerated });
