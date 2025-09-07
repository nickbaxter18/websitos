import * as React from "react";
import { cn } from "@/lib/utils";

// Props for Card
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-slate-700 bg-slate-800/60 shadow-lg", className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

// Props for CardContent
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("p-6", className)} {...props} />;
  }
);
CardContent.displayName = "CardContent";

export { Card, CardContent };
