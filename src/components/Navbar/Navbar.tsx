import type { ReactNode } from "react";

export function Navbar({ children }: { children: ReactNode }) {
  return <header className="fixed inset-x-0 top-0 z-50 h-16 flex items-center">{children}</header>;
}
