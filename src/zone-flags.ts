/**
 * Prevents Angular change detection from running on certain Web Component lifecycle events.
 * This is crucial for Ionic performance.
 */
(window as any).__Zone_disable_customElementsGeneratedCode = true;

/**
 * Disables the excessive change detection for specific events that fire rapidly.
 */
(window as any).__zone_symbol__PASSIVE_EVENTS = [
  'touchstart',
  'touchmove',
  'touchend',
  'scroll',
  'mousewheel',
];

/**
 * If you are having issues with NgZone and third-party libraries, 
 * you can disable specific monkey-patching here.
 */
// (window as any).__Zone_disable_requestAnimationFrame = true; // Solo si es necesario