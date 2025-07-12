import { schema, type InteractionState } from '@kiskadee/schema';
import { convertElementSchemaToStyleKeys } from './phrase-1-convert-schema-to-style-keys/convertElementSchemaToStyleKeys';
import { generateCssFromStyleKeyList } from './phrase-2-convert-style-key-to-css/generateCss';

// Phrase 1
const styleKeyList = convertElementSchemaToStyleKeys(schema);

// Phrase 2
// const cssGenerated = await generateCssFromStyleKeyList(styleKeyList);

// Output
console.log({ styleKeyList });
// console.log({ cssGenerated });
