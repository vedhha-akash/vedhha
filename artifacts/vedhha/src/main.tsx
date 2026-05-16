import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (
  typeof window !== "undefined" &&
  window.location.hostname !== "vedhha.com" &&
  window.location.hostname !== "localhost" &&
  !window.location.hostname.includes("localhost")
) {
  window.location.replace(
    "https://vedhha.com" + window.location.pathname + window.location.search + window.location.hash
  );
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
