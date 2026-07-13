import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../tokens.css";
import "../components.css";
import { Gallery } from "./Gallery";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);
