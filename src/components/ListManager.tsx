import { useCallback, useState } from 'react';

import { manageDelete, manageList, manageReorder, manageSave } from '../api';
import { useFetch } from '../useFetch';
import ConfirmDialog from './ConfirmDialog';
import EntityForm from './EntityForm';
import type { Field, Row } from './fields';

type Summary = { title: string; subtitle?: string; image?: string | null };

type ListManagerProps = {
  title: string;
  intro: string;
  resource: string;
  noun: string;
  addLabel: string;
  emptyText: string;
  fields: Field[];
  describe: (item: Row) => Summary;
  reorderable?: boolean;
  thumbnails?: boolean;
};

export default function ListManager({
  title,
  intro,
  resource,
  noun,
  addLabel,
  emptyText,
  fields,
  describe,
  reorderable = false,
  thumbnails = false,
}: ListManagerProps) {
  const load = useCallback(() => manageList<Row>(resource), [resource]);
  const { data: items, error, reload } = useFetch(load);
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [pending, setPending] = useState<Row | null>(null);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);

  async function move(index: number, direction: -1 | 1) {
    if (!items) return;
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const ids = items.map((item) => item.id);
    const moved = ids.splice(index, 1)[0];
    if (moved === undefined) return;
    ids.splice(target, 0, moved);

    setBusy(true);
    setActionError('');
    try {
      await manageReorder(resource, ids);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not change the order. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!pending) return;
    setBusy(true);
    setActionError('');
    try {
      await manageDelete(resource, pending.id);
      setNotice('Deleted.');
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete. Try again.');
    } finally {
      setBusy(false);
      setPending(null);
    }
  }

  if (error) return <p role="alert">{error}</p>;
  if (!items) return <p>Loading...</p>;

  if (editing !== null) {
    const current = editing === 'new' ? null : editing;
    return (
      <section className="manager">
        <h1>{current ? `Edit ${noun}` : addLabel}</h1>
        <EntityForm
          key={current ? current.id : 'new'}
          fields={fields}
          item={current}
          onSubmit={async (body) => {
            await manageSave<Row>(resource, current ? current.id : null, body);
            setEditing(null);
            setNotice('Saved.');
            reload();
          }}
          onCancel={() => setEditing(null)}
        />
      </section>
    );
  }

  return (
    <section className="manager">
      <div className="manager-head">
        <h1>{title}</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setNotice('');
            setEditing('new');
          }}
        >
          {addLabel}
        </button>
      </div>
      <p>{intro}</p>

      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      {actionError && (
        <p role="alert" className="auth-error">
          {actionError}
        </p>
      )}

      {items.length === 0 ? (
        <p>{emptyText}</p>
      ) : (
        <ul className={thumbnails ? 'manage-list' : 'manage-list plain-rows'}>
          {items.map((item, index) => {
            const info = describe(item);
            return (
              <li key={item.id}>
                {thumbnails &&
                  (info.image ? <img src={info.image} alt="" /> : <div className="thumb-empty" aria-hidden="true" />)}
                <div className="manage-info">
                  <p className="manage-title">{info.title}</p>
                  {info.subtitle && <p className="manage-sub">{info.subtitle}</p>}
                </div>
                <div className="manage-actions">
                  {reorderable && (
                    <>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => void move(index, -1)}
                        disabled={busy || index === 0}
                        aria-label={`Move ${info.title} up`}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => void move(index, 1)}
                        disabled={busy || index === items.length - 1}
                        aria-label={`Move ${info.title} down`}
                      >
                        Down
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setNotice('');
                      setEditing(item);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm danger" onClick={() => setPending(item)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={`Delete this ${noun}?`}
        message={pending ? `"${describe(pending).title}" will be removed for good. This cannot be undone.` : ''}
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
