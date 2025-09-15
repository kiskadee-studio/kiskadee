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
  /** Controls the pressed/toggle state accessibility if this is a toggle button. */
  ariaPressed?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/**
 * Headless Button component focused on semantics and accessibility, without styles.
 * - Uses the native <button> element for correct semantics and keyboard handling.
 * - Supports optional icon and label content.
 * - Exposes compact classNames mapping (e1 root, e2 label, e3 icon) to integrate with styled wrappers.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { classNames, label, icon, type = 'button', ariaPressed, disabled, ...rest },
  ref
) {
  return (
    // Element e1 — Root button element (button)
    <button
      {...rest}
      ref={ref}
      type={type}
      className={classNames?.e1}
      aria-pressed={ariaPressed}
      disabled={disabled}
    >
      {icon ? (
        // Element e3 — Icon wrapper (span)
        <span className={classNames?.e3} aria-hidden={true}>
          {icon}
        </span>
      ) : null}
      {label !== undefined ? (
        // Element e2 — Label text wrapper (span)
        <span className={classNames?.e2}>{label}</span>
      ) : null}
    </button>
  );
});

export default Button;
