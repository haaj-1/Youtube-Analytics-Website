import { useLayoutEffect } from 'react';

// The landing page (home and /about) keeps the dark look; every other page is light.
const DARK_ROUTES = /^\/(about\/?)?$/;

export function useRouteTheme(pathname) {
  useLayoutEffect(() => {
    const light = !DARK_ROUTES.test(pathname);
    document.documentElement.classList.toggle('theme-light', light);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f6f7f9' : '#06070a');
  }, [pathname]);
}
