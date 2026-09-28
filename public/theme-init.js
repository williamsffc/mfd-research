/**
 * Applies the saved (or system) color theme before first paint so dark-mode visitors
 * don't see a flash of the light theme. Loaded as a blocking script in <head>; kept
 * external (not inline) so it satisfies the `script-src 'self'` CSP in public/_headers.
 * The toggle itself lives in src/scripts/main.js.
 */
(function () {
  var root = document.documentElement;
  // Lets CSS hide the hero only when JS will animate it in (see "Hero entrance" in global.css).
  root.classList.add('js');
  // Fallback reveal: main.js also sets this, but if it fails to load the hero must not stay hidden.
  window.addEventListener('load', function () {
    if (document.body) document.body.classList.add('loaded');
  });
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      root.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
})();
