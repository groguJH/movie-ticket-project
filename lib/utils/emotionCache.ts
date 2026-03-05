import createCache from "@emotion/cache";

const isBrowser = typeof document !== "undefined";

export const createEmotionCache = () => {
  return createCache({
    key: "css",
    prepend: true,
    container: isBrowser ? document.head : undefined,
  });
};
