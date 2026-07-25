import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useApp } from "@/stores/app.store";

export function Toaster(props: ToasterProps) {
  const { theme } = useApp();
  return (
    <Sonner
      theme={theme === "dark" ? "dark" : "light"}
      position="bottom-right"
      richColors
      className="toaster group"
      toastOptions={{
        duration: 4000,
        style: { fontFamily: "var(--font-sans)" },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--success-surface)",
          "--success-text": "var(--success)",
          "--success-border": "var(--success-border)",
          "--error-bg": "var(--destructive)",
          "--error-text": "white",
          "--error-border": "transparent",
          "--info-bg": "var(--info-surface)",
          "--info-text": "var(--info)",
          "--info-border": "var(--info-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
