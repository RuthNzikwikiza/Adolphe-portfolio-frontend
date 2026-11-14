import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getArticle, getComments, postComment } from '../api';
import { useAuth } from '../auth/AuthContext';
import { formatDate, toParagraphs } from '../text';
import { useFetch } from '../useFetch';

function Comments({ articleId }: { articleId: number }) {
  const load = useCallback(() => getComments(articleId), [articleId]);
  const { data: comments, error } = useFetch(load);
  const [text, setText] = useState('');
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (!text.trim()) {
      setFormError('Write something first.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      await postComment(articleId, text.trim());
      setText('');
      setMessage('Thank you. Your comment will appear after it has been reviewed.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not send your comment. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title">Comments</h2>

      {error && <p role="alert">{error}</p>}
      {!error && !comments && <p>Loading comments...</p>}
      {comments && comments.length === 0 && <p>No comments yet. Be the first.</p>}
      {comments && comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <p className="comment-meta">
                {comment.author} · {formatDate(comment.created_at)}
              </p>
              <p className="comment-text">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="comment-text">Add a comment</label>
        <textarea
          id="comment-text"
          rows={4}
          maxLength={1000}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        {formError && (
          <p role="alert" className="auth-error">
            {formError}
          </p>
        )}
        {message && <p role="status">{message}</p>}
        <button type="submit" disabled={busy}>
          {busy ? 'Sending...' : 'Post comment'}
        </button>
      </form>
    </section>
  );
}

export default function ArticleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const articleId = Number(id);
  const userId = user?.id ?? 0;

  const load = useCallback(() => {
    void userId; // reload when someone logs in or out
    return getArticle(articleId);
  }, [articleId, userId]);
  const { data: article, error } = useFetch(load);

  if (Number.isNaN(articleId)) return <p role="alert">Article not found.</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!article) return <p>Loading...</p>;

  return (
    <article className="article">
      <p>
        <Link to="/articles">Back to articles</Link>
      </p>
      <h1>{article.title}</h1>
      <p className="article-date">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
      </p>
      {article.image && <img className="article-image" src={article.image} alt={article.image_alt} />}

      {article.locked || article.body === null ? (
        <>
          <p>{article.excerpt}</p>
          <div className="article-locked">
            <p>
              <strong>Log in to read the full article and join the discussion.</strong>
            </p>
            <p>
              <Link to="/login">Log in</Link> or <Link to="/register">create a free account</Link>.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="article-body">
            {toParagraphs(article.body).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <Comments articleId={articleId} />
        </>
      )}
    </article>
  );
}
