import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Head from "next/head";
import "../styles/globals.css";
import Navigation from "../src/containers/navigation/Navigation";
import { createEmotionCache } from "../lib/utils/emotionCache";
import { CacheProvider } from "@emotion/react";
import { App } from "antd";

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const defaultDescription =
    "최신 영화 예매, TV 프로그램 탐색, 즐겨찾기 기능을 제공하는 개인 포트폴리오 프로젝트입니다.";

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={defaultDescription} />
        <meta property="og:title" content="영화 예매 서비스" />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:type" content="website" />
      </Head>

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
