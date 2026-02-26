import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';
import { FloatingMaria } from '@/components/marketing/FloatingMaria';
import { blogPosts } from '@/data/blog-posts';

const ease = [0.22, 1, 0.36, 1];

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const canonicalUrl = `https://voxaris.io/blog/${post.slug}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Voxaris',
      url: 'https://voxaris.io',
    },
    datePublished: '2026-02-01',
    dateModified: '2026-02-25',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: post.keywords.join(', '),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{post.title} | Voxaris Blog</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${post.title} | Voxaris Blog`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Voxaris" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content="2026-02-01" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <script type="application/ld+json">
          {JSON.stringify(articleJsonLd)}
        </script>
      </Helmet>
      <Navbar />
      <main>
        {/* Header */}
        <section className="pt-32 pb-12 lg:pt-40 lg:pb-16">
          <div className="container-narrow px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" /> All Articles
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-[11px] font-semibold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.15]">
                {post.title}
              </h1>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold">
                  ES
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                  <p className="text-[12px] text-slate-400">Founder of Voxaris &middot; {post.date}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-24 lg:pb-32">
          <div className="container-narrow px-4">
            <motion.article
              className="prose-voxaris"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              {post.content.map((section, i) => {
                switch (section.type) {
                  case 'heading':
                    return (
                      <h2
                        key={i}
                        className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-14 mb-5"
                      >
                        {section.text}
                      </h2>
                    );
                  case 'subheading':
                    return (
                      <h3
                        key={i}
                        className="text-xl font-bold text-slate-900 tracking-tight mt-10 mb-4"
                      >
                        {section.text}
                      </h3>
                    );
                  case 'paragraph':
                    return (
                      <p
                        key={i}
                        className="text-[16px] sm:text-[17px] text-slate-600 leading-[1.8] mb-5"
                      >
                        {section.text}
                      </p>
                    );
                  case 'list':
                    return (
                      <ul key={i} className="space-y-3 my-6 pl-0">
                        {section.items?.map((item, j) => (
                          <li
                            key={j}
                            className="flex gap-3 text-[16px] text-slate-600 leading-[1.7]"
                          >
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  case 'quote':
                    return (
                      <blockquote
                        key={i}
                        className="border-l-2 border-slate-200 pl-6 my-8 text-[17px] text-slate-500 italic"
                      >
                        {section.text}
                      </blockquote>
                    );
                  case 'divider':
                    return (
                      <hr
                        key={i}
                        className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
                      />
                    );
                  case 'cta':
                    return (
                      <div key={i} className="mt-14 pt-10 border-t border-slate-100">
                        <p className="text-lg text-slate-500 mb-5">
                          See what an AI video agent looks like on a real website.
                        </p>
                        <Link
                          to={section.href || '/book-demo'}
                          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg"
                        >
                          {section.label}
                        </Link>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </motion.article>

            {/* Related Posts */}
            <div className="mt-20 pt-12 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Continue Reading</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                {blogPosts
                  .filter((p) => p.slug !== post.slug)
                  .slice(0, 2)
                  .map((related) => (
                    <Link
                      key={related.slug}
                      to={`/blog/${related.slug}`}
                      className="group p-6 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                    >
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {related.category}
                      </span>
                      <h4 className="mt-2 text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug">
                        {related.title}
                      </h4>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingMaria />
    </div>
  );
}
