import type { ComponentStyleKeyMap } from '@kiskadee/schema';
// import { schema } from '@kiskadee/schema/src/templates/google-material-design';
import { schema } from '@kiskadee/schema/src/templates/template-2';
import { convertElementSchemaToStyleKeys } from './phase-1-convert-schema-to-style-keys/convertElementSchemaToStyleKeys';
import {
  mapStyleKeyUsage,
  type StyleKeyUsageMap
} from './phase-2-map-style-key-usage/mapStyleKeyUsage';
import {
  type ShortenCssClassNames,
  shortenCssClassNames
} from './phase-3-shorten-css-class-names/shortenCssClassNames';
import { generateCssSplit } from './phase-4-convert-style-keys-to-css-rules/generateCssSplit';
import {
  type ComponentClassNameMapSplit,
  generateClassNamesMapSplit
} from './phase-5-generate-class-names-map/generateClassNamesMap';
import { persistBuildArtifacts } from './phase-6-persist-build-artifacts/persistBuildArtifacts';

// Phase 1 - Convert Element Schema to Style Keys
const styleKeys: ComponentStyleKeyMap = convertElementSchemaToStyleKeys(schema);
console.log('phase 1', { styleKeys: JSON.stringify(styleKeys, null, 2) });

// // Phase 2 - Map style key usage for optimization purposes
const styleKeyUsage: StyleKeyUsageMap = mapStyleKeyUsage(styleKeys);
console.log('phase  2', { styleKeyUsage });

// Phase 3 - Shorten CSS class names for optimization purposes
const shortenCssClassNameMap: ShortenCssClassNames = shortenCssClassNames(styleKeyUsage);
console.log('phase 3', { shortenCssClassNameMap });

// Phase 4 - Convert Style Keys to CSS rules, split core vs palette bundles
const cssGenerated = await generateCssSplit(styleKeys, shortenCssClassNameMap);
console.log('phase 4', { cssGenerated });

// Phase 5 - Generate class names map split (core + per-palette)
const classNamesMapSplit: ComponentClassNameMapSplit = generateClassNamesMapSplit(
  styleKeys,
  shortenCssClassNameMap
);
console.log('phrase 5', { classNamesMapSplit });

// Phase 6 - Persist build artifacts (CSS and class names map split)
await persistBuildArtifacts(cssGenerated, classNamesMapSplit, schema.name);
