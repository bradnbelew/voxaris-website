import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';
import { blogPosts } from '@/data/blog-posts';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export function BlogIndex() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Blog | Voxaris — AI, Hiring, Local Search & Growth</title>
        <meta name="description" content="Practical thinking on AI agents, website conversion, local search, and building businesses that never miss a customer." />
        <link rel="canonical" href="https://voxaris.io/blog" />
        <meta property="og:title" content="Blog | Voxaris" />
        <meta property="og:description" content="Practical thinking on AI agents, website conversion, local search, and building businesses that never miss a customer." />
        <meta property="og:url" content="https://voxaris.io/blog" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />

      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
              style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(139,92,246,0.08) 0%, transparent 60%)' }}
            />
            <div className="absolute inset-0 noise-overlay opacity-[0.08]" />
          </div>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.2em] mb-4 block">Insights</span>
              <h1 className="text-4xl sm:text-5xl font-light text-white tracking-[-0.03em] mb-5">
                The Voxaris Blog
              </h1>
              <p className="text-[16px] text-white/40 max-w-xl leading-[1.75]">
                AI hiring, local search, website conversion, and the tools your competitors aren't using yet.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured */}
        <section className="pb-12">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              <Link
                to={`/blog/${featured.slug}`}
                className="group block rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
              >
                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-mono font-semibold text-white/40 bg-white/[0.06] border border-white/[0.08] px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/25">
                      <Clock className="w-3 h-3" />
                      {featured.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-light text-white tracking-[-0.02em] max-w-3xl group-hover:text-white/90 transition-colors leading-[1.2] mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-[14px] text-white/35 max-w-2xl leading-relaxed mb-8">
                    {featured.description}
                  </p>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-white/40 group-hover:text-white/70 group-hover:gap-3 transition-all">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Grid */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="grid sm:grid-cols-2 gap-5">
              {rest.map((post, i) => (
                <motion.div key={post.slug} {...fadeUp(0.1 + i * 0.07)}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] p-7 sm:p-8 transition-all duration-400 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[10px] font-mono font-semibold text-white/35 bg-white/[0.05] border border-white/[0.07] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/20">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-light text-white tracking-[-0.01em] group-hover:text-white/90 transition-colors leading-snug mb-3">
                      {post.title}
                    </h3>
                    <p className="text-[12px] text-white/30 leading-relaxed line-clamp-3 mb-6">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 text-[12px] font-mono text-white/25 group-hover:text-white/50 group-hover:gap-3 transition-all">
                      Read <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
