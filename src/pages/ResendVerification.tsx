import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { resendVerification } from '../api';
import AuthShell from '../components/AuthShell';

export default function ResendVerification() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setError('Enter the email address you registered with.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await resendVerification(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle="If that email is waiting for verification, a new link is on its way.">
        <p className="auth-switch">
          <Link to="/login">Back to log in</Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Resend verification" subtitle="We will send a new link to your email.">
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="resend-email">Email</label>
          <input
            id="resend-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="auth-error">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy}>
          {busy ? 'Sending...' : 'Send new link'}
        </button>
      </form>

      <p className="auth-switch">
        <Link to="/login">Back to log in</Link>
      </p>
    </AuthShell>
  );
}
