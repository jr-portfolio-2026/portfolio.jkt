import { Link, Outlet, createRootRoute, useMatches } from "@tanstack/react-router";
import { useEffect } from "react";
import { applyHead } from "@/lib/head";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  const matches = useMatches();
  // Keeps <title>, description, canonical and Open Graph in step with the current route.
  useEffect(() => {
    const meta = matches.flatMap((m) => (m.meta ?? []).filter(Boolean)) as Record<string, string>[];
    const links = matches.flatMap((m) => (m.links ?? []).filter(Boolean)) as Record<string, string>[];
    applyHead(meta, links);
  }, [matches]);
  return <Outlet />;
}

function NotFound() {
  useEffect(() => {
    document.title = "Page not found";
  }, []);
  return (
    <main id="main" className="paper-surface grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="meta-label">404</p>
        <h1 className="mt-4 font-serif text-5xl font-light text-relief">This page does not exist.</h1>
        <Link to="/" className="meta-label mt-8 inline-flex min-h-11 items-center border-b border-gold pb-1">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
