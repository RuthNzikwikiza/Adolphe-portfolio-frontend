import { getAccolades } from '../api';
import type { Accolade } from '../api';
import { useFetch } from '../useFetch';

type YearGroup = { year: number; items: Accolade[] };

function groupByYear(accolades: Accolade[]): YearGroup[] {
  const groups: YearGroup[] = [];

  for (const item of accolades) {
    const last = groups[groups.length - 1];
    if (last && last.year === item.year) {
      last.items.push(item);
    } else {
      groups.push({ year: item.year, items: [item] });
    }
  }

  return groups;
}

export default function Accolades() {
  const { data: accolades, error } = useFetch(getAccolades);

  if (error) return <p role="alert">{error}</p>;
  if (!accolades) return <p>Loading...</p>;

  const groups = groupByYear(accolades);

  return (
    <section className="accolades">
      <h1>Accolades</h1>
      <p>Awards and recognition.</p>

      {groups.length === 0 ? (
        <p>No accolades have been added yet.</p>
      ) : (
        groups.map((group) => (
          <div key={group.year} className="year-group">
            <h2>{group.year}</h2>
            <ul className="accolade-list">
              {group.items.map((item) => (
                <li key={item.id} className={item.image ? 'accolade has-image' : 'accolade'}>
                  {item.image && <img src={item.image} alt={item.image_alt} loading="lazy" />}
                  <div className="accolade-text">
                    <h3>{item.title}</h3>
                    <p className="accolade-issuer">{item.issuer}</p>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
