import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

const MAX_BYTES = 5 * 1024 * 1024;

type ImagePickerProps = {
  label: string;
  current: string | null;
  file: File | null;
  remove: boolean;
  allowRemove?: boolean;
  onFile: (file: File | null) => void;
  onRemove: (remove: boolean) => void;
};

export default function ImagePicker({
  label,
  current,
  file,
  remove,
  allowRemove = true,
  onFile,
  onRemove,
}: ImagePickerProps) {
  const [problem, setProblem] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreview(null);
    };
  }, [file]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0] ?? null;
    setProblem('');
    if (!chosen) {
      onFile(null);
      return;
    }
    if (!chosen.type.startsWith('image/')) {
      setProblem('Choose an image file.');
      event.target.value = '';
      return;
    }
    if (chosen.size > MAX_BYTES) {
      setProblem('The picture must be under 5 MB.');
      event.target.value = '';
      return;
    }
    onRemove(false);
    onFile(chosen);
  }

  const shown = preview ?? (remove ? null : current);

  return (
    <div className="image-picker">
      <p className="image-label">{label}</p>
      {shown ? <img src={shown} alt="" /> : <div className="photo-placeholder">No picture</div>}
      <input type="file" accept="image/*" onChange={handleChange} aria-label={`Choose ${label.toLowerCase()}`} />
      {allowRemove && current && !file && (
        <label className="check">
          <input type="checkbox" checked={remove} onChange={(event) => onRemove(event.target.checked)} />
          Remove the current picture
        </label>
      )}
      {problem && (
        <p role="alert" className="auth-error">
          {problem}
        </p>
      )}
    </div>
  );
}
