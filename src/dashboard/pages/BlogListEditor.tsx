import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Copy, ExternalLink, FileText, PenLine, Plus, Search, Star, Trash2 } from "lucide-react";
import { useSectionDraft, newId } from "../useSectionDraft";
import { Field, Panel, SaveBar, StringListEditor, TextArea, TextInput } from "../components/ui";
import { formatPostDate, readingMinutes } from "../../content/blog";
import type { BlogPost } from "../../content/types";

type Filter = "all" | "published" | "draft";

export function blankPost(category = ""): BlogPost {
  const today = new Date().toISOString();
  return {
    id: newId("post"),
    slug: "",
    title: "",
    excerpt: "",
    coverImage: "",
    content: "",
    author: "",
    category,
    tags: [],
    published: false,
    publishedAt: today.slice(0, 10),
    updatedAt: today,
    featured: false,
    seoTitle: "",
    seoDescription: "",
  };
}

const BlogListEditor: React.FC = () => {
  const { draft, update, dirty, saving, error, savedAt, save, discard, resetToDefault } = useSectionDraft("blog");
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      all: draft.posts.length,
      published: draft.posts.filter((p) => p.published).length,
      draft: draft.posts.filter((p) => !p.published).length,
    }),
    [draft.posts]
  );

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...draft.posts]
      .filter((p) => (filter === "all" ? true : filter === "published" ? p.published : !p.published))
      .filter((p) => !q || `${p.title} ${p.category} ${p.tags.join(" ")}`.toLowerCase().includes(q))
      .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  }, [draft.posts, query, filter]);

  const createPost = () => {
    const post = blankPost(draft.categories[0]);
    update({ posts: [post, ...draft.posts] });
    navigate(`/dashboard/blog/${post.id}`);
  };

  const duplicate = (post: BlogPost) => {
    const copy: BlogPost = {
      ...post,
      id: newId("post"),
      title: `${post.title} (copy)`,
      slug: "",
      published: false,
      featured: false,
      updatedAt: new Date().toISOString(),
    };
    update({ posts: [copy, ...draft.posts] });
  };

  const remove = (post: BlogPost) => {
    if (!window.confirm(`Delete "${post.title || "Untitled"}"? You can still discard this before publishing.`)) return;
    update({ posts: draft.posts.filter((p) => p.id !== post.id) });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Blog</h2>
          <p className="text-sm text-slate-500 mt-1">Write, edit and publish articles for the News page.</p>
        </div>
        <button
          type="button"
          onClick={createPost}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] shadow-sm"
        >
          <Plus size={16} /> New post
        </button>
      </div>

      <section className="dash-card p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <label className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <span className="sr-only">Search posts</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, category or tag"
              className="w-full rounded-full pl-10 pr-4 py-2.5 outline-none"
            />
          </label>
          <div className="inline-flex gap-1 rounded-2xl bg-slate-100 p-1 self-start">
            {(["all", "published", "draft"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3.5 py-1.5 text-[12.5px] font-semibold capitalize ${
                  filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f === "draft" ? "Drafts" : f} <span className="tabular-nums text-slate-400">{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-14 text-center">
            <FileText size={22} className="mx-auto text-slate-300" />
            <p className="mt-3 text-[14px] font-semibold text-slate-700">
              {draft.posts.length ? "No posts match" : "No posts yet"}
            </p>
            <p className="text-[12.5px] text-slate-400 mt-1">
              {draft.posts.length ? "Try a different search or filter." : "Start with New post above."}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li
                key={post.id}
                className="group flex items-center gap-3 sm:gap-4 rounded-2xl p-2.5 sm:p-3 hover:bg-slate-50 transition-colors"
              >
                <Link to={`/dashboard/blog/${post.id}`} className="shrink-0">
                  <div className="w-16 h-12 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#111d43] to-[#2a3c78]">
                    {post.coverImage && <img src={post.coverImage} alt="" className="w-full h-full object-cover" />}
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        post.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    {post.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        <Star size={10} /> Featured
                      </span>
                    )}
                    {post.category && <span className="text-[12px] text-slate-400 truncate">{post.category}</span>}
                  </div>
                  <Link
                    to={`/dashboard/blog/${post.id}`}
                    className="mt-1 block text-[14.5px] font-semibold text-slate-900 hover:text-[#cb9733] truncate"
                  >
                    {post.title || "Untitled post"}
                  </Link>
                  <p className="text-[12px] text-slate-400 truncate">
                    {formatPostDate(post.publishedAt)} · {readingMinutes(post.content)} min read
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/dashboard/blog/${post.id}`}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full ring-1 ring-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:text-slate-900"
                  >
                    <PenLine size={13} /> Edit
                  </Link>
                  {post.published && post.slug && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View on site"
                      className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-white"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <button
                    type="button"
                    title="Duplicate"
                    onClick={() => duplicate(post)}
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => remove(post)}
                    className="p-2 text-slate-400 hover:text-[var(--dash-danger)] hover:bg-white"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2 items-start">
        <Panel title="Blog page" description="The heading at the top of /blog.">
          <Field label="Heading">
            <TextInput value={draft.heroTitle} onChange={(v) => update({ heroTitle: v })} />
          </Field>
          <Field label="Introduction">
            <TextArea value={draft.heroSubtitle} onChange={(v) => update({ heroSubtitle: v })} rows={2} />
          </Field>
        </Panel>
        <Panel title="Categories" description="Offered when writing a post, and as filters on the blog page.">
          <StringListEditor
            label="Categories"
            value={draft.categories}
            onChange={(categories) => update({ categories })}
            addLabel="Add category"
            placeholder="Company news"
          />
        </Panel>
      </div>

      <SaveBar
        dirty={dirty}
        saving={saving}
        error={error}
        savedAt={savedAt}
        onSave={() => void save()}
        onDiscard={discard}
        onReset={() => void resetToDefault()}
      />
    </div>
  );
};

export default BlogListEditor;
