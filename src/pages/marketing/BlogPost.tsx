import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';
import { blogPosts } from '@/data/blog-posts';

const ease = [0.22, 1, 0.36, 1] as const;

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
      url: 'https://www.linkedin.com/in/ethanstopperich',
      jobTitle: 'President & Founder',
      worksFor: { '@type': 'Organization', name: 'Voxaris' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Voxaris',
      url: 'https://voxaris.io',
      logo: { '@type': 'ImageObject', url: 'https://voxaris.io/favicon.png' },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    keywords: post.keywords.join(', '),
  };

  return (
    <div className="min-h-screen bg-black">
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
        <meta property="article:published_time" content={post.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      </Helmet>

      <Navbar />

      <main>
        {/* Header */}
        <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)' }}
            />
            <div className="absolute inset-0 noise-overlay opacity-[0.07]" />
          </div>
          <div className="max-w-2xl mx-auto px-6 sm:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-white/25 hover:text-white/60 transition-colors mb-8"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Articles
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-mono font-semibold text-white/35 bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/20">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-light text-white tracking-[-0.02em] leading-[1.15] mb-6">
                {post.title}
              </h1>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-500/20 flex items-center justify-center text-gold-400 text-[12px] font-bold font-mono">
                  ES
                </div>
                <div>
                  <p className="text-[13px] font-medium text-white/60">{post.author}</p>
                  <p className="text-[11px] font-mono text-white/25">Founder · {post.date}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-6 sm:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        {/* Content */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-2xl mx-auto px-6 sm:px-8">
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="pt-10"
            >
              {post.content.map((section, i) => {
                switch (section.type) {
                  case 'heading':
                    return (
                      <h2 key={i} className="text-2xl sm:text-3xl font-light text-white tracking-[-0.02em] mt-14 mb-5">
                        {section.text}
                      </h2>
                    );
                  case 'subheading':
                    return (
                      <h3 key={i} className="text-xl font-light text-white/80 tracking-[-0.01em] mt-10 mb-4">
                        {section.text}
                      </h3>
                    );
                  case 'paragraph':
                    return (
                      <p key={i} className="text-[16px] text-white/50 leading-[1.85] mb-5">
                        {section.text}
                      </p>
                    );
                  case 'list':
                    return (
                      <ul key={i} className="space-y-3 my-6 pl-0">
                        {section.items?.map((item, j) => (
                          <li key={j} className="flex gap-3 text-[15px] text-white/45 leading-[1.75]">
                            <span className="mt-[9px] w-1 h-1 rounded-full bg-gold-500/60 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  case 'quote':
                    return (
                      <blockquote key={i} className="border-l border-gold-500/30 pl-6 my-8 text-[17px] text-white/35 italic">
                        {section.text}
                      </blockquote>
                    );
                  case 'divider':
                    return (
                      <hr key={i} className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    );
                  case 'cta':
                    return (
                      <div key={i} className="mt-14 pt-10 border-t border-white/[0.06]">
                        <p className="text-[15px] text-white/35 mb-5">
                          See what an AI system looks like for your business.
                        </p>
                        <Link
                          to={section.href || '/book-demo'}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[13px] font-semibold px-7 h-11 rounded-full border border-gold-400/30 shadow-gold-sm transition-all duration-300 hover:-translate-y-0.5 group"
                        >
                          {section.label}
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </motion.article>

            {/* Related posts */}
            <div className="mt-20 pt-10 border-t border-white/[0.06]">
              <h3 className="text-[11px] font-mono text-white/25 uppercase tracking-[0.2em] mb-6">Continue Reading</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {blogPosts
                  .filter((p) => p.slug !== post.slug)
                  .slice(0, 2)
                  .map((related) => (
                    <Link
                      key={related.slug}
                      to={`/blog/${related.slug}`}
                      className="group p-5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
                        {related.category}
                      </span>
                      <h4 className="mt-2 text-[14px] font-light text-white/60 group-hover:text-white/90 transition-colors leading-snug">
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
    </div>
  );
}
