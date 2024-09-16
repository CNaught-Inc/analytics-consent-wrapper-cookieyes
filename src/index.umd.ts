import { withCookieYes } from './index';

export { withCookieYes };

// this will almost certainly be executed in the browser, but since this is UMD,
// we are checking just for the sake of being thorough
if (typeof window !== 'undefined') {
    (window as any).withCookieYes = withCookieYes;
}
