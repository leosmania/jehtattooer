'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/image';
import styles from './Blog.module.css';

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

interface BlogClientProps {
  allPosts: BlogPost[];
  categories: string[];
}

export default function BlogClient({ allPosts, categories }: BlogClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category');

  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.category === selectedCategory)
    : allPosts;

  const handleCategoryChange = (category: string | null) => {
    if (category) {
      router.push(`/blog?category=${category}`);
    } else {
      router.push('/blog');
    }
  };

  return (
    <>
      {/* Filtro de categorias */}
      {categories.length > 0 && (
        <div className={styles.filterContainer}>
          <h3>Filtrar por categoria:</h3>
          <div className={styles.categoryTags}>
            <button
              onClick={() => handleCategoryChange(null)}
              className={`${styles.tag} ${!selectedCategory ? styles.active : ''}`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`${styles.tag} ${selectedCategory === cat ? styles.active : ''}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid de posts */}
      {filteredPosts.length > 0 ? (
        <div className={styles.postsGrid}>
          {filteredPosts.map((post) => {
            const imageUrl = post.image
              ? urlForImage(post.image).width(500).height(300).url()
              : 'https://images.unsplash.com/photo-1611082570075-814ae39665bc?q=80&w=500&auto=format&fit=crop';

            const date = new Date(post.publishedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });

            return (
              <article key={post._id} className={styles.postCard}>
                <Link href={`/blog/${post.slug.current}`} className={styles.imageWrapper}>
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    width={500}
                    height={300}
                    className={styles.image}
                  />
                  <span className={styles.categoryBadge}>{post.category}</span>
                </Link>

                <div className={styles.content}>
                  <Link href={`/blog/${post.slug.current}`}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                  </Link>

                  <p className={styles.excerpt}>{post.excerpt}</p>

                  <div className={styles.meta}>
                    <span className={styles.date}>{date}</span>
                    <span className={styles.author}>Por {post.author}</span>
                  </div>

                  <Link href={`/blog/${post.slug.current}`} className={styles.readMore}>
                    Ler mais →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.noContent}>
          <p>Nenhum post encontrado nesta categoria.</p>
        </div>
      )}
    </>
  );
}
