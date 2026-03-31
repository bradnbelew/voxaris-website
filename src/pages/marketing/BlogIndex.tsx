import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

import { blogPosts } from '@/data/blog-posts';

const ease = [0.22, 1, 0.36, 1];

export function BlogIndex() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Blog | Voxaris — AI Agents, Hospitality, Auto, Legal</title>
        <meta name="description" content="Insights on multi-agent AI, warm transfer technology, and how V·TEAMS is transforming lead conversion across industries." />
        <meta name="keywords" content="AI agents blog, V·TEAMS, multi-agent AI, warm transfer AI, AI for business, AI voice agents, AI video agents, conversational AI" />
        <link rel="canonical" href="https://voxaris.io/blog" />
        <meta property="og:title" content="Blog | Voxaris" />
        <meta property="og:description" content="Insights on multi-agent AI teams and how V·TEAMS is transforming lead conversion." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/blog" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />      </Helmet>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-16 lg:pt-40 lg:pb-20">
          <div className="container-editorial px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <p className="eyebrow text-slate-400 mb-4">Insights</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight max-w-3xl">
                The Voxaris Blog
              </h1>
              <p className="mt-5 text-lg text-slate-500 max-w-2xl leading-relaxed">
                Practical thinking on AI agents, website conversion, and building businesses
                that never miss a customer.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="pb-16">
          <div className="container-editorial px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              <Link
                to={`/blog/${featured.slug}`}
                className="group block bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-lg cursor-pointer"
              >
                <div className="p-8 sm:p-12 lg:p-16">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[11px] font-semibold text-slate-900 bg-slate-200/60 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {featured.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight max-w-3xl group-hover:text-slate-700 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed">
                    {featured.description}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Post Grid */}
        <section className="pb-24 lg:pb-32">
          <div className="container-editorial px-4">
            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {rest.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block h-full bg-white rounded-2xl border border-slate-100 hover:border-slate-200 p-8 sm:p-10 transition-all duration-500 hover:shadow-md cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[11px] font-semibold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:gap-3 transition-all">
                      Read <ArrowRight className="w-4 h-4" />
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
