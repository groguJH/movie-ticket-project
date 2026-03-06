import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "../styles/globals.css";
import Navigation from "../src/containers/navigation/Navigation";
import { createEmotionCache } from "../lib/utils/emotionCache";
import { CacheProvider } from "@emotion/react";
import { App } from "antd";

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <CacheProvider value={clientSideEmotionCache}>
          <QueryClientProvider client={queryClient}>
            <App>
              <Navigation>
                <Component {...pageProps} />
              </Navigation>
            </App>
          </QueryClientProvider>
        </CacheProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
