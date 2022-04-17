declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    env: any;
  }
}

type EnvType = {
  REACT_APP_TITLE: string;
  REACT_APP_APPBAR_COLOR: string;
  REACT_APP_FAVICON_HREF: string | undefined;
};

const env: EnvType = { ...process.env, ...window.env };

function getTitleElement() {
  return document.getElementById("appTitle")!;
}

function getFaviconElement() {
  return document.getElementById("favicon") as HTMLAnchorElement;
}

export const setGalleryTitleAndFavicon = () => {
  if (env.REACT_APP_FAVICON_HREF !== undefined) {
    const favicon = getFaviconElement();
    favicon.href = env.REACT_APP_FAVICON_HREF;
  }

  const title = getTitleElement();
  title.textContent = env.REACT_APP_TITLE;
};

export default env;
