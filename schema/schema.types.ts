export type SizeKeys =
  | 'all' // 0
  | 'sm1' // 320px
  | 'sm2' // 360px - Must have
  | 'sm3' // 400px
  | 'md1' // 568px
  | 'md2' // 768px - Nice to have
  | 'md3' // 1024px
  | 'lg1' // 1152px - Must have
  | 'lg2' // 1312px
  | 'lg3' // 1792px
  | 'lg4'; // 2432px;

type DimensionValue = number; // px

// "all" property is required since it's the default value
type ResponsiveDimensionValues = { all: DimensionValue } & Partial<
  Record<Exclude<SizeKeys, 'all'>, DimensionValue>
>;

type DimensionsProperties = {
  fontSize?: ResponsiveDimensionValues | DimensionValue;
  paddingTop?: ResponsiveDimensionValues | DimensionValue;
  paddingRight?: ResponsiveDimensionValues | DimensionValue;
  paddingBottom?: ResponsiveDimensionValues | DimensionValue;
  paddingLeft?: ResponsiveDimensionValues | DimensionValue;
  marginTop?: ResponsiveDimensionValues | DimensionValue;
  marginRight?: ResponsiveDimensionValues | DimensionValue;
  marginBottom?: ResponsiveDimensionValues | DimensionValue;
  marginLeft?: ResponsiveDimensionValues | DimensionValue;
  height?: ResponsiveDimensionValues | DimensionValue;
  width?: ResponsiveDimensionValues | DimensionValue;
  borderWidth?: ResponsiveDimensionValues | DimensionValue;
  borderRadius?: ResponsiveDimensionValues | DimensionValue;
  lineHeight?: ResponsiveDimensionValues | DimensionValue;
};

type ColorVariantKeys =
  // "primary" is the main color of the brand
  | 'primary'
  // "secondary" is the secondary color of the brand
  | 'secondary'
  // "tertiary" is the third color of the brand
  | 'tertiary'
  // "danger" is the color used to indicate errors or destructive actions
  | 'danger'
  // "warning" is the color used to indicate warnings or caution
  | 'warning'
  // "success" is the color used to indicate success or positive actions
  | 'success'
  // "info" is the color used to indicate information or neutral actions
  | 'info';

type ButtonStyleVariantKeys = 'filled' | 'outlined' | 'flat';

type InteractionStateKeys =
  // "rest" is the default state without any interaction
  | 'rest'

  // [Desktop] "hover" is when the user hovers over the element with a mouse
  | 'hover'

  // "pressed" is when the user presses (clicks or taps) the element
  | 'pressed'

  // "selected" is when the element is selected, checked, or activated
  | 'selected'

  // "focus" is when the element is focused
  | 'focus'

  // "disabled" is when the user can't interact with the element
  | 'disabled'

  // "read-only" is when the user can't modify the element's value
  | 'read-only';

// | 'indeterminate'
// | 'valid'
// | 'invalid'
// | 'visited'
// | 'required'
// | 'optional'
// | 'expanded'
// | 'collapsed'
// | 'pressed'
// | 'dragged'
// | 'dropzone'
// | 'loading'
// | 'progress'
// | 'pending'
// | 'error';

type SocialVariantKeys =
  // Text
  | 'x'
  | 'reddit'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  // Image
  | 'pinterest'
  // Video
  | 'youtube'
  | 'tiktok'
  | 'snapchat'
  | 'twitch'
  // Chats
  | 'whatsapp'
  | 'telegram'
  // Music
  | 'spotify'
  | 'soundcloud'
  // Code
  | 'github'
  | 'gitlab';

type AppearanceProperties = {
  fontStyle?:
    | 'normal' // default
    | 'italic';
  fontWeight?:
    | 'thin'
    | 'extra-light'
    | 'light'
    | 'normal' // default
    | 'medium'
    | 'semi-bold'
    | 'bold'
    | 'extra-bold'
    | 'black';
  textDecoration?:
    | 'none' // default
    | 'underline'
    | 'line-through';
  borderStyle?:
    | 'none' // default
    | 'dotted'
    | 'dashed'
    | 'solid';
  cursor?:
    | 'auto'
    | 'default'
    | 'none'
    | 'context-menu'
    | 'help'
    | 'pointer'
    | 'progress'
    | 'wait'
    | 'cell'
    | 'crosshair'
    | 'text'
    | 'vertical-text'
    | 'alias'
    | 'copy'
    | 'move'
    | 'no-drop'
    | 'not-allowed'
    | 'grab'
    | 'grabbing'
    | 'all-scroll'
    | 'col-resize'
    | 'row-resize'
    | 'n-resize'
    | 'e-resize'
    | 's-resize'
    | 'w-resize'
    | 'ne-resize'
    | 'nw-resize'
    | 'se-resize'
    | 'sw-resize'
    | 'ew-resize'
    | 'ns-resize'
    | 'nesw-resize'
    | 'nwse-resize'
    | 'zoom-in'
    | 'zoom-out';
};
