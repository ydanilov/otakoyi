// Inline scripts run before first paint. Kept in a plain (server-safe) module: importing a
// constant from a "use client" file into the root layout yields a client reference, not the string.

/** Theme: default dark, honour a stored "light". */
export const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`

/** Motion (ADR-006): on by default, honour a stored "off". */
export const motionScript = `try{if(localStorage.getItem("motion")==="off")document.documentElement.dataset.motion="off"}catch(e){}`
