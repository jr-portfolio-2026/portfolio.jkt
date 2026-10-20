import { RouterProvider } from "@tanstack/react-router";
import type { createAppRouter } from "./router";

/** Application shell: the router is the only thing mounted. Pages live in src/routes. */
export default function App({ router }: { router: ReturnType<typeof createAppRouter> }) {
  return <RouterProvider router={router} />;
}
