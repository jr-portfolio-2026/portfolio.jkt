import type { Project } from "@/content/projects";

/**
 * The visual for a project. A real `cover` image wins; otherwise a typographic plate is drawn
 * (a mark on a ruled sheet) so nothing pretends to be a screenshot that does not exist.
 */
export function ProjectPlate({ project, index, className = "" }: { project: Project; index: number; className?: string }) {
  if (project.cover) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={`${import.meta.env.BASE_URL}${project.cover.src}`} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} loading="lazy" decoding="async" className="size-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`dossier-visual relative overflow-hidden ${className}`} role="img" aria-label={`${project.name}: typographic plate, no screenshot available`}>
      <div className="dossier-grid absolute inset-0 opacity-70" aria-hidden />
      <span aria-hidden className="absolute bottom-2 right-5 select-none font-serif text-[9rem] font-light leading-none text-navy/[0.09] md:text-[14rem]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span aria-hidden className="absolute left-6 top-1/2 -translate-y-1/2 select-none font-serif text-[clamp(5rem,14vw,11rem)] font-light leading-none text-navy/[0.55]">
        {project.mark}
      </span>
    </div>
  );
}
