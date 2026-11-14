import { useCallback, useState } from 'react';

import { manageDelete, manageList, manageSave } from '../../api';
import ConfirmDialog from '../../components/ConfirmDialog';
import type { Row } from '../../components/fields';
import { useFetch } from '../../useFetch';

function text(value: Row[string] | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

function when(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function CommentsManager() {
  const load = useCallback(() => manageList<Row>('comments'), []);
  const { data: comments, error, reload } = useFetch(load);
  const [pending, setPending] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  async function setApproved(row: Row, approved: boolean) {
    setBusy(true);
    setActionError('');
    try {
      const body = new FormData();
      body.append('is_approved', approved ? 'true' : 'false');
      await manageSave<Row>('comments', row.id, body);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not update the comment.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!pending) return;
    setBusy(true);
    setActionError('');
    try {
      await manageDelete('comments', pending.id);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the comment.');
    } finally {
      setBusy(false);
      setPending(null);
    }
  }

  if (error) return <p role="alert">{error}</p>;
  if (!comments) return <p>Loading...</p>;

  const sorted = [...comments].sort((a, b) => Number(Boolean(a.is_approved)) - Number(Boolean(b.is_approved)));
  const waiting = sorted.filter((item) => !item.is_approved).length;

  return (
    <section className="manager">
      <h1>Comments</h1>
      <p>
        New comments wait here until you approve them. {waiting === 0 ? 'Nothing is waiting.' : `${waiting} waiting.`}
      </p>

      {actionError && (
        <p role="alert" className="auth-error">
          {actionError}
        </p>
      )}

      {sorted.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="manage-list plain-rows">
          {sorted.map((item) => (
            <li key={item.id}>
              <div className="manage-info">
                <p className="manage-title">
                  {text(item.author)} on {text(item.article_title)} {item.is_approved ? '(approved)' : '(waiting)'}
                </p>
                <p className="manage-sub">{when(text(item.created_at))}</p>
                <p className="comment-text">{text(item.text)}</p>
              </div>
              <div className="manage-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={busy}
                  onClick={() => void setApproved(item, !item.is_approved)}
                >
                  {item.is_approved ? 'Hide' : 'Approve'}
                </button>
                <button type="button" className="btn btn-ghost btn-sm danger" onClick={() => setPending(item)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Delete this comment?"
        message="It will be removed for good. This cannot be undone."
        confirmLabel="Delete"
        busy={busy}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!busy) setPending(null);
        }}
      />
    </section>
  );
}
