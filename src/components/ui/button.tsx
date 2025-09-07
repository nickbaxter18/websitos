import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const buttonVariants = {
  default: "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/30",
  outline: "border border-slate-600 text-slate-300 hover:bg-slate-800/40 hover:text-white",
  ghost: "text-slate-300 hover:bg-slate-800/40",
};

const buttonSizes = {
  default: "px-6 py-3 text-base rounded-xl",
  sm: "px-3 py-1.5 text-sm rounded-lg",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
