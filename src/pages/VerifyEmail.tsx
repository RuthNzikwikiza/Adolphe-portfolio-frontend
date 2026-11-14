import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { verifyEmail } from '../api';
import AuthShell from '../components/AuthShell';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<'working' | 'done' | 'error'>(token ? 'working' : 'error');
  const [message, setMessage] = useState(token ? '' : 'This verification link is incomplete.');

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => setStatus('done'))
      .catch((err: unknown) => {
        setMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
        setStatus('error');
      });
  }, [token]);

  if (status === 'working') {
    return <AuthShell title="Verifying..." subtitle="One moment while we confirm your email." children={null} />;
  }

  if (status === 'done') {
    return (
      <AuthShell title="Email verified" subtitle="Your account is ready.">
        <div className="auth-actions">
          <Link to="/login" className="btn btn-primary">
            Log in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Link not valid" subtitle={message}>
      <p className="auth-switch">
        <Link to="/resend-verification">Send me a new link</Link>
      </p>
    </AuthShell>
  );
}
