import type { Metadata } from "next";

type MetadataProps = {
  title?: string;
  description?: string;
  url?: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string | Date;
  tags?: string[];
};

export function constructMetadata({
  title = "Esmaeil Abedi - Software Developer",
  description = "Personal website and blog of Esmaeil Abedi, software developer and writer.",
  url = "/",
  ogImage = "/og-image.jpg",
  type = "website",
  publishedTime,
  tags = [],
}: MetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  const fullUrl = `${baseUrl}${url}`;
  const ogImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${baseUrl}${ogImage}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Esmaeil Abedi",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
      ...(type === "article" && {
        article: {
          publishedTime: publishedTime
            ? new Date(publishedTime).toISOString()
            : undefined,
          tags,
        },
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: "@johndoe",
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
  };
}
