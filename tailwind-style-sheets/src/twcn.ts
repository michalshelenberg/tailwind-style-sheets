import { modcn } from "modcn";
import { twMerge } from "tailwind-merge";

type StylesMap = Record<string, string>;

export function twcn(styles: StylesMap) {
  const cn = modcn(styles);
  return (...inputs: Parameters<ReturnType<typeof modcn>>) =>
    twMerge(cn(...inputs));
}
