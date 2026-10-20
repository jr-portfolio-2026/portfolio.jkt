import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProjectPage } from "@/components/projects/ProjectPage";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    return pageHead({
      title: `${loaderData.name} — case study · ${site.name}`,
      description: loaderData.summary,
      path: `/work/${params.slug}/`,
      type: "article",
    });
  },
  component: ProjectRoute,
});

function ProjectRoute() {
  return <ProjectPage project={Route.useLoaderData()} />;
}
