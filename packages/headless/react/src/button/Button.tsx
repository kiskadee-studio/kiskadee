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
 * - Optimization: when there is NO icon (e3), the label (e2) is merged into the root (e1):
 *   - e2 classes are appended to e1 and the label is rendered directly without an extra <span>.
 *   - When there IS an icon, the label continues to be wrapped in a <span> with e2 classes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { classNames, label, icon, type = 'button', ...rest },
  ref
) {
  const hasIcon = !!icon;
  // Element e1 — Root button element (button)
  // If there is no icon, unify e2 with e1 so we avoid an extra span for the label.
  const rootClass = `${classNames?.e1 ?? ''} ${!hasIcon ? (classNames?.e2 ?? '') : ''}`.trim();

  return (
    <button {...rest} ref={ref} type={type} className={rootClass}>
      {hasIcon ? (
        // Element e3 — Icon wrapper (span)
        <span className={classNames?.e3} aria-hidden={true}>
          {icon}
        </span>
      ) : null}

      {label !== undefined ? (
        hasIcon ? (
          // Element e2 — Label text wrapper (span) (only when the icon exists)
          <span className={classNames?.e2}>{label}</span>
        ) : (
          // When there is no icon, render the label directly (merged into e1)
          label
        )
      ) : null}
    </button>
  );
});

export default Button;
