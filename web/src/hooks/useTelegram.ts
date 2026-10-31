export function useTelegram() {
  const webApp = window.Telegram?.WebApp;

  const user = webApp?.initDataUnsafe?.user ?? null;

  const ready = () => {
    webApp?.ready();
    webApp?.expand();
  };

  return {
    webApp,
    user,
    initData: webApp?.initData ?? '',
    isTelegram: Boolean(webApp?.initData),
    colorScheme: webApp?.colorScheme ?? 'dark',
    ready,
  };
}
