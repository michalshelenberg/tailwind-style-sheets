import { clsxModule } from "@michalshelenberg/clsx-module";
import styles from "./Badge.styles.twss";
import type { BadgeProps } from "./Badge.types";

const clsx = clsxModule(styles);

export function Badge(props: BadgeProps) {
  const { variant = "default", className, children, ...restProps } = props;
  
  return (
    <span {...restProps} className={clsx("badge", `badge--${variant}`, className)}>
      {children}
    </span>
  );
}
