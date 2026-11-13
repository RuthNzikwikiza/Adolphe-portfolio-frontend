import { useEffect, useState } from 'react';

import { listVisits } from '../api';
import type { Visit } from '../api';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function Dashboard() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listVisits()
      .then(setVisits)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not load visits.');
      })
      .finally(() => setLoading(false));
  }, []);

  const perVisitor = new Map<string, number>();
  for (const visit of visits) {
    perVisitor.set(visit.username, (perVisitor.get(visit.username) ?? 0) + 1);
  }

  return (
    <section>
      <h1>Visitors</h1>
      <p>Everyone who opened the site while logged in.</p>

      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && visits.length === 0 && <p>No visits yet.</p>}

      {!loading && !error && visits.length > 0 && (
        <>
          <div className="metrics">
            <div>
              <span>Total visits</span>
              <strong>{visits.length}</strong>
            </div>
            <div>
              <span>Visitors</span>
              <strong>{perVisitor.size}</strong>
            </div>
          </div>

          <h2>Visits per visitor</h2>
          <dl>
            {[...perVisitor.entries()].map(([name, count]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{count === 1 ? '1 visit' : `${count} visits`}</dd>
              </div>
            ))}
          </dl>

          <h2>All visits</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Page</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.username}</td>
                    <td>{visit.path}</td>
                    <td>
                      <time dateTime={visit.visited_at}>{formatTime(visit.visited_at)}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
