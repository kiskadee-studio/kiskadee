import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function majorVersionFromTuple(v: [number, number, number] | number[]): number {
  return Array.isArray(v) && v.length > 0 ? Number(v[0]) : 0;
}

function firstSegmentLabel(segmentsObj: any): string | null {
  const keys = segmentsObj ? Object.keys(segmentsObj) : [];
  if (!keys.length) return null;
  const first = segmentsObj[keys[0]];
  return first?.name || keys[0] || null;
}

function computeDisplayName(schema: any, segmentsObj: any): string {
  const author = schema?.author || '';
  const segName = firstSegmentLabel(segmentsObj) || schema?.name || '';
  const major = majorVersionFromTuple(schema?.version || []);
  const left = [segName, major && String(major)].filter(Boolean).join(' ').trim();
  return [left, author && `by ${author}`].filter(Boolean).join(' ').trim();
}

function discoverSegmentsThemes(segmentsObj: any): {
  segments: string[];
  themes: Record<string, string[]>;
} {
  const segments: string[] = [];
  const themes: Record<string, string[]> = {};
  if (!segmentsObj) return { segments, themes };
  for (const segKey of Object.keys(segmentsObj)) {
    segments.push(segKey);
    const seg = segmentsObj[segKey];
    const themeNames = seg?.themes ? Object.keys(seg.themes) : [];
    themes[segKey] = themeNames;
  }
  return { segments, themes };
}

export async function publishMetadata(params: {
  schema: any;
  segments: any;
  outDirSlug: string;
  templatePath: string;
  baseBuildDir: string;
}): Promise<void> {
  const { schema, segments, outDirSlug, templatePath, baseBuildDir } = params;

  // Build manifest content
  const displayName = computeDisplayName(schema, segments);
  const { segments: segKeys, themes } = discoverSegmentsThemes(segments);
  const manifest = {
    key: outDirSlug,
    displayName,
    author: schema?.author ?? null,
    schemaName: schema?.name ?? null,
    version: schema?.version ?? null,
    segments: segKeys,
    themes
  };

  const buildDir = resolve(baseBuildDir, outDirSlug);
  await mkdir(buildDir, { recursive: true });

  // Write metadata files
  await writeFile(resolve(buildDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  await writeFile(resolve(buildDir, 'schema.json'), JSON.stringify(schema, null, 2), 'utf8');
  await writeFile(resolve(buildDir, 'segments.json'), JSON.stringify(segments, null, 2), 'utf8');

  // Optional: copy original template TS for inspection
  try {
    await copyFile(templatePath, resolve(buildDir, 'schema.source.ts'));
  } catch (e) {
    console.warn('[web-builder] Failed to copy schema.source.ts for', manifest.key, e);
  }

  console.log('[web-builder] Phase 7: metadata published to', buildDir);
}
