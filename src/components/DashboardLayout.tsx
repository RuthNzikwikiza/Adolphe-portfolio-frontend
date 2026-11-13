import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { initialsOf } from '../text';

type Section = { to: string; label: string; end: boolean };

const groups: { heading: string; items: Section[] }[] = [
  {
    heading: 'Overview',
    items: [
      { to: '/dashboard', label: 'Visitors', end: true },
      { to: '/dashboard/messages', label: 'Messages', end: false },
    ],
  },
  {
    heading: 'Pages',
    items: [
      { to: '/dashboard/home', label: 'Home', end: false },
      { to: '/dashboard/about', label: 'About', end: false },
      { to: '/dashboard/contact', label: 'Contact', end: false },
    ],
  },
  {
    heading: 'Content',
    items: [
      { to: '/dashboard/work', label: 'Work', end: false },
      { to: '/dashboard/accolades', label: 'Accolades', end: false },
      { to: '/dashboard/press', label: 'Press', end: false },
      { to: '/dashboard/gallery', label: 'Gallery', end: false },
    ],
  },
  {
    heading: 'Lists on pages',
    items: [
      { to: '/dashboard/facts', label: 'About: at a glance', end: false },
      { to: '/dashboard/education', label: 'About: education', end: false },
      { to: '/dashboard/socials', label: 'Contact: social links', end: false },
    ],
  },
  {
    heading: 'Account',
    items: [{ to: '/dashboard/password', label: 'Change password', end: false }],
  },
];

const allSections = groups.flatMap((group) => group.items);

export default function DashboardLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const name = user?.name ?? '';

  const current =
    allSections.find((section) => (section.end ? pathname === section.to : pathname.startsWith(section.to)))
      ?.label ?? 'Dashboard';

  return (
    <div className="dash">
      <aside className="dash-side">
        <div className="dash-user">
          <span className="avatar" aria-hidden="true">
            {initialsOf(name)}
          </span>
          <div>
            <p className="dash-name">{name}</p>
            <p className="dash-role">Site owner</p>
          </div>
        </div>

        <button
          type="button"
          className="plain dash-toggle"
          aria-expanded={open}
          aria-controls="dash-menu"
          onClick={() => setOpenAt(open ? null : pathname)}
        >
          {open ? 'Close menu' : `Menu: ${current}`}
        </button>

        <div id="dash-menu" className={open ? 'dash-menu open' : 'dash-menu'}>
          <nav className="dash-nav" aria-label="Dashboard">
            {groups.map((group) => (
              <div key={group.heading} className="dash-group">
                <p className="dash-group-title">{group.heading}</p>
                {group.items.map((section) => (
                  <NavLink key={section.to} to={section.to} end={section.end}>
                    {section.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <Link to="/" className="dash-back">
            View site
          </Link>
        </div>
      </aside>

      <div className="dash-main">
        <Outlet />
      </div>
    </div>
  );
}
