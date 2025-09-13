import { type ComponentStyleKeyMap, schema } from '@kiskadee/schema';
import { convertElementSchemaToStyleKeys } from './phase-1-convert-schema-to-style-keys/convertElementSchemaToStyleKeys';
import {
  mapStyleKeyUsage,
  type StyleKeyUsageMap
} from './phase-2-map-style-key-usage/mapStyleKeyUsage';
import {
  type ShortenCssClassNames,
  shortenCssClassNames
} from './phase-3-shorten-css-class-names/shortenCssClassNames';
import { generateCssFromStyleKeyList } from './phase-4-convert-style-keys-to-css-rules/generateCss';
import { generateClassNamesMap, type ComponentClassNameMap } from './phase-5-generate-class-names-map/generateClassNamesMap';
import { persistBuildArtifacts } from './phase-6-persist-build-artifacts/persistBuildArtifacts';

// Phase 1 - Convert Element Schema to Style Keys
const styleKeys: ComponentStyleKeyMap = convertElementSchemaToStyleKeys(schema);
console.log({ styleKeys: JSON.stringify(styleKeys, null, 2) });

// // Phase 2 - Map style key usage for optimization purposes
const styleKeyUsage: StyleKeyUsageMap = mapStyleKeyUsage(styleKeys);
// console.log({ styleKeyUsage });

// Phase 3 - Shorten CSS class names for optimization purposes
const shortenCssClassNameMap: ShortenCssClassNames = shortenCssClassNames(styleKeyUsage);
console.log({ shortenCssClassNameMap });

// Phase 4 - Convert Style Keys to CSS rules
const cssGenerated: string = await generateCssFromStyleKeyList(shortenCssClassNameMap);
console.log({ cssGenerated });

// Phase 5 - Generate class names map from style keys using shortened class names
const classNamesMap: ComponentClassNameMap = generateClassNamesMap(styleKeys, shortenCssClassNameMap);

// Phase 6 - Persist build artifacts (CSS and class names map)
await persistBuildArtifacts(cssGenerated, classNamesMap);
