type BreakpointProperties =
  | 'all' //     0px - Must have
  | 'sm1' //   320px
  | 'sm2' //   360px
  | 'sm3' //   400px
  | 'md1' //   568px
  | 'md2' //   768px - Nice to have
  | 'md3' //  1024px
  | 'lg1' //  1152px - Must have
  | 'lg2' //  1312px
  | 'lg3' //  1792px
  | 'lg4'; // 2432px

type SizeProperties =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md' // Default / Must have
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl';

type DimensionValue = number; // px

// "all" property is required since it's the default value
type BreakpointValues = { all: DimensionValue } & Partial<
  Record<Exclude<BreakpointProperties, 'all'>, DimensionValue>
>;

type DimensionProperties =
  // Text
  | 'fontSize'
  | 'lineHeight'

  // Padding
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'

  // Margin
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'

  // Size
  | 'height'
  | 'width'

  // Border
  | 'borderWidth'
  | 'borderRadius';

type Breakpoints = Partial<Record<SizeProperties, DimensionValue | BreakpointValues>>;

export type Dimensions = Partial<Record<DimensionProperties, DimensionValue | Breakpoints>>;
