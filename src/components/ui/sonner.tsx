import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useApp } from "@/stores/app.store";

export function Toaster(props: ToasterProps) {
  const { theme } = useApp();
  return (
    <Sonner
      theme={theme === "dark" ? "dark" : "light"}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
      {...props}
    />
  );
}
