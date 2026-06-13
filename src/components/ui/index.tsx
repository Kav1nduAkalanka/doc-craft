import React from "react";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

export const Button = React.forwardRef<HTMLButtonElement, any>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 active:scale-[0.98]";
  const variants: Record<string, string> = {
    default: "bg-brand-500 text-white hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
    outline: "border border-surface-700 bg-transparent hover:bg-surface-800 hover:border-surface-500 text-white",
  };
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    lg: "h-12 rounded-md px-8",
  };
  return <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />;
});

export const Input = React.forwardRef<HTMLInputElement, any>(({ className, ...props }, ref) => {
  return <input ref={ref} className={cn("flex h-12 w-full rounded-md border border-surface-700 bg-transparent px-3 py-2 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-surface-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]", className)} {...props} />;
});

export const Label = React.forwardRef<HTMLLabelElement, any>(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn("text-sm font-medium leading-none text-surface-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />;
});

export const Checkbox = React.forwardRef<HTMLInputElement, any>(({ className, ...props }, ref) => {
  return <input type="checkbox" ref={ref} className={cn("h-4 w-4 shrink-0 rounded-sm border border-surface-700 bg-transparent text-brand-500 accent-brand-500", className)} {...props} />;
});
