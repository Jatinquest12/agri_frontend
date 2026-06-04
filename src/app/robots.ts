import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/verify", "/verify/"],
      disallow: ["/farmer/", "/admin/", "/lab"],
    },
    sitemap: "/sitemap.xml",
  };
}
