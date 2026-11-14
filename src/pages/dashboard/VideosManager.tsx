import ListManager from '../../components/ListManager';
import type { Field, Row } from '../../components/fields';

const videoFields: Field[] = [
  { kind: 'text', name: 'title', label: 'Title', required: true, maxLength: 200 },
  {
    kind: 'url',
    name: 'url',
    label: 'YouTube link',
    required: true,
    placeholder: 'https://www.youtube.com/watch?v=',
    hint: 'Paste the link from YouTube. Only videos that allow embedding will play on the site.',
  },
  { kind: 'textarea', name: 'description', label: 'Description', rows: 3 },
];

function text(value: Row[string] | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

export default function VideosManager() {
  return (
    <ListManager
      title="Videos"
      intro="YouTube videos shown on the Videos page. Use Up and Down to change the order."
      resource="videos"
      noun="video"
      addLabel="Add a video"
      emptyText="No videos yet. Add the first one."
      fields={videoFields}
      reorderable
      describe={(item) => ({ title: text(item.title), subtitle: text(item.url) })}
    />
  );
}
