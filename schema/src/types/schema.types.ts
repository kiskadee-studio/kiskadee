// TODO: delete it?

//type ButtonStyleVariantKeys = 'filled' | 'outlined' | 'flat';

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
