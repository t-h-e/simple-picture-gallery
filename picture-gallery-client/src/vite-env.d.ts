/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_APPBAR_COLOR: string;
  readonly VITE_FAVICON_HREF: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
