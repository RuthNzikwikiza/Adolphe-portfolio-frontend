import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import { ApiError, getContactInfo, sendContactMessage } from '../api';
import { toParagraphs } from '../text';
import { useFetch } from '../useFetch';

type FormState = {
  name: string;
  email: string;
  message: string;
  website: string;
};

const emptyForm: FormState = { name: '', email: '', message: '', website: '' };

export default function Contact() {
  const { data: info, error: loadError } = useFetch(getContactInfo);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (loadError) return <p role="alert">{loadError}</p>;
  if (!info) return <p>Loading...</p>;

  const intro = toParagraphs(info.intro);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError('Fill in your name, email and message.');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (message.length < 10) {
      setError('Write at least 10 characters in your message.');
      return;
    }
    if (message.length > 2000) {
      setError('Keep your message under 2000 characters.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await sendContactMessage({ name, email, message, website: form.website });
      setSent(true);
      setForm(emptyForm);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError('You have sent several messages. Please try again later.');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <section className="contact-done">
        <h1>Thank you</h1>
        <p role="status">Your message has been sent.</p>
        <button type="button" onClick={() => setSent(false)}>
          Send another message
        </button>
      </section>
    );
  }

  return (
    <section className="contact">
      <div className="contact-info">
        <h1>{info.heading}</h1>
        {intro.map((text) => (
          <p key={text}>{text}</p>
        ))}

        {(info.email || info.phone || info.location) && (
          <dl className="contact-details">
            {info.email && (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${info.email}`}>{info.email}</a>
                </dd>
              </div>
            )}
            {info.phone && (
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${info.phone.replace(/[^\d+]/g, '')}`}>{info.phone}</a>
                </dd>
              </div>
            )}
            {info.location && (
              <div>
                <dt>Based in</dt>
                <dd>{info.location}</dd>
              </div>
            )}
          </dl>
        )}

        {info.socials.length > 0 && (
          <ul className="social-list">
            {info.socials.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="contact-form">
        <h2>Send a message</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={120}
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              maxLength={2000}
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <div className="hp" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={handleChange}
            />
          </div>

          {error && <p role="alert">{error}</p>}

          <button type="submit" disabled={busy}>
            {busy ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  );
}
