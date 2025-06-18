import { schema, type InteractionState } from '@kiskadee/schema';
import { convertSchemaToStyleKeyList } from './phrase-1-convert-object-to-style-key/convertSchemaToStyleKeyList';
import { generateCssFromStyleKeyList } from './phrase-2-convert-style-key-to-css/generateCss';

// Phrase 1
const styleKeyList = convertSchemaToStyleKeyList(schema);

// Phrase 2
const cssGenerated = await generateCssFromStyleKeyList(styleKeyList);

// Output
console.log({ styleKeyList });
console.log({ cssGenerated });
