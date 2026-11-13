import { useState } from 'react';
import type { FormEvent } from 'react';

import { changePassword } from '../../api';
import PasswordField from '../../components/PasswordField';

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (!current) {
      setError('Enter your current password.');
      return;
    }
    if (password.length < 8) {
      setError('Use at least 8 characters for the new password.');
      return;
    }
    if (password !== confirm) {
      setError('The two new passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await changePassword(current, password);
      setMessage('Password changed.');
      setCurrent('');
      setPassword('');
      setConfirm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>Change password</h1>
      <p>Choose a long password that you do not use anywhere else.</p>

      <form onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="current-password"
          label="Current password"
          autoComplete="current-password"
          value={current}
          onChange={setCurrent}
        />
        <PasswordField
          id="new-password"
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          hint="At least 8 characters."
        />
        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />

        {error && (
          <p role="alert" className="auth-error">
            {error}
          </p>
        )}
        {message && <p role="status">{message}</p>}

        <button type="submit" disabled={busy}>
          {busy ? 'Saving...' : 'Change password'}
        </button>
      </form>
    </section>
  );
}
