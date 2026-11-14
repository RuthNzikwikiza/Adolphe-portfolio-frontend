import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import AuthShell from '../components/AuthShell';
import PasswordField from '../components/PasswordField';

export default function Register() {
  const { user, register } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim().replace(/\s+/g, ' ');

    if (!cleanName || !username.trim() || !email.trim() || !password) {
      setError('Fill in every field.');
      return;
    }
    if (cleanName.length > 60) {
      setError('Keep your name under 60 characters.');
      return;
    }
    if (/\s/.test(username.trim())) {
      setError('The username cannot contain spaces. Put your full name in the name field above.');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }

    setBusy(true);
    setError('');
    try {
      await register(username.trim(), email.trim(), password, cleanName);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  if (user) return <Navigate to="/" replace />;

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle="We sent you a link to confirm your address.">
        <p className="auth-note">
          Open the email and click the link, then log in. If you do not see it, check your spam folder.
        </p>
        <p className="auth-switch">
          <Link to="/login">Go to log in</Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute.">
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="reg-name">Full name</label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <p className="field-hint">Shown on the site. Spaces are fine.</p>
        </div>

        <div>
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <p className="field-hint">Used to log in. Letters, numbers and @ . + - _ only, no spaces.</p>
        </div>

        <div>
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <PasswordField
          id="reg-password"
          label="Password"
          autoComplete="new-password"
          hint="At least 8 characters."
          value={password}
          onChange={setPassword}
        />

        <PasswordField
          id="reg-confirm"
          label="Confirm password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />

        {error && (
          <p role="alert" className="auth-error">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy}>
          {busy ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="auth-note">
        While you are signed in, the pages you open are recorded for the site owner.
      </p>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthShell>
  );
}
