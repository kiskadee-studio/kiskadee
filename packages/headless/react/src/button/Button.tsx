import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { classNameCssPseudoSelector } from '@kiskadee/schema';

export type ButtonStatus = keyof typeof classNameCssPseudoSelector;

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
  /**
   * Force a visual interaction state by appending the corresponding Kiskadee class suffix
   * to the root element (e1). Also maps to native attributes when applicable.
   * Supported values come from classNameCssPseudoSelector (e.g., 'hover', 'pressed', 'selected',
   * 'focus', 'disabled', 'pseudoDisabled', 'readOnly').
   */
  status?: ButtonStatus;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/**
 * Headless Button component focused on semantics and accessibility, without styles.
 * - Uses the native <button> element for correct semantics and keyboard handling.
 * - Supports optional icon and label content.
 * - Exposes compact classNames mapping (e1 root, e2 label, e3 icon) to integrate with styled wrappers.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { classNames, label, icon, type = 'button', ariaPressed, disabled, status, ...rest },
  ref
) {
  const forcedSuffix = status ? classNameCssPseudoSelector[status] : '';
  const rootClass = `${classNames?.e1 ?? ''} ${forcedSuffix}`.trim();

  // Map status to native attributes when applicable
  const isDisabled = disabled ?? (status === 'disabled' ? true : undefined);
  const ariaDisabled = rest['aria-disabled'] ?? (status === 'pseudoDisabled' ? true : undefined);
  const ariaReadonly = rest['aria-readonly'] ?? (status === 'readOnly' ? true : undefined);

  // If consumer did not provide ariaPressed, infer for selected state
  const inferredAriaPressed =
    ariaPressed !== undefined ? ariaPressed : status === 'selected' ? true : undefined;

  return (
    // Element e1 — Root button element (button)
    <button
      {...rest}
      ref={ref}
      type={type}
      className={rootClass}
      aria-pressed={inferredAriaPressed}
      aria-disabled={ariaDisabled}
      aria-readonly={ariaReadonly}
      disabled={isDisabled}
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
