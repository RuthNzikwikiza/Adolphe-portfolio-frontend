import { useState } from 'react';
import type { FormEvent } from 'react';

import ImagePicker from './ImagePicker';
import type { Field, Row } from './fields';

type EntityFormProps = {
  fields: Field[];
  item: Row | null;
  onSubmit: (body: FormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
};

function asText(value: Row[string] | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

function initialValues(fields: Field[], item: Row | null): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) {
    if (field.kind === 'heading') continue;
    if (field.kind === 'image') {
      if (field.altName) values[field.altName] = asText(item?.[field.altName]);
    } else {
      values[field.name] = asText(item?.[field.name]);
    }
  }
  return values;
}

export default function EntityForm({
  fields,
  item,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: EntityFormProps) {
  const [values, setValues] = useState(() => initialValues(fields, item));
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [removes, setRemoves] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function setValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function savedImage(name: string): string | null {
    const value = item?.[name];
    return typeof value === 'string' && value !== '' ? value : null;
  }

  function hasPicture(name: string): boolean {
    return Boolean(files[name]) || (savedImage(name) !== null && !removes[name]);
  }

  function validate(): string {
    for (const field of fields) {
      if (field.kind === 'heading') continue;
      if (field.kind === 'image') {
        if (field.required && !hasPicture(field.name)) return `Choose a picture for "${field.label}".`;
        if (field.altName && hasPicture(field.name) && !(values[field.altName] ?? '').trim()) {
          return 'Describe the picture in the description box.';
        }
        continue;
      }
      const value = (values[field.name] ?? '').trim();
      if (field.required && !value) return `Fill in "${field.label}".`;
      if (field.kind === 'url' && value && !/^https?:\/\//i.test(value)) {
        return 'The link must start with http:// or https://';
      }
      if (field.kind === 'email' && value && !value.includes('@')) {
        return 'Enter a valid email address.';
      }
    }
    return '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    const body = new FormData();
    for (const field of fields) {
      if (field.kind === 'heading') continue;
      if (field.kind === 'image') {
        const file = files[field.name];
        if (file) body.append(field.name, file);
        else if (removes[field.name]) body.append(`remove_${field.name}`, 'true');
        if (field.altName) {
          body.append(field.altName, hasPicture(field.name) ? (values[field.altName] ?? '').trim() : '');
        }
      } else {
        body.append(field.name, (values[field.name] ?? '').trim());
      }
    }

    setBusy(true);
    setError('');
    try {
      await onSubmit(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="manage-form" onSubmit={handleSubmit} noValidate>
      {fields.map((field) => {
        if (field.kind === 'heading') {
          return (
            <h2 key={`heading-${field.label}`} className="full">
              {field.label}
            </h2>
          );
        }

        if (field.kind === 'image') {
          const name = field.name;
          const altName = field.altName;
          return (
            <div key={name} className="full">
              <ImagePicker
                label={field.label}
                current={savedImage(name)}
                file={files[name] ?? null}
                remove={removes[name] ?? false}
                allowRemove={!field.required}
                onFile={(file) => setFiles((current) => ({ ...current, [name]: file }))}
                onRemove={(remove) => setRemoves((current) => ({ ...current, [name]: remove }))}
              />
              {altName && hasPicture(name) && (
                <div className="alt-field">
                  <label htmlFor={`f-${altName}`}>Picture description</label>
                  <input
                    id={`f-${altName}`}
                    type="text"
                    maxLength={200}
                    value={values[altName] ?? ''}
                    onChange={(event) => setValue(altName, event.target.value)}
                  />
                  <p className="field-hint">Say what the picture shows, for visitors who cannot see it.</p>
                </div>
              )}
            </div>
          );
        }

        const name = field.name;
        const id = `f-${name}`;
        return (
          <div key={name} className={field.half ? undefined : 'full'}>
            <label htmlFor={id}>{field.label}</label>
            {field.kind === 'textarea' ? (
              <textarea
                id={id}
                rows={field.rows ?? 4}
                maxLength={field.maxLength}
                value={values[name] ?? ''}
                onChange={(event) => setValue(name, event.target.value)}
              />
            ) : (
              <input
                id={id}
                type={field.kind}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                value={values[name] ?? ''}
                onChange={(event) => setValue(name, event.target.value)}
              />
            )}
            {field.hint && <p className="field-hint">{field.hint}</p>}
          </div>
        );
      })}

      {error && (
        <p role="alert" className="auth-error full">
          {error}
        </p>
      )}

      <div className="form-actions full">
        <button type="submit" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
