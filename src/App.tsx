import { BrowserRouter } from "react-router";
import { AppRouter } from "@/router";
import { AppProvider } from "@/stores/app.store";
import { Toaster } from "@/components/ui/sonner";
import { CursorEffect } from "@/components/common/CursorEffect";

export default function App() {
  return <BrowserRouter><AppProvider><CursorEffect /><AppRouter /><Toaster /></AppProvider></BrowserRouter>;
}
