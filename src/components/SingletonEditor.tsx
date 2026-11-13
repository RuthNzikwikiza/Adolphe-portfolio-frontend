import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { manageGet, manageUpdate } from '../api';
import { useFetch } from '../useFetch';
import EntityForm from './EntityForm';
import type { Field, Row } from './fields';

type SingletonEditorProps = {
  title: string;
  intro: string;
  resource: string;
  viewPath: string;
  fields: Field[];
};

export default function SingletonEditor({ title, intro, resource, viewPath, fields }: SingletonEditorProps) {
  const load = useCallback(() => manageGet<Row>(resource), [resource]);
  const { data, error } = useFetch(load);
  const [saved, setSaved] = useState<Row | null>(null);
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState('');

  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p>Loading...</p>;

  async function save(body: FormData) {
    const updated = await manageUpdate<Row>(resource, body);
    setSaved(updated);
    setVersion((current) => current + 1);
    setNotice('Saved. The change is live on the site.');
  }

  return (
    <section className="manager">
      <div className="manager-head">
        <h1>{title}</h1>
        <Link to={viewPath} className="btn btn-ghost btn-sm">
          View the page
        </Link>
      </div>
      <p>{intro}</p>
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      <EntityForm key={version} fields={fields} item={saved ?? data} onSubmit={save} submitLabel="Save changes" />
    </section>
  );
}
