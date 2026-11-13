import { useState } from 'react';

import { manageDelete, manageList, manageSave } from '../../api';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useFetch } from '../../useFetch';

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  notified: boolean;
  is_read: boolean;
};

function loadMessages(): Promise<Message[]> {
  return manageList<Message>('messages');
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function MessagesManager() {
  const { data: messages, error, reload } = useFetch(loadMessages);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [pending, setPending] = useState<Message | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  async function setRead(message: Message, read: boolean) {
    setActionError('');
    const body = new FormData();
    body.append('is_read', read ? 'true' : 'false');
    try {
      await manageSave<Message>('messages', message.id, body);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not update the message.');
    }
  }

  async function confirmDelete() {
    if (!pending) return;
    setBusy(true);
    setActionError('');
    try {
      await manageDelete('messages', pending.id);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete. Try again.');
    } finally {
      setBusy(false);
      setPending(null);
    }
  }

  if (error) return <p role="alert">{error}</p>;
  if (!messages) return <p>Loading...</p>;

  const unread = messages.filter((message) => !message.is_read).length;
  const shown = onlyUnread ? messages.filter((message) => !message.is_read) : messages;

  return (
    <section className="manager">
      <div className="manager-head">
        <h1>Messages</h1>
      </div>
      <p>Messages sent from the contact form. Replies open in your email app.</p>

      <div className="filter-row">
        <button type="button" className="btn btn-ghost btn-sm" aria-pressed={!onlyUnread} onClick={() => setOnlyUnread(false)}>
          All ({messages.length})
        </button>
        <button type="button" className="btn btn-ghost btn-sm" aria-pressed={onlyUnread} onClick={() => setOnlyUnread(true)}>
          Unread ({unread})
        </button>
      </div>

      {actionError && (
        <p role="alert" className="auth-error">
          {actionError}
        </p>
      )}

      {shown.length === 0 ? (
        <p>{onlyUnread ? 'No unread messages.' : 'No messages yet.'}</p>
      ) : (
        <ul className="message-list">
          {shown.map((message) => (
            <li key={message.id}>
              <article className={message.is_read ? 'message' : 'message unread'}>
                <div className="message-head">
                  <div>
                    <p className="message-from">{message.name}</p>
                    <p className="message-meta">
                      <a href={`mailto:${message.email}`}>{message.email}</a> -{' '}
                      <time dateTime={message.created_at}>{formatTime(message.created_at)}</time>
                    </p>
                  </div>
                  {!message.is_read && <span className="badge">New</span>}
                </div>
                <p className="message-body">{message.message}</p>
                <div className="manage-actions">
                  <a
                    className="btn btn-primary btn-sm"
                    href={`mailto:${message.email}?subject=${encodeURIComponent('Re: your message')}`}
                  >
                    Reply
                  </a>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => void setRead(message, !message.is_read)}>
                    {message.is_read ? 'Mark as unread' : 'Mark as read'}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm danger" onClick={() => setPending(message)}>
                    Delete
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Delete this message?"
        message={pending ? `The message from ${pending.name} will be removed for good. This cannot be undone.` : ''}
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
