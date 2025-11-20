import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, EXTERNAL_SITEMAPS, getBaseUrl } from "../config/seo";

export default function robots(): MetadataRoute.Robots {
  const rules = ALLOW_INDEXING
    ? { userAgent: "*", allow: "/" }
    : { userAgent: "*", disallow: "/" };

  const sitemap = ALLOW_INDEXING
    ? [`${getBaseUrl()}/sitemap.xml`, ...EXTERNAL_SITEMAPS]
    : undefined;

  return {
    rules,
    ...(sitemap ? { sitemap } : {}),
  };
}
