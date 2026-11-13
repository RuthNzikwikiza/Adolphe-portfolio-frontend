import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>That address doesn't lead anywhere on this site.</p>
      <Link to="/">Back to Home</Link>
    </section>
  );
}
