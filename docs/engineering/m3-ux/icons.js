const paths = {
  back: '<path d="m14 6-6 6 6 6M8 12h12"/>', arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
  document: '<path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  play: '<path d="m8 5 11 7-11 7V5Z"/>', pause: '<path d="M8 5v14M16 5v14"/>',
  check: '<path d="m5 12 4 4L19 6"/>', cross: '<path d="m6 6 12 12M6 18 18 6"/>',
  sound: '<path d="m11 5-6 5H2v4h3l6 5V5ZM15 8c2 2 2 6 0 8M18 5c4 4 4 10 0 14"/>',
  mute: '<path d="m11 5-6 5H2v4h3l6 5V5Zm5 4 6 6m-6 0 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  quiz: '<path d="M8 5H4v18h16V5h-4M9 3h6v4H9V3Zm-2 9 1 1 2-2m3 1h4m-10 5 1 1 2-2m3 1h4"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>', restart: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  captions: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 9H6v6h4m8-6h-4v6h4"/>',
  warning: '<path d="m12 3 10 18H2L12 3Zm0 6v5m0 3v1"/>',
  offline: '<path d="M3 3l18 18M4 8a15 15 0 0 1 2-1m4-2a15 15 0 0 1 10 3M7 12a9 9 0 0 1 3-1m5 0 2 1m-7 4a4 4 0 0 1 4 0m-2 3h.01"/>',
  loading: '<path d="M12 3a9 9 0 1 1-9 9M3 3v5h5"/>',
}
export const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.document}</svg>`
export const paperArt = () => `<svg class="paper-art" viewBox="0 0 180 152" fill="none" aria-hidden="true" focusable="false"><g transform="rotate(8 92 77)"><rect class="art-back" x="42" y="22" width="100" height="122" rx="6"/></g><g transform="rotate(-6 90 77)"><rect class="art-page" x="30" y="12" width="104" height="128" rx="6"/><path class="art-ink" d="M48 34h23M48 47h64M48 58h64M48 69h40M48 90h64M48 101h64M48 112h32"/><rect class="art-stamp" x="88" y="104" width="28" height="25" rx="4"/><path class="art-stamp-line" d="M94 110h16m-16 6h16m-16 6h10"/></g><path class="art-ink" d="m141 32 12-9 6 8-12 9-29 23-9 1 3-8 29-24Z"/></svg>`
