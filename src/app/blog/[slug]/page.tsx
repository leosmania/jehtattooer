import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlForImage } from '@/sanity/lib/image';
import { PortableText } from 'next-sanity';
import styles from './Post.module.css';

export const revalidate = 60;

interface BlockContent {
  _type: string;
  style?: string;
  text?: string;
  children?: BlockContent[];
  asset?: any;
  hotspot?: any;
  [key: string]: any;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  image: any;
  content: BlockContent[];
  author: string;
  category: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const post = await client.fetch<BlogPost>(
      `*[_type == "blog" && slug.current == $slug && published == true][0]{
        _id,
        title,
        slug,
        excerpt,
        image,
        content,
        author,
        category,
        publishedAt,
        seoTitle,
        seoDescription,
        tags
      }`,
      { slug }
    );
    return post || null;
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    return null;
  }
}

async function getRelatedPosts(category: string, currentId: string) {
  try {
    return await client.fetch(
      `*[_type == "blog" && category == $category && _id != $currentId && published == true] | order(publishedAt desc)[0...3]{
        _id,
        title,
        slug,
        excerpt,
        image,
        publishedAt,
        category
      }`,
      { category, currentId }
    );
  } catch (error) {
    console.error('Erro ao buscar posts relacionados:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post não encontrado',
      description: 'Este post não foi encontrado',
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://jehtattooer.com.br/blog/${post.slug.current}`,
      images: [
        {
          url: post.image ? urlForImage(post.image).width(1200).height(630).url() : '/logo.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      return (
        <div className={styles.imageInContent}>
          <Image
            src={urlForImage(value).url()}
            alt={value.alt || 'Imagem do post'}
            width={800}
            height={600}
            className={styles.contentImage}
          />
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: any }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {children}
      </a>
    ),
  },
};

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return (
      <div className={styles.notFound}>
        <div className="container">
          <h1>Post não encontrado</h1>
          <p>Desculpe, não conseguimos encontrar este post.</p>
          <Link href="/blog" className="btn-primary">
            Voltar para o Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = await getRelatedPosts(post.category, post._id);
  const imageUrl = post.image
    ? urlForImage(post.image).width(1200).height(600).url()
    : 'https://images.unsplash.com/photo-1611082570075-814ae39665bc?q=80&w=1200&auto=format&fit=crop';

  const date = new Date(post.publishedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <article className={styles.post}>
        <div className={styles.header}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <span>{post.title}</span>
            </div>

            <h1 className={styles.title}>{post.title}</h1>

            <div className={styles.meta}>
              <span className={styles.date}>{date}</span>
              <span className={styles.author}>Por {post.author}</span>
              <span className={styles.category}>{post.category}</span>
            </div>
          </div>

          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt={post.title}
              width={1200}
              height={600}
              className={styles.headerImage}
              priority
            />
          </div>
        </div>

        <div className={styles.content}>
          <div className="container">
            <div className={styles.main}>
              <div className={styles.body}>
                <PortableText value={post.content} components={portableTextComponents} />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className={styles.tags}>
                  <h4>Tags:</h4>
                  <div className={styles.tagsList}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Autor */}
              <div className={styles.authorBox}>
                <h4>Sobre o Autor</h4>
                <p>
                  <strong>{post.author}</strong> - Tatuadora especialista em desenhos delicados, florais e fineline. Criadora de arte autoral e exclusiva.
                </p>
              </div>
            </div>

            {/* Sidebar - Posts relacionados */}
            {relatedPosts.length > 0 && (
              <aside className={styles.sidebar}>
                <h3 className={styles.sidebarTitle}>Leia também</h3>
                <div className={styles.relatedPosts}>
                  {relatedPosts.map((relPost: any) => {
                    const relImageUrl = relPost.image
                      ? urlForImage(relPost.image).width(300).height(200).url()
                      : 'https://images.unsplash.com/photo-1611082570075-814ae39665bc?q=80&w=300&auto=format&fit=crop';

                    return (
                      <Link key={relPost._id} href={`/blog/${relPost.slug.current}`} className={styles.relatedCard}>
                        <div className={styles.relatedImage}>
                          <Image
                            src={relImageUrl}
                            alt={relPost.title}
                            width={300}
                            height={200}
                          />
                        </div>
                        <div className={styles.relatedContent}>
                          <h4>{relPost.title}</h4>
                          <p>{relPost.excerpt}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      {/* CTA final */}
      <section className={styles.cta}>
        <div className="container">
          <h3>Gostou deste conteúdo?</h3>
          <p>Entre em contato e agende sua próxima tatuagem</p>
          <div className={styles.ctaButtons}>
            <a href="#contato" className="btn-primary">
              Solicitar Orçamento
            </a>
            <a
              href="https://wa.me/5548998158191?text=Olá%20Jéssica!%20Gostaria%20de%20saber%20mais%20sobre%20tatuagens."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
