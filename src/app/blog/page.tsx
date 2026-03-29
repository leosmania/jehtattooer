import { client } from '@/sanity/client';
import BlogClient from './BlogClient';
import styles from './Blog.module.css';

export const revalidate = 60;

export const metadata = {
  title: 'Blog | JehTattooer - Dicas e Inspiração sobre Tatuagens',
  description: 'Artigos sobre cuidados com tatuagem, inspiração, tendências e histórias. Leia as dicas da tatuadora Jéssica Barboza.',
  openGraph: {
    title: 'Blog | JehTattooer',
    description: 'Artigos sobre tatuagens: cuidados, inspiração, tendências e muito mais',
    url: 'https://jehtattooer.com.br/blog',
  },
};

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  image: any;
  author: string;
  category: string;
  publishedAt: string;
}

export default async function Blog() {
  let posts: BlogPost[] = [];

  try {
    posts = await client.fetch(
      `*[_type == "blog" && published == true] | order(publishedAt desc){
        _id,
        title,
        slug,
        excerpt,
        image,
        author,
        category,
        publishedAt
      }`
    );
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
  }

  const categories = [...new Set(posts.map((p) => p.category))].sort();

  return (
    <>
      <section className={styles.blogHeader}>
        <div className="container">
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>
            Dicas de cuidado, inspiração e histórias sobre tatuagens delicadas
          </p>
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className="container">
          <BlogClient allPosts={posts} categories={categories} />
        </div>
      </section>
    </>
  );
}
