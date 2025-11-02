import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  schema as appleSchema,
  segments as appleSegments
} from '@kiskadee/schema/src/templates/ios-26-apple';
import {
  schema as kiskadeeSchema,
  segments as kiskadeeSegments
} from '@kiskadee/schema/src/templates/ios-26-kiskadee';
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
import { publishMetadata } from './phase-7-publish-metadata/publishMetadata';

function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templates = [
  {
    schema: appleSchema,
    segments: appleSegments,
    templatePath: resolve(__dirname, '..', '..', 'schema', 'src', 'templates', 'ios-26-apple.ts')
  },
  {
    schema: kiskadeeSchema,
    segments: kiskadeeSegments,
    templatePath: resolve(__dirname, '..', '..', 'schema', 'src', 'templates', 'ios-26-kiskadee.ts')
  }
];

const baseBuildDir = resolve(__dirname, '..', '..', 'build');

(async () => {
  for (const t of templates) {
    const { schema, segments } = t as any;
    const templatePath = (t as any).templatePath as string;

    // Phase 1 - Convert Element Schema to Style Keys
    const { styleKeys, toneMetadata } = convertElementSchemaToStyleKeys(schema);
    console.log('phase 1', { name: schema.name, styleKeys: JSON.stringify(styleKeys, null, 2) });

    // Phase 2 - Map style key usage
    const styleKeyUsage: StyleKeyUsageMap = mapStyleKeyUsage(styleKeys);
    console.log('phase  2', { name: schema.name, styleKeyUsage });

    // Phase 3 - Shorten class names
    const shortenCssClassNameMap: ShortenCssClassNames = shortenCssClassNames(styleKeyUsage);
    console.log('phase 3', { name: schema.name, shortenCssClassNameMap });

    // Phase 4 - Generate CSS split
    const cssGenerated = await generateCssSplit(styleKeys, shortenCssClassNameMap, true);
    console.log('phase 4', { name: schema.name, cssGenerated });

    // Phase 5 - Generate class names map split
    const classNamesMapSplit: ComponentClassNameMapSplit = generateClassNamesMapSplit(
      styleKeys,
      shortenCssClassNameMap,
      toneMetadata
    );
    console.log('phrase 5', { name: schema.name, classNamesMapSplit });

    // Compute out dir
    const major = Array.isArray(schema.version) ? schema.version[0] : (schema.version as any);
    const outDirSlug = `${slugifyName(schema.name)}-${major}-${slugifyName(schema.author || '')}`;

    // Phase 6 - Persist CSS & maps
    await persistBuildArtifacts(cssGenerated, classNamesMapSplit, outDirSlug);

    // Phase 7 - Publish manifest + raw schema/segments
    await publishMetadata({
      schema,
      segments,
      outDirSlug,
      templatePath,
      baseBuildDir
    });
  }
})();
