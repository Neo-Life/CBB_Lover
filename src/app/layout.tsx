import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import I18nProvider from "../components/i18n/I18nProvider";
import "../assets/globals.css";
import GlobalScrollDown from "../components/ui/ScrollDown/GlobalScrollDown";
import {
  type Locale,
  normalizeLocale,
  detectLocaleFromAccept,
  getSiteMeta,
  OG_LOCALE_MAP,
} from "../components/i18n/locale";
import { ALLOW_INDEXING } from "../config/seo";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const rawCookie = cookieStore.get("locale")?.value as string | undefined;
  const accept = headerStore.get("accept-language") || "";

  const locale: Locale = normalizeLocale(rawCookie) ?? detectLocaleFromAccept(accept);
  const { title, description } = getSiteMeta(locale);

  const robots = ALLOW_INDEXING
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      };

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    icons: { icon: "/logo.png" },
    alternates: { canonical: SITE_URL },
    robots,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      locale: OG_LOCALE_MAP[locale],
      images: [
        {
          url: "/logo.webp",
          width: 800,
          height: 800,
          alt: "AstrBot Logo",
        },
      ],
    },
  } satisfies Metadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const rawCookie = cookieStore.get("locale")?.value as string | undefined;
  const accept = headerStore.get("accept-language") || "";
  const initialLocale: Locale = normalizeLocale(rawCookie) ?? detectLocaleFromAccept(accept);

  return (
    <html lang={initialLocale} className="dark" data-theme="dark">
      <body className={`antialiased`}>
        <div className="relative">
        <I18nProvider initialLocale={initialLocale}>
          <div className="relative z-20">
            {children}
          </div>
        </I18nProvider>
        <GlobalScrollDown />
        <Analytics />
        </div>
      </body>
    </html>
  );
}
