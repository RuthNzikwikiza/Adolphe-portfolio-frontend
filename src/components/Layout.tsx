import { useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { initialsOf } from '../text';
import VisitTracker from './VisitTracker';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/accolades', label: 'Accolades' },
  { to: '/press', label: 'Press' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
  { to: '/contact', label: 'Contact' },
];

const explore = links.filter((link) => link.to !== '/');

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const { pathname } = useLocation();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') setOpenAt(null);
  }

  function handleMenuClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a')) setOpenAt(null);
  }

  return (
    <div>
      <VisitTracker />
      <header onKeyDown={handleKeyDown}>
        <Link to="/" className="brand">
          Adolphe Ishimwe
        </Link>

        <button
          type="button"
          className="plain menu-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpenAt(open ? null : pathname)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <div id="site-menu" className={open ? 'site-menu open' : 'site-menu'} onClick={handleMenuClick}>
          <nav aria-label="Main">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {!loading &&
            (user ? (
              <div className="header-actions">
                {user.is_owner && (
                  <Link to="/dashboard" className="btn btn-primary btn-sm">
                    Dashboard
                  </Link>
                )}
                <span className="user-chip">
                  <span className="avatar" aria-hidden="true">
                    {initialsOf(user.name)}
                  </span>
                  <span className="user-name">{user.name}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setOpenAt(null);
                    logout();
                  }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="header-actions">
                <Link to="/login" className="link-quiet">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            ))}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="footer-top">
          <div className="footer-about">
            <p className="footer-brand">Adolphe Ishimwe</p>
            <p>Portfolio of Hon. Adolphe Ishimwe. Explore the work, read the press, and get in touch.</p>
          </div>

          <nav aria-label="Footer" className="footer-col">
            <p className="footer-title">Explore</p>
            <div className="footer-links">
              {explore.map((link) => (
                <Link key={link.to} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="footer-col">
            <p className="footer-title">Account</p>
            {!loading &&
              (user ? (
                <>
                  <span>Signed in as {user.name}</span>
                  {user.is_owner && <Link to="/dashboard">Dashboard</Link>}
                </>
              ) : (
                <>
                  <Link to="/login">Log in</Link>
                  <Link to="/register">Register</Link>
                </>
              ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright {new Date().getFullYear()} Adolphe Ishimwe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
