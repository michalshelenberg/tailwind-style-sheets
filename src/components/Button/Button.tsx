import { twcn } from "tailwind-style-sheets";
import styles from "./Button.styles.twss";
import type { ButtonProps } from "./Button.types";

const cn = twcn(styles);

export function Button(props: ButtonProps) {
  const { variant = "primary", className, children, ...restProps } = props;

  return (
    <button {...restProps} className={cn("button", `button--${variant}`, className)}>
      {children}
    </button>
  );
}
