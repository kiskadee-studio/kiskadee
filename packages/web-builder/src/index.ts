import { schema, type InteractionState } from '@kiskadee/schema';
import { convertSchemaToStyleKey } from './phrase-1-convert-object-to-style-key/convertSchemaToStyleKey';
import { generateCssFromStyle } from './phrase-2-convert-style-key-to-css/generateCss';

// Phrase 1
const styleKeyList = convertSchemaToStyleKey(schema);

// Phrase 2
const cssGenerated = await generateCssFromStyle(styleKeyList);

interface SchemaWebBuilder {
  componentList: {
    [componenteName: string]: {
      [elementName: string]: Partial<Record<InteractionState, string>>;
    };
  };
}

// Input
const schemaWebBuilder: SchemaWebBuilder = {
  componentList: {
    button: {
      e1: {
        rest: 'bg-primary-500 text-white',
        hover: 'bg-primary-600'
      }
    }
  }
};

// Output
console.log({ styleKeyList });
console.log({ cssGenerated });
