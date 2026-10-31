/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  Telegram?: {
    WebApp: {
      initData: string;
      initDataUnsafe: {
        user?: {
          id: number;
          first_name: string;
          username?: string;
          photo_url?: string;
        };
      };
      ready: () => void;
      expand: () => void;
      close: () => void;
      colorScheme: 'light' | 'dark';
      themeParams: Record<string, string>;
      BackButton: {
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
      };
    };
  };
}
