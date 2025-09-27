# Kiskadee — Monorepo Overview

This repository hosts the core of Kiskadee: a pipeline that transforms a platform‑agnostic schema (visual identity) into utility CSS (one class per style) and a set of packages that compose components from that core.

Below you’ll find each package/project’s purpose, how they relate, and the artifacts produced.

## Packages and responsibilities

- packages/schema
  - What it is: the platform‑agnostic design schema. It defines essential visual identity tokens organized by component/element: palettes (colors), decorations, scales (spacing/typography), and effects.
  - What it is NOT: it does not contain platform resets (e.g., HTML widget fixes) nor structural/behavioral rules for components (layout, positioning). It also does not contain CSS — only data (plus schema utilities/types).
  - Examples:
    - templates (e.g., google-material-design, template-1, template-2) — schema sources that can be plugged into the Web builder.
    - types — types for colors, decorations, etc.

- packages/web-builder
  - What it is: the pipeline that converts the schema into utility CSS and class maps for runtime consumption. It is Web‑specific in terms of output (CSS), but it does not contain resets/component structure.
  - Main outputs:
    - Core CSS (decoration/scale/effects that do not depend on a palette)
    - Per‑palette CSS (colors only)
    - Class name maps per component/element/state: classNamesMapSplit
  - Where the pipeline lives: src/index.ts organizes phases 1–6.
  - What it is NOT: it does not apply Web normalize/reset, nor define component layout/structure.

- packages/headless
  - What it is: headless (agnostic) components — logic and accessibility, no styling. E.g., Tabs, Button behavior, etc., without CSS.
  - What it is NOT: it does not apply visual identity or visual structure; it is meant to be styled/structured by the consumer (e.g., packages/components).

- packages/components
  - What it is: composition of visual components for the Web, combining:
    - the utility CSS and class map from packages/web-builder;
    - the logic/accessibility from packages/headless;
    - local CSS Modules for minimal structure and any component‑specific resets (when needed).
  - Recommendations:
    - Prefer CSS Modules with compose to reuse generated utilities (avoids CSS duplication).
    - Keep structural adjustments here (display, flex/grid, hit area), leaving visual identity to the generated utility CSS.

Optional external (not included in web-builder by architectural decision):
- @kiskadee/web-base (suggested)
  - Small normalize/reset package and HTML widget fixes (e.g., remove the default ugly <button> border). It’s opt‑in and keeps the schema and the builder free of platform concerns.

## Web‑builder pipeline (Phases)

Location: packages/web-builder/src/index.ts

1) Phase 1 — Convert schema to style keys
   - Function: convertElementSchemaToStyleKeys(schema)
   - Produces normalized “style keys” per component/element.

2) Phase 2 — Map style key usage
   - Function: mapStyleKeyUsage(styleKeys)
   - Optimization: collects frequency/usage to shorten class names.

3) Phase 3 — Shorten class names
   - Function: shortenCssClassNames(usageMap)
   - Produces a dictionary of short classNames per styleKey.

4) Phase 4 — Generate CSS rules (split core vs palettes)
   - Function: generateCssSplit(styleKeys, shortenMap)
   - For colors (palettes), use transformColorKeyToCss with forceState=true to build state selectors.
   - Results: coreCss and palettes[paletteName].

5) Phase 5 — Generate classNamesMap split
   - Function: generateClassNamesMapSplit(styleKeys, shortenMap)
   - Produces the class map per component/element/palette/state for runtime usage.

6) Phase 6 — Persist artifacts
   - Function: persistBuildArtifacts(cssGenerated, classNamesMapSplit, schema.name)
   - Writes CSS bundles and maps to disk (organized by palette and core).

## Style key and interaction state conventions

- Inline keys (——)
  - Format: property--state__[…HSLA]
  - Affect the element itself: generate selectors like .{class} with combinations of native pseudo‑classes and/or forced classes.

- Reference keys (==)
  - Format: property==state__[…HSLA]
  - The state lives on the “parent” and the style applies to the “child” .{class}. Generates selectors with the parent on the left and the child class on the right.

- Interaction states → selectors
  - Native pseudos: hover, focus, pressed (as mapped in InteractionStateCssPseudoSelector).
  - Forced classes (classNameCssPseudoSelector): suffixes like -h (hover), -f (focus), -p (pressed), -s (selected), -d (disabled).
  - Activator class: -a (activator). Ensures forced styles only apply when explicitly activated.

- Generation rules (summary)
  - Inline
    - With native pseudos: native selector does NOT include -a; it includes non‑native state markers (e.g., -s for selected) when relevant.
    - Forced: includes ALL forced classes of the involved states and ALWAYS includes -a. Example: .abc.-s.-h.-a
  - Reference (parent → child)
    - Native (only emit when there’s at least one native pseudo): always includes -a on the parent, applies pseudos on the parent and adds non‑native state classes; selects the child .{class}. Example: .-a:hover.-s .abc
    - Forced: parent with -a and all forced classes; selects the child. Example: .-a.-s.-h .abc
  - Disabled state: always can generate a forced variant with -d and -a; avoid duplicating the native branch when only non‑native states exist.

## Generated artifacts

- Core CSS: utilities for decorations/scales/effects (palette‑independent).
- Per‑palette CSS: color rules only.
- classNamesMapSplit: structure to apply the correct classes per component/element/state/palette at runtime.

## Architecture guidelines

- schema is agnostic: visual identity only. No Web reset/normalize, no component layout/structure.
- web-builder generates utilities and maps: no structural rules or platform resets.
- headless provides accessibility and behavior, with no required CSS.
- components composes everything for the Web: minimal structure via CSS Modules and visual identity via generated utilities. It may optionally consume a Web base/reset package (outside the builder).

## Typical usage (high level)

1) Choose a schema template (e.g., google-material-design) and run the web-builder to generate CSS bundles and classNamesMapSplit.
2) In the components package, import the required bundles (core + palette) and compose classes in the markup using classNamesMapSplit together with the component’s interaction states (headless).
3) Add minimal structure with CSS Modules (display, direction, alignment), preferring compose to reuse utilities.
4) Optional: apply a Web baseline/reset (e.g., @kiskadee/web-base) in the app or in the components package.

## Useful reference files

- packages/web-builder/src/index.ts — orchestrates the pipeline phases.
- packages/web-builder/src/phase-4-convert-style-keys-to-css-rules/palettes/transformColorKeyToCss.ts — selector generation rules by state (inline and reference).
- packages/web-builder/src/phase-4-convert-style-keys-to-css-rules/generateCssSplit.ts — composition of the core vs palettes split.
- packages/web-builder/src/phase-5-generate-class-names-map/generateClassNamesMap.ts — generation of classNamesMapSplit.
- packages/schema/src/templates/* — example schemas.

## Future and extensions

- Optional @kiskadee/web-base package for Web baseline/reset.
- Tree‑shakeable generation of structural primitives (if adopted in the components package).
- New platforms (Android/iOS/Flutter/React Native) can reuse the schema; the Web builder remains focused on CSS.
