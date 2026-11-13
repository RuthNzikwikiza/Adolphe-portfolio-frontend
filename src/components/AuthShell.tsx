import type { ReactNode } from 'react';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <section className="auth">
      <div className="auth-panel" aria-hidden="true">
        <p className="auth-chip">Portfolio</p>
        <p className="auth-brand">Adolphe Ishimwe</p>
        <p className="auth-line">Entrepreneurship in action.</p>
      </div>

      <div className="auth-card">
        <h1>{title}</h1>
        <p className="auth-sub">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
