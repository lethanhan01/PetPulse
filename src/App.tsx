import { BrowserRouter } from "react-router";
import { AppRouter } from "@/router";
import { AppProvider } from "@/stores/app.store";

export default function App() {
  return <BrowserRouter><AppProvider><AppRouter /></AppProvider></BrowserRouter>;
}
