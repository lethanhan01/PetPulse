import { BrowserRouter } from "react-router";
import { AppRouter } from "@/router";
import { AppProvider } from "@/stores/app.store";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return <BrowserRouter><AppProvider><AppRouter /><Toaster /></AppProvider></BrowserRouter>;
}
