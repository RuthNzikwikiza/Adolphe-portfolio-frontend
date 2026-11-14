import ListManager from '../../components/ListManager';
import type { Field, Row } from '../../components/fields';

const articleFields: Field[] = [
  { kind: 'text', name: 'title', label: 'Title', required: true, maxLength: 200 },
  { kind: 'date', name: 'date', label: 'Date', required: true, half: true },
  { kind: 'image', name: 'image', label: 'Picture', altName: 'image_alt' },
  {
    kind: 'textarea',
    name: 'excerpt',
    label: 'Preview',
    required: true,
    rows: 3,
    hint: 'A short teaser. Everyone can see this, even visitors who are not logged in.',
  },
  {
    kind: 'textarea',
    name: 'body',
    label: 'Full article',
    required: true,
    rows: 14,
    hint: 'Only logged-in readers see this. Leave a blank line between paragraphs.',
  },
];

function text(value: Row[string] | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

function picture(value: Row[string] | undefined): string | null {
  return typeof value === 'string' && value !== '' ? value : null;
}

export default function ArticlesManager() {
  return (
    <ListManager
      title="Articles"
      intro="Articles for the Articles page. Visitors see the preview, and logged-in readers see the full text."
      resource="articles"
      noun="article"
      addLabel="Add an article"
      emptyText="No articles yet. Add the first one."
      fields={articleFields}
      thumbnails
      describe={(item) => ({
        title: text(item.title),
        subtitle: text(item.date),
        image: picture(item.image),
      })}
    />
  );
}
