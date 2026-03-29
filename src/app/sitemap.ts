import { MetadataRoute } from 'next';
import { client } from '@/sanity/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: { slug: { current: string }; publishedAt: string }[] = [];

  try {
    blogPosts = await client.fetch(
      `*[_type == "blog" && published == true] | order(publishedAt desc){ slug, publishedAt }`
    );
  } catch (error) {
    console.error('Erro ao buscar posts para sitemap:', error);
  }

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `https://jehtattooer.com.br/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://jehtattooer.com.br',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://jehtattooer.com.br/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogUrls,
  ];
}
