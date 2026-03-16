import { Outlet } from 'react-router-dom';
import AppNav from './AppNav';

/** Top-level shell — composes nav bar + current route outlet. */
export default function AppShell() {
  return (
    <>
      <AppNav />
      <main>
        <Outlet />
      </main>
    </>
  );
}
