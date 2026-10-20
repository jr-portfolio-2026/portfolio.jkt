import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { navState } from "./lib/navigation";
import { createAppRouter } from "./router";
import "./styles.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root was not found.");

// The HTML in #root is the prerendered page (for crawlers and no-JS visitors);
// the client app replaces it rather than hydrating it, so the intro state can never mismatch.
const router = createAppRouter();
router.subscribe("onBeforeNavigate", () => {
  navState.navigated = true;
});

createRoot(container).render(
  <StrictMode>
    <App router={router} />
  </StrictMode>,
);
