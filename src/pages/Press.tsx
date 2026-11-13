import { getPress } from '../api';
import { formatDate } from '../text';
import { useFetch } from '../useFetch';

export default function Press() {
  const { data: items, error } = useFetch(getPress);

  if (error) return <p role="alert">{error}</p>;
  if (!items) return <p>Loading...</p>;

  return (
    <section className="press">
      <h1>Press</h1>
      <p>Features and interviews.</p>

      {items.length === 0 ? (
        <p>No press features have been added yet.</p>
      ) : (
        <ul className="press-list">
          {items.map((item) => (
            <li key={item.id} className={item.image ? 'press-item has-image' : 'press-item'}>
              {item.image && <img src={item.image} alt={item.image_alt} loading="lazy" />}
              <div className="press-text">
                <p className="press-meta">
                  <span className="press-outlet">{item.outlet}</span>
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                </p>
                <h2>{item.headline}</h2>
                {item.summary && <p>{item.summary}</p>}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    Read the article
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
