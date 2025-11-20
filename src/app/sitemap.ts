import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, getBaseUrl } from "../config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!ALLOW_INDEXING) return [];

  const baseUrl = getBaseUrl();
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      images: [`${baseUrl}/logo.webp`],
    },
  ];
}
