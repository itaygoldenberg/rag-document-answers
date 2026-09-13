import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Ask } from "./components/ask-area/ask";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Ask />
    </StrictMode>
);