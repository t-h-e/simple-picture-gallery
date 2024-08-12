function getTitleElement() {
  return document.getElementById("appTitle")!;
}

function getFaviconElement() {
  return document.getElementById("favicon") as HTMLAnchorElement;
}

export const setGalleryTitleAndFavicon = () => {
  if (import.meta.env.VITE_FAVICON_HREF !== undefined) {
    const favicon = getFaviconElement();
    favicon.href = import.meta.env.VITE_FAVICON_HREF;
  }

  const title = getTitleElement();
  title.textContent = import.meta.env.VITE_TITLE;
};
