import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type ButtonProps = {
  /**
   * Class names by compact element keys for styling integration.
   * - e1: Root button element (button)
   * - e2: Label text wrapper (span)
   * - e3: Icon wrapper (span)
   */
  classNames?: Partial<Record<'e1' | 'e2' | 'e3', string>>;
  /** Optional visual label (text). If omitted, ensure the button is still accessible (aria-label). */
  label?: ReactNode;
  /** Optional icon element. Rendered before the label by default. */
  icon?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/**
 * Headless Button component focused on semantics and accessibility, without styles.
 * - Uses the native <button> element for correct semantics and keyboard handling.
 * - Supports optional icon and label content.
 * - Exposes compact classNames mapping (e1 root, e2 label, e3 icon) to integrate with styled wrappers.
 * - Accepts native attributes like disabled and ARIA props (aria-pressed, aria-disabled) directly.
 * - Element e2 (label wrapper) is always rendered as its own tag when a label is provided.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { classNames: { e1, e2, e3 } = {}, label, icon, type = 'button', ...rest },
  ref
) {
  return (
    // Element e1 — Root button element (button)
    <button {...rest} ref={ref} type={type} className={e1}>
      {!!icon && (
        // Element e3 — Icon wrapper (span)
        <span className={e3} aria-hidden={true}>
          {icon}
        </span>
      )}
      {!!label && (
        // Element e2 — Label text wrapper (span) (always rendered when label exists)
        <span className={e2}>{label}</span>
      )}
    </button>
  );
});

export default Button;
