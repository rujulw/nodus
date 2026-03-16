import { NavLink } from 'react-router-dom';

/** Primary navigation bar — sticky, rendered on every route. */
export default function AppNav() {
  return (
    <nav className="app-nav" aria-label="Main navigation">
      <div className="container app-nav__inner">
        <NavLink to="/" end className="app-nav__logo" aria-label="nodus — go to feed">
          nodus
        </NavLink>
        <ul className="app-nav__links" role="list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }: { isActive: boolean }) =>
                'app-nav__link' + (isActive ? ' active' : '')
              }
            >
              Feed
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
