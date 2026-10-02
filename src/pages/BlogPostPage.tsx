import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Check, Clock, Link2 } from "lucide-react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import NotFoundPage from "./NotFoundPage";
import { PostCover } from "./BlogPage";
import { useContentStore } from "../content/ContentProvider";
import { absoluteUrl, htmlToText, truncate, useSeo } from "../content/seo";
import { sanitizeHtml } from "../content/sanitize";
import { formatPostDate, publishedPosts, readingMinutes } from "../content/blog";

const SHARE_TARGETS = [
  { label: "LinkedIn", href: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  { label: "Facebook", href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { label: "X", href: (u: string, t: string) => `https://x.com/intent/post?url=${u}&text=${t}` },
  { label: "WhatsApp", href: (u: string, t: string) => `https://wa.me/?text=${t}%20${u}` },
];

const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const { content, preview } = useContentStore();
  const { blog, seo } = content;

  // The dashboard's preview window may show a post before it's published.
  const post = blog.posts.find((p) => p.slug === slug && (p.published || preview));
  const html = useMemo(() => (post ? sanitizeHtml(post.content) : ""), [post]);
  const url = absoluteUrl(seo.siteUrl, `/blog/${slug ?? ""}`);
  const [copied, setCopied] = useState(false);

  const related = useMemo(() => {
    if (!post) return [];
    const others = publishedPosts(blog.posts).filter((p) => p.id !== post.id);
    const same = others.filter((p) => p.category === post.category);
    return [...same, ...others.filter((p) => p.category !== post.category)].slice(0, 3);
  }, [blog.posts, post]);

  const description = post ? post.seoDescription || post.excerpt || truncate(htmlToText(post.content), 160) : "";

  useSeo({
    path: `/blog/${slug ?? ""}`,
    title: post ? post.seoTitle || post.title : "Article not found",
    description,
    image: post?.coverImage,
    type: "article",
    noindex: !post || !post.published,
    publishedTime: post?.publishedAt,
    modifiedTime: post?.updatedAt,
    jsonLd: post
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description,
            ...(post.coverImage ? { image: [absoluteUrl(seo.siteUrl, post.coverImage)] } : {}),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: { "@type": "Organization", name: post.author || seo.organizationName },
            publisher: {
              "@type": "Organization",
              name: seo.organizationName || seo.siteName,
              ...(seo.organizationLogo
                ? { logo: { "@type": "ImageObject", url: absoluteUrl(seo.siteUrl, seo.organizationLogo) } }
                : {}),
            },
            mainEntityOfPage: url,
            ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(seo.siteUrl, "/") },
              { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl(seo.siteUrl, "/blog") },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          },
        ]
      : undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return <NotFoundPage />;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(post.title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (insecure context); the share links still work.
    }
  };

  return (
    <div className="min-h-[100dvh] font-sans bg-background text-foreground selection:bg-brand-red selection:text-white">
      <Header />

      <main className="pt-28 md:pt-36 pb-20 md:pb-28">
        <article>
          <header className="mx-auto max-w-3xl px-5 sm:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={15} /> All articles
            </Link>
            {!post.published && (
              <p className="mt-5 w-fit rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-[12px] font-semibold">
                Draft preview, not visible to visitors
              </p>
            )}
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
              {post.category && <span className="font-semibold text-accent">{post.category}</span>}
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} /> {readingMinutes(post.content)} min read
              </span>
            </p>
            <h1 className="mt-4 text-[2.1rem] sm:text-5xl font-bold tracking-tight leading-[1.1] text-brand-blue dark:text-white text-balance">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
            )}
            {post.author && <p className="mt-6 text-[14px] font-semibold">By {post.author}</p>}
          </header>

          {post.coverImage && (
            <div className="mx-auto max-w-5xl px-5 sm:px-8 mt-10 md:mt-12">
              <div className="aspect-[16/9] overflow-hidden rounded-3xl bg-muted">
                <PostCover post={post} eager />
              </div>
            </div>
          )}

          <div
            className="blog-content mx-auto max-w-3xl px-5 sm:px-8 mt-10 md:mt-14"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <footer className="mx-auto max-w-3xl px-5 sm:px-8 mt-12"><div className="pt-8 border-t border-border">
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-muted px-3 py-1 text-[12.5px] font-medium text-foreground/75">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-semibold mr-1">Share</span>
              {SHARE_TARGETS.map((t) => (
                <a
                  key={t.label}
                  href={t.href(encodedUrl, encodedTitle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border px-3.5 py-1.5 text-[12.5px] font-semibold hover:border-accent hover:text-accent transition-colors"
                >
                  {t.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => void copyLink()}
                className="inline-flex items-center gap-1.5 border border-border px-3.5 py-1.5 text-[12.5px] font-semibold hover:border-accent hover:text-accent transition-colors"
              >
                {copied ? <Check size={13} /> : <Link2 size={13} />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div></footer>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mx-auto max-w-7xl px-5 sm:px-8 mt-20 md:mt-28">
            <h2 id="related-heading" className="text-2xl md:text-3xl font-bold tracking-tight text-brand-blue dark:text-white">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                    <PostCover post={p} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <p className="mt-4 text-[13px] text-muted-foreground">{formatPostDate(p.publishedAt)}</p>
                  <h3 className="mt-1.5 text-lg font-bold leading-snug group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <ContactFooter />
    </div>
  );
};

export default BlogPostPage;
