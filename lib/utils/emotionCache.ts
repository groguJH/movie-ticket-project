import createCache from "@emotion/cache";

const isBrowser = typeof document !== "undefined";

export const createEmotionCache = () => {
  return createCache({
    key: "css",
    prepend: true, // Emotion 스타일을 head 맨 앞에 삽입
    container: isBrowser ? document.head : undefined,
  });
};
