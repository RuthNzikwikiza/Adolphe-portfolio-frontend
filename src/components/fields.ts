export type Row = { id: number; [key: string]: string | number | boolean | null };

export type Field =
  | { kind: 'heading'; label: string }
  | { kind: 'image'; name: string; label: string; altName?: string; required?: boolean }
  | {
      kind: 'text' | 'email' | 'url' | 'date' | 'number' | 'textarea';
      name: string;
      label: string;
      hint?: string;
      placeholder?: string;
      required?: boolean;
      maxLength?: number;
      rows?: number;
      half?: boolean;
    };
