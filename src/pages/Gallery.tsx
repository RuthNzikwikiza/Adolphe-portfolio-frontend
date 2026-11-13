import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import { getGallery } from '../api';
import { useFetch } from '../useFetch';

export default function Gallery() {
  const { data: photos, error } = useFetch(getGallery);
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected !== null && !dialog.open) dialog.showModal();
    if (selected === null && dialog.open) dialog.close();
  }, [selected]);

  if (error) return <p role="alert">{error}</p>;
  if (!photos) return <p>Loading...</p>;

  const current = selected !== null ? photos[selected] : undefined;

  const step = (direction: number) => {
    if (selected === null) return;
    setSelected((selected + direction + photos.length) % photos.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) setSelected(null);
  };

  return (
    <section className="gallery">
      <h1>Gallery</h1>
      <p>Moments in pictures.</p>

      {photos.length === 0 ? (
        <p>No photos have been added yet.</p>
      ) : (
        <ul className="gallery-grid">
          {photos.map((photo, index) => (
            <li key={photo.id}>
              <button
                type="button"
                className="plain gallery-item"
                onClick={() => setSelected(index)}
                aria-label={`Enlarge photo: ${photo.alt}`}
              >
                <img src={photo.image} alt={photo.alt} loading="lazy" />
              </button>
              {photo.caption && <p className="gallery-caption">{photo.caption}</p>}
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Photo viewer"
        onClose={() => setSelected(null)}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
      >
        {current && (
          <div className="lightbox-inner">
            <img src={current.image} alt={current.alt} />
            <div className="lightbox-bar">
              <p className="lightbox-caption">{current.caption || current.alt}</p>
              <div className="lightbox-actions">
                <span className="lightbox-count">
                  {(selected ?? 0) + 1} of {photos.length}
                </span>
                <button type="button" className="plain lightbox-btn" onClick={() => step(-1)}>
                  Previous
                </button>
                <button type="button" className="plain lightbox-btn" onClick={() => step(1)}>
                  Next
                </button>
                <button type="button" className="plain lightbox-btn" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
