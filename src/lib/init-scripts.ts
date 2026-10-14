// Inline scripts run before first paint. Kept in a plain (server-safe) module: importing a
// constant from a "use client" file into the root layout yields a client reference, not the string.

/** Theme: the site is dark only; clear a "light" choice stored by the old theme toggle. */
export const themeScript = `try{localStorage.removeItem("theme")}catch(e){}`

/** Motion (ADR-006): on by default, honour a stored "off". */
export const motionScript = `try{if(localStorage.getItem("motion")==="off")document.documentElement.dataset.motion="off"}catch(e){}`
