declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    env: any;
  }
}

type EnvType = {
  REACT_APP_TITLE: string;
  REACT_APP_APPBAR_COLOR: string;
};

const env: EnvType = { ...process.env, ...window.env };

export default env;
