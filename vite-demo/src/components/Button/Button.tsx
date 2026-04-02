import { twcn } from "tailwind-style-sheets";
import styles from "./Button.styles.twss";

const cn = twcn(styles);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn("button", `button--${variant}`, className)}>
      {children}
    </button>
  );
}
