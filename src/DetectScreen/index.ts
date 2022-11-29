const ele = document.getElementById('body');

export const isLargerScreen = ele ? ele.offsetWidth > 1440 : window.screen.width > 1440;

export const isMobile = ele ? ele.offsetWidth <= 1024 : window.screen.width <= 1024;

export const isMobileOnly = ele ? ele.offsetWidth < 768 : window.screen.width < 768;

export const isBrowser = ele ? ele.offsetWidth >= 1025 : window.screen.width >= 1025;

export const isTablet = ele
  ? ele.offsetWidth >= 768 && ele.offsetWidth <= 1024
  : window.screen.width >= 768 && window.screen.width <= 1024;

export const isLandscape = ele
  ? ele.offsetWidth > ele.offsetHeight
  : window.screen.width > window.screen.height;
