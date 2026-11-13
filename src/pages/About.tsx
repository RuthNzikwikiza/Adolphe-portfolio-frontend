import { getAbout } from '../api';
import { toParagraphs } from '../text';
import { useFetch } from '../useFetch';

export default function About() {
  const { data: about, error } = useFetch(getAbout);

  if (error) return <p role="alert">{error}</p>;
  if (!about) return <p>Loading...</p>;

  const bio = toParagraphs(about.bio);
  const approach = toParagraphs(about.approach);
  const intro = toParagraphs(about.education_intro);

  return (
    <>
      <section className="about">
        <div className="about-media">
          {about.portrait ? (
            <img src={about.portrait} alt={about.portrait_alt} />
          ) : (
            <div className="photo-placeholder">Portrait photo goes here</div>
          )}
        </div>

        <div className="about-text">
          <h1>{about.heading}</h1>
          {bio.map((text, index) => (
            <p key={text} className={index === 0 ? 'lead' : undefined}>
              {text}
            </p>
          ))}

          {approach.length > 0 && (
            <div className="approach">
              <h2>My approach</h2>
              {approach.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          )}
        </div>

        {about.facts.length > 0 && (
          <div className="about-facts">
            <h2>At a glance</h2>
            <dl>
              {about.facts.map((fact) => (
                <div key={fact.id}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      {about.education.length > 0 && (
        <section className="education">
          <h2>Education</h2>
          {intro.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <ul>
            {about.education.map((entry) => (
              <li key={entry.id}>
                <div>
                  <h3>{entry.title}</h3>
                  {entry.institution && <p className="education-where">{entry.institution}</p>}
                </div>
                {entry.description && <p>{entry.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
