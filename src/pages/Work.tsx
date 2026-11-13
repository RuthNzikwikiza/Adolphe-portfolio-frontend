import { getProjects } from '../api';
import ProjectCard from '../components/ProjectCard';
import { useFetch } from '../useFetch';

export default function Work() {
  const { data: projects, error } = useFetch(getProjects);

  if (error) return <p role="alert">{error}</p>;
  if (!projects) return <p>Loading...</p>;

  return (
    <section className="work">
      <h1>Work</h1>
      <p>Projects and ventures.</p>

      {projects.length === 0 ? (
        <p>No projects have been added yet.</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
