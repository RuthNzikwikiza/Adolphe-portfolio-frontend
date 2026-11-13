import type { Project } from '../api';

type ProjectCardProps = { project: Project };

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project">
      {project.image ? (
        <img src={project.image} alt={project.image_alt} loading="lazy" />
      ) : (
        <div className="photo-placeholder">No photo yet</div>
      )}
      <div className="project-body">
        <h2>
          {project.title} <span>({project.year})</span>
        </h2>
        {project.description && <p>{project.description}</p>}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            Visit project
          </a>
        )}
      </div>
    </article>
  );
}
