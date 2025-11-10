'use client';
import type { ComponentClassNameMapJSON, ThemeMode } from '@kiskadee/core';
import { KiskadeeContext } from '@kiskadee/react-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cssPaths } from './(data)/css.registry';
import { coreMaps, paletteIndex, paletteMaps } from './(data)/templates.registry';

// Client-side provider that mirrors legacy App.tsx/main.tsx responsibilities
// Loads classNames maps (core + palette) via dynamic import (no fetch) and injects CSS served from /public/build.

type TemplateKey = keyof typeof coreMaps;

const DEFAULT_TEMPLATE =
  (Object.keys(coreMaps)[0] as TemplateKey) ?? ('ios-26-apple' as TemplateKey);
const DEFAULT_SEGMENT = 'ios';
const DEFAULT_THEME: ThemeMode = 'light';

function removeStylesheet(prevHrefRef: React.MutableRefObject<string | null>) {
  if (typeof document === 'undefined') return;
  const prev = prevHrefRef.current;
  if (!prev) return;
  const el = document.querySelector(`link[rel="stylesheet"][href="${prev}"]`);
  if (el?.parentNode) el.parentNode.removeChild(el);
  prevHrefRef.current = null;
}

function ensureStylesheet(
  href: string | null | undefined,
  prevHrefRef: React.MutableRefObject<string | null>
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return resolve();

    // If no new stylesheet is provided, remove the previous one explicitly
    if (!href) {
      removeStylesheet(prevHrefRef);
      return resolve();
    }

    // If the same href is already active, resolve fast
    if (prevHrefRef.current === href) {
      const existing = document.querySelector(
        `link[rel="stylesheet"][href="${href}"]`
      ) as HTMLLinkElement | null;
      if (existing?.sheet) return resolve();
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error(`CSS failed: ${href}`)));
        return;
      }
    }

    // Create new link first to avoid flash, then remove old when loaded
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => {
      // Remove old stylesheet if different
      if (prevHrefRef.current && prevHrefRef.current !== href) {
        const oldEl = document.querySelector(
          `link[rel="stylesheet"][href="${prevHrefRef.current}"]`
        );
        if (oldEl && oldEl.parentNode) oldEl.parentNode.removeChild(oldEl);
      }
      prevHrefRef.current = href;
      resolve();
    };
    link.onerror = () => reject(new Error(`CSS failed: ${href}`));
    document.head.appendChild(link);
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [template, _setTemplate] = useState<TemplateKey>(DEFAULT_TEMPLATE);
  const [segment, _setSegment] = useState<string>(DEFAULT_SEGMENT);
  const [theme, _setTheme] = useState<ThemeMode>(DEFAULT_THEME);
  const [classesMap, setClassesMap] = useState<ComponentClassNameMapJSON>({});

  // Track currently applied stylesheets to swap cleanly
  const coreHrefRef = useRef<string | null>(null);
  const paletteHrefRef = useRef<string | null>(null);
  const effectsHrefRef = useRef<string | null>(null);

  const templateKeys = useMemo(() => Object.keys(coreMaps) as string[], []);

  // Clamp segment/theme to what's available for a template
  const clampPair = useCallback((tpl: TemplateKey, seg: string, th: ThemeMode) => {
    const info = paletteIndex[tpl as keyof typeof paletteIndex];
    if (!info) return { seg: DEFAULT_SEGMENT, th: DEFAULT_THEME } as const;
    let nextSeg = seg;
    if (!info.segments.includes(nextSeg)) {
      nextSeg = info.segments[0];
    }
    const themes = (info.themesBySegment as Record<string, ThemeMode[]>)[nextSeg] ?? [];
    let nextTh = th;
    if (!themes.includes(nextTh)) {
      nextTh = (themes[0] ?? 'light') as ThemeMode;
    }
    return { seg: nextSeg, th: nextTh } as const;
  }, []);

  const availableSegments = useMemo(
    () => paletteIndex[template]?.segments ?? [DEFAULT_SEGMENT],
    [template]
  );
  const availableThemes = useMemo(
    () => (paletteIndex[template]?.themesBySegment?.[segment] ?? ['light']) as ThemeMode[],
    [template, segment]
  );

  const setTemplate = useCallback(
    (v: string) => {
      const tpl = v as TemplateKey;
      const { seg, th } = clampPair(tpl, segment, theme);
      _setTemplate(tpl);
      _setSegment(seg);
      _setTheme(th);
    },
    [segment, theme, clampPair]
  );

  const setSegment = useCallback(
    (v: string) => {
      const { th } = clampPair(template, v, theme);
      _setSegment(v);
      _setTheme(th);
    },
    [template, theme, clampPair]
  );

  const setTheme = useCallback(
    (v: ThemeMode) => {
      const { seg, th } = clampPair(template, segment, v);
      _setSegment(seg);
      _setTheme(th);
    },
    [template, segment, clampPair]
  );

  const templateMeta = useMemo(() => ({}) as Record<string, { displayName?: string }>, []);

  const ensureLoaded = useCallback(async () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('no-transitions');
    }

    // Load core map via dynamic import registry (guard if not registered)
    let core: any = {};
    const coreLoader = coreMaps[template];
    if (coreLoader) {
      const coreMod = await coreLoader();
      core = (coreMod as any).default ?? coreMod;
    }

    // Load palette map if exists for current segment/theme
    const key = `${String(template)}|${segment}|${theme}` as keyof typeof paletteMaps;
    let palette: any = {};
    const loader = paletteMaps[key];
    if (loader) {
      const palMod = await loader();
      palette = (palMod as any).default ?? palMod;
    }

    // Deep merge: preserve core baseline (d/e/s) and overlay palette colors (c) and selected (cs)
    const mergeMaps = (coreMap: any, paletteMap: any): ComponentClassNameMapJSON => {
      const out: any = {};
      const compKeys = new Set<string>([
        ...Object.keys(coreMap || {}),
        ...Object.keys(paletteMap || {})
      ]);
      for (const comp of compKeys) {
        const cComp = coreMap?.[comp] ?? {};
        const pComp = paletteMap?.[comp] ?? {};
        const elKeys = new Set<string>([...Object.keys(cComp || {}), ...Object.keys(pComp || {})]);
        out[comp] = {};
        for (const el of elKeys) {
          const cEl = cComp?.[el] ?? {};
          const pEl = pComp?.[el] ?? {};
          // start from core element so we don't lose d/e/s/scales
          const mergedEl: any = { ...cEl };
          // colors: merge semantics, palette takes precedence per semantic key
          if (pEl.c) {
            mergedEl.c = { ...(cEl.c ?? {}), ...(pEl.c ?? {}) };
          }
          // selected state class from palette if provided
          if (pEl.cs) mergedEl.cs = pEl.cs;
          // if core didn't have d/e/s, allow palette to define them
          if (mergedEl.d === undefined && pEl.d !== undefined) mergedEl.d = pEl.d;
          if (mergedEl.e === undefined && pEl.e !== undefined) mergedEl.e = pEl.e;
          if (mergedEl.s === undefined && pEl.s !== undefined) mergedEl.s = pEl.s;
          out[comp][el] = mergedEl;
        }
      }
      return out as ComponentClassNameMapJSON;
    };

    const merged = mergeMaps(core ?? {}, palette ?? {});
    setClassesMap(merged);

    // Load CSS using the static css registry in deterministic order
    const cssEntry = cssPaths[String(template) as keyof typeof cssPaths];
    const cssCore = cssEntry?.core ?? null;
    const cssPalette = cssEntry?.palettes?.[`${segment}|${theme}`] ?? null;
    const cssEffects = cssEntry?.effects ?? null;

    try {
      // Core first
      await ensureStylesheet(cssCore, coreHrefRef);
      // Then palette (can override core selectors)
      await ensureStylesheet(cssPalette, paletteHrefRef);
      // Finally effects (shadows/animations)
      await ensureStylesheet(cssEffects, effectsHrefRef);
    } catch {
      // best-effort; ignore CSS load failures to avoid hard break
    }

    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('no-transitions');
    }
  }, [template, segment, theme]);

  useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);

  return (
    <KiskadeeContext.Provider
      value={{
        classesMap,
        segment,
        theme,
        setSegment,
        setTheme,
        template: String(template),
        setTemplate: (v) => setTemplate(v as TemplateKey),
        availableSegments,
        availableThemes,
        templateKeys,
        templateMeta
      }}
    >
      {children}
    </KiskadeeContext.Provider>
  );
}
