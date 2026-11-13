import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getHome } from '../api';
import type { HomeContent } from '../api';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function Home() {
  const [home, setHome] = useState<HomeContent | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getHome()
      .then(setHome)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not load the page.');
      });
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!home) return <p>Loading...</p>;

  const paragraphs = home.intro_text.split(/\n\s*\n/).filter((text) => text.trim() !== '');

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-chip">{home.tag}</p>
          <h1>{home.name}</h1>
          <p className="hero-sub">{home.eyebrow}</p>
          <div className="hero-actions">
            <Link to="/work" className="btn btn-primary">
              View my work
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </div>
        </div>

        <div className="hero-media">
          {home.hero_image ? (
            <img src={home.hero_image} alt={home.name} />
          ) : (
            <div className="hero-initials" aria-hidden="true">
              {initials(home.name)}
            </div>
          )}
        </div>
      </section>

      <section className="intro">
        <h2>{home.intro_heading}</h2>
        <div className="intro-body">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>

      <section className="featured">
        <h2 className="section-title">Featured project</h2>
        <article className="feature">
          {home.featured_image ? (
            <img src={home.featured_image} alt={home.featured_image_alt} />
          ) : (
            <div className="photo-placeholder">Project photo goes here</div>
          )}
          <div className="feature-body">
            <h3>
              {home.featured_title} <span>({home.featured_year})</span>
            </h3>
            <div>
              {home.featured_description && <p>{home.featured_description}</p>}
              <Link to="/work" className="btn btn-ghost">
                See all work
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="cta">
        <h2>Let's work together</h2>
        <p>Have a project or an opportunity in mind? Send a message and start the conversation.</p>
        <Link to="/contact" className="btn btn-primary">
          Contact Adolphe
        </Link>
      </section>
    </>
  );
}
