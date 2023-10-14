import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  secondary?: boolean;
} & ComponentPropsWithoutRef<"button">;

const Button = ({ children, secondary, ...props }: Props) => (
  <button
    type="button"
    className={twMerge(
      "rounded-md px-3 py-2 text-sm font-semibold shadow-sm",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
      "disabled:cursor-not-allowed",
      secondary
        ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:text-indigo-300"
        : "bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-300",
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
