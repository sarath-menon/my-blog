import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { PROJECTS, ProjectInfo } from "@/config/projects";

export default async function ProjectPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Projects
          </h1>
          <p className="text-xl text-muted-foreground">
            Musings on AI and Robotics
          </p>
        </div>
      </div>
      <hr className="my-8" />

        <div className="grid gap-12 sm:grid-flow-row">
          {PROJECTS.map((project: ProjectInfo) => (
            <article
              key={project.title}
              className="group relative flex flex-col "
            >
              <div className="cursor-pointer space-y-2">
                <span className="text-3xl font-semibold" >{project.title}</span>

                {project.description && (
                  <p className="text-muted-foreground text-lg">{project.description}</p>
                )}

                {project.date && (
                  <p className="text-sm text-muted-foreground">
                    {formatDate(project.date)}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
    </div>
  );
}
