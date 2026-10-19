// Inline scripts run before first paint. Kept in a plain (server-safe) module: importing a
// constant from a "use client" file into the root layout yields a client reference, not the string.

/** Motion (ADR-006): on by default, honour a stored "off". */
// The header toggle is gone, so a visitor's old "motion=off" must not freeze the site: only the
// test key (set by Playwright) turns motion off; the old key is cleared.
export const motionScript = `try{localStorage.removeItem("motion");if(localStorage.getItem("motion-test")==="off")document.documentElement.dataset.motion="off"}catch(e){}`
