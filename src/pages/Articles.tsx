import { Link } from 'react-router-dom';

import { getArticles } from '../api';
import { formatDate } from '../text';
import { useFetch } from '../useFetch';

export default function Articles() {
  const { data: articles, error } = useFetch(getArticles);

  if (error) return <p role="alert">{error}</p>;
  if (!articles) return <p>Loading...</p>;

  return (
    <section className="articles">
      <h1>Articles</h1>
      <p>Writing by Adolphe Ishimwe. Log in to read the full articles and join the discussion.</p>

      {articles.length === 0 ? (
        <p>No articles have been published yet.</p>
      ) : (
        <ul className="articles-list">
          {articles.map((article) => (
            <li key={article.id} className={article.image ? undefined : 'no-image'}>
              {article.image && <img src={article.image} alt={article.image_alt} loading="lazy" />}
              <div>
                <h2>
                  <Link to={`/articles/${article.id}`}>{article.title}</Link>
                </h2>
                <p className="article-date">
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                </p>
                <p>{article.excerpt}</p>
                <Link to={`/articles/${article.id}`}>Read more</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
