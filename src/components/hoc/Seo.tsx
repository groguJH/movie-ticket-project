import Head from "next/head";
import React, { JSX } from "react";

interface SeoProps {
  description?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
}

export default function Seo({
  description,
  url,
  image,
  noindex,
}: SeoProps): JSX.Element {
  const siteName = "영화 예매 서비스";

  return (
    <Head>
      <title>{siteName} </title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* open graph 공유용 */}
      <meta property="og:title" content={siteName} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* 모바일 앱 */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
  );
}
