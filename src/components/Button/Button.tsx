import clsx from "clsx";
import styles from "./Button.styles.twss";
import type { ButtonProps } from "./Button.types";

export function Button(props: ButtonProps) {
  const { className, children, ...restProps } = props;

  return (
    <button {...restProps} className={clsx(styles.button, className)}>
      {children}
    </button>
  );
}
