import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import { useSection } from "../content/ContentProvider";
import { useSeo } from "../content/seo";
import { formatPostDate, publishedPosts, readingMinutes } from "../content/blog";
import type { BlogPost } from "../content/types";

/** Cover image, or a branded panel when a post has none. */
export const PostCover: React.FC<{ post: BlogPost; className?: string; eager?: boolean }> = ({
  post,
  className = "",
  eager,
}) =>
  post.coverImage ? (
    <img
      src={post.coverImage}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`w-full h-full object-cover ${className}`}
    />
  ) : (
    <div
      aria-hidden
      className={`w-full h-full flex items-end p-6 bg-gradient-to-br from-[#111d43] via-[#1b2a5c] to-[#2a3c78] ${className}`}
    >
      <span className="text-[13px] font-semibold text-[#e0b458]">{post.category || "JB Group"}</span>
    </div>
  );

const PostMeta: React.FC<{ post: BlogPost }> = ({ post }) => (
  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
    {post.category && <span className="font-semibold text-accent">{post.category}</span>}
    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
    <span className="inline-flex items-center gap-1">
      <Clock size={13} /> {readingMinutes(post.content)} min read
    </span>
  </p>
);

const BlogPage: React.FC = () => {
  const blog = useSection("blog");
  const reduce = useReducedMotion();
  const posts = useMemo(() => publishedPosts(blog.posts), [blog.posts]);
  const [category, setCategory] = useState<string>("All");

  useSeo({ path: "/blog", title: blog.heroTitle, description: blog.heroSubtitle });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = useMemo(() => {
    const used = new Set(posts.map((p) => p.category).filter(Boolean));
    return ["All", ...blog.categories.filter((c) => used.has(c)), ...[...used].filter((c) => !blog.categories.includes(c))];
  }, [posts, blog.categories]);

  const filtered = category === "All" ? posts : posts.filter((p) => p.category === category);
  const lead = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p !== lead);

  const reveal = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.55, delay: Math.min(i, 5) * 0.06, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <div className="min-h-[100dvh] font-sans bg-background text-foreground selection:bg-brand-red selection:text-white">
      <Header />

      <main className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <header className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-brand-blue dark:text-white">
              {blog.heroTitle}
            </h1>
            {blog.heroSubtitle && (
              <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-[60ch]">
                {blog.heroSubtitle}
              </p>
            )}
          </header>

          {categories.length > 2 && (
            <div className="mt-10 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto">
              <div role="tablist" aria-label="Filter by category" className="flex gap-2 w-max">
                {categories.map((c) => (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={category === c}
                    onClick={() => setCategory(c)}
                    className={`whitespace-nowrap px-4 py-2 text-[13px] font-semibold transition-colors ${
                      category === c
                        ? "bg-brand-blue text-white dark:bg-accent"
                        : "bg-muted text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!lead ? (
            <div className="mt-16 rounded-3xl border border-dashed border-border px-6 py-20 text-center">
              <p className="text-lg font-semibold">No articles yet</p>
              <p className="mt-2 text-muted-foreground">New posts will appear here as soon as they're published.</p>
            </div>
          ) : (
            <>
              {/* Lead story */}
              <motion.article {...reveal(0)} className="mt-12 md:mt-14">
                <Link
                  to={`/blog/${lead.slug}`}
                  className="group grid gap-6 md:gap-10 lg:grid-cols-[1.25fr_1fr] items-center"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-muted">
                    <PostCover
                      post={lead}
                      eager
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div>
                    <PostMeta post={lead} />
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] text-brand-blue dark:text-white group-hover:text-accent transition-colors">
                      {lead.title}
                    </h2>
                    {lead.excerpt && (
                      <p className="mt-4 text-muted-foreground leading-relaxed max-w-[55ch]">{lead.excerpt}</p>
                    )}
                    <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-brand-blue dark:text-white">
                      Read article
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </motion.article>

              {rest.length > 0 && (
                <div className="mt-16 md:mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <motion.article key={post.id} {...reveal(i + 1)}>
                      <Link to={`/blog/${post.slug}`} className="group block">
                        <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                          <PostCover
                            post={post}
                            className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="mt-5">
                          <PostMeta post={post} />
                          <h3 className="mt-3 text-xl font-bold tracking-tight leading-snug text-brand-blue dark:text-white group-hover:text-accent transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ContactFooter />
    </div>
  );
};

export default BlogPage;
