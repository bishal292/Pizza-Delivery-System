import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { useAppStore } from "./Store/store";
import { Toaster } from "sonner";
import { SocketProvider } from "./Context/SocketContext";

if (import.meta.env.NODE_ENV !== "production") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Suppress React Router warnings
    if (args[0] && args[0].includes("")) {
      return;
    }
    originalWarn(...args);
  };
}
const AppTheme = () => {
  const { theme, setTheme } = useAppStore();
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
};

createRoot(document.getElementById("root")).render(
  <>
    {/* <StrictMode> */}
    <SocketProvider>

      <Toaster closeButton />
      <AppTheme />
      <App />
    </SocketProvider>
    {/* </StrictMode> */}
    ,
  </>
);
