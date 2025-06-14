import { schema } from '@kiskadee/schema';
import { convertSchemaToKeys } from './phrase-1-convert-object-to-style-keys/convertSchemaToKeys';
import { generateCssFromStyle } from './phrase-2-convert-style-key-to-css/generateCss';

// Phrase 1
const styleKeyList = convertSchemaToKeys(schema);

// Phrase 2
const cssGenerated = await generateCssFromStyle(styleKeyList);

// Output
console.log({ styleKeyList });
console.log({ cssGenerated });
