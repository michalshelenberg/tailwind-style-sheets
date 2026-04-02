import { twcn } from "tailwind-style-sheets";
import styles from "./Badge.styles.twss";
import type { BadgeProps } from "./Badge.types";

const cn = twcn(styles);

export function Badge(props: BadgeProps) {
  const { variant = "default", className, children, ...restProps } = props;
  
  return (
    <span {...restProps} className={cn("badge", `badge--${variant}`, className)}>
      {children}
    </span>
  );
}
