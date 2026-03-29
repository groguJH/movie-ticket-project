import Head from "next/head";
import React, { JSX } from "react";

interface SeoProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
}

const DEFAULT_SITE_URL = "http://localhost:3000";

function trimSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function getSiteUrl(): string {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return trimSlash(envSiteUrl || DEFAULT_SITE_URL);
}

function toAbsoluteUrl(value: string): string {
  if (isAbsoluteUrl(value)) return value;

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export default function Seo({
  title,
  description,
  url,
  image,
  noindex,
}: SeoProps): JSX.Element {
  const siteName = "영화 예매 서비스";
  const titleContent = title ? `${title} | ${siteName}` : siteName;
  const resolvedUrl = url ? toAbsoluteUrl(url) : undefined;
  const resolvedImage = image ? toAbsoluteUrl(image) : undefined;

  return (
    <Head>
      <title>{titleContent}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={titleContent} />
      {description && <meta property="og:description" content={description} />}
      {resolvedImage && <meta property="og:image" content={resolvedImage} />}
      {resolvedUrl && <meta property="og:url" content={resolvedUrl} />}
      <meta property="og:type" content="website" />
      {resolvedUrl && <link rel="canonical" href={resolvedUrl} />}
    </Head>
  );
}
