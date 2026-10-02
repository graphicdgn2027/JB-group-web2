import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { TableKit } from "@tiptap/extension-table";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Code2,
  Columns3,
  Eraser,
  Eye,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Palette,
  Quote,
  Redo2,
  Rows3,
  Send,
  SlidersHorizontal,
  Strikethrough,
  Table2,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
  UploadCloud,
  X,
} from "lucide-react";
import { useSectionDraft } from "../useSectionDraft";
import { useAccess } from "../AuthProvider";
import { usePreviewControl } from "../previewControl";
import { Field, ImageInput, MediaPicker, Select, TextArea, TextInput, Toggle } from "../components/ui";
import { LengthHint, SearchPreview } from "../components/SearchPreview";
import { useContentStore } from "../../content/ContentProvider";
import { readingMinutes, slugify, wordCount } from "../../content/blog";
import { htmlToText } from "../../content/seo";
import type { BlogPost } from "../../content/types";

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Brand blue", value: "#111d43" },
  { label: "Gold", value: "#b8862b" },
  { label: "Red", value: "#c0392b" },
  { label: "Green", value: "#15803d" },
  { label: "Grey", value: "#64748b" },
];

const BLOCK_STYLES = [
  { value: "p", label: "Normal text" },
  { value: "2", label: "Heading" },
  { value: "3", label: "Subheading" },
  { value: "4", label: "Small heading" },
];

/* ------------------------------------------------------------- toolbar bits */

const TB: React.FC<{
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ label, onClick, active, disabled, children }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`w-9 h-9 shrink-0 inline-flex items-center justify-center transition-colors disabled:opacity-30 ${
      active ? "bg-[var(--dash-brand)] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span aria-hidden className="w-px h-6 bg-slate-200 mx-1 shrink-0" />;

function useToolbarState(editor: Editor | null) {
  return useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return null;
      const level = [2, 3, 4].find((l) => e.isActive("heading", { level: l }));
      return {
        block: level ? String(level) : "p",
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
        strike: e.isActive("strike"),
        highlight: e.isActive("highlight"),
        color: (e.getAttributes("textStyle").color as string | undefined) ?? "",
        left: e.isActive({ textAlign: "left" }),
        center: e.isActive({ textAlign: "center" }),
        right: e.isActive({ textAlign: "right" }),
        justify: e.isActive({ textAlign: "justify" }),
        bullet: e.isActive("bulletList"),
        ordered: e.isActive("orderedList"),
        quote: e.isActive("blockquote"),
        code: e.isActive("codeBlock"),
        link: e.isActive("link"),
        linkHref: (e.getAttributes("link").href as string | undefined) ?? "",
        image: e.isActive("image"),
        imageAlt: (e.getAttributes("image").alt as string | undefined) ?? "",
        table: e.isActive("table"),
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
      };
    },
  });
}

/* --------------------------------------------------------------- the editor */

const BlogPostEditor: React.FC = () => {
  const { postId } = useParams();
  const { draft, update, dirty, saving, save } = useSectionDraft("blog");
  const { content: published } = useContentStore();
  const access = useAccess();
  const canEdit = access.canEditSection("blog");
  const preview = usePreviewControl();
  const post = draft.posts.find((p) => p.id === postId);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [colorOpen, setColorOpen] = useState(false);

  // Keep the latest draft in a ref so the debounced editor callback never
  // writes back a stale copy of the other posts.
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const patch = useCallback(
    (p: Partial<BlogPost>) => {
      const current = draftRef.current;
      update({
        posts: current.posts.map((x) =>
          x.id === postId ? { ...x, ...p, updatedAt: new Date().toISOString() } : x
        ),
      });
    },
    [postId, update]
  );

  // Typing writes the draft after a short pause rather than on every key.
  const pending = useRef<number | null>(null);
  const flush = useRef<() => void>(() => {});

  const editor = useEditor({
    immediatelyRender: true,
    editable: canEdit,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      TextStyle,
      Color,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: "Start writing your article…" }),
    ],
    content: post?.content ?? "",
    editorProps: {
      attributes: {
        class: "blog-content",
        "aria-label": "Article body",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: e }) => {
      if (pending.current) window.clearTimeout(pending.current);
      flush.current = () => {
        pending.current = null;
        patch({ content: e.isEmpty ? "" : e.getHTML() });
      };
      pending.current = window.setTimeout(() => flush.current(), 300);
    },
  });

  // Save anything still waiting when leaving the page.
  useEffect(
    () => () => {
      if (pending.current) {
        window.clearTimeout(pending.current);
        flush.current();
      }
    },
    []
  );

  // Draft discarded or replaced elsewhere: show it, unless someone is typing.
  useEffect(() => {
    if (!editor || !post || editor.isFocused || pending.current) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (current !== post.content) editor.commands.setContent(post.content || "", { emitUpdate: false });
  }, [editor, post?.content]); // eslint-disable-line react-hooks/exhaustive-deps

  const state = useToolbarState(editor);

  const [slugTouched, setSlugTouched] = useState(
    () => !!post && !!post.slug && post.slug !== slugify(post.title)
  );

  const words = useMemo(() => (post ? wordCount(post.content) : 0), [post]);
  const slugTaken = !!post?.slug && draft.posts.some((p) => p.id !== post.id && p.slug === post.slug);
  const isLive = !!published.blog.posts.find((p) => p.id === postId && p.published);

  if (!post) {
    return (
      <div className="dash-card p-10 text-center">
        <p className="text-[15px] font-semibold text-slate-800">This post doesn't exist</p>
        <p className="text-[13px] text-slate-500 mt-1">It may have been deleted, or the draft was discarded.</p>
        <Link
          to="/dashboard/blog"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--dash-brand)] px-5 py-2.5 text-[13px] font-semibold text-white"
        >
          <ArrowLeft size={15} /> All posts
        </Link>
      </div>
    );
  }

  const setTitle = (title: string) =>
    patch(slugTouched ? { title } : { title, slug: slugify(title) });

  const chain = () => editor!.chain().focus();

  const applyLink = () => {
    const href = linkValue.trim();
    if (!href) chain().extendMarkRange("link").unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
  };

  const description = post.seoDescription || post.excerpt || htmlToText(post.content).slice(0, 160);

  const settings = (
    <div className="space-y-5">
      <div className="rounded-2xl bg-slate-50 p-4 space-y-3">
        <Toggle checked={post.published} onChange={(v) => patch({ published: v })} label="Published on the website" />
        <Toggle checked={post.featured} onChange={(v) => patch({ featured: v })} label="Feature at the top of the blog" />
        <p className="text-[11.5px] text-slate-500 leading-relaxed">
          Switching these only changes your draft. Press {access.canPublish ? "Publish" : "Submit"} to send it live.
        </p>
      </div>

      <Field label="Publish date">
        <TextInput type="date" value={post.publishedAt} onChange={(v) => patch({ publishedAt: v })} />
      </Field>

      <Field
        label="Web address"
        hint={
          slugTaken ? (
            <span className="text-[var(--dash-danger)] font-semibold">Another post already uses this address.</span>
          ) : (
            <span className="break-all">/blog/{post.slug || "…"}</span>
          )
        }
      >
        <TextInput
          value={post.slug}
          onChange={(v) => {
            setSlugTouched(true);
            patch({ slug: slugify(v) });
          }}
          placeholder="from-the-title"
        />
      </Field>

      <Field label="Category">
        <Select
          value={post.category}
          onChange={(v) => patch({ category: v })}
          options={[
            { value: "", label: "No category" },
            ...draft.categories.map((c) => ({ value: c, label: c })),
            ...(post.category && !draft.categories.includes(post.category)
              ? [{ value: post.category, label: post.category }]
              : []),
          ]}
        />
      </Field>

      <Field label="Tags" hint="Separate with commas.">
        <TextInput
          value={post.tags.join(", ")}
          onChange={(v) =>
            patch({
              tags: v
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          placeholder="lubricants, partnership"
        />
      </Field>

      <Field label="Author">
        <TextInput value={post.author} onChange={(v) => patch({ author: v })} placeholder="JB Group" />
      </Field>

      <Field label="Summary" hint={<LengthHint value={post.excerpt} ideal={[80, 160]} note="Shown on the blog page and in previews." />}>
        <TextArea value={post.excerpt} onChange={(v) => patch({ excerpt: v })} rows={3} />
      </Field>

      <ImageInput
        label="Cover image"
        value={post.coverImage}
        onChange={(v) => patch({ coverImage: v })}
        hint="Wide images work best, about 1600×900."
      />

      <div className="pt-5 border-t border-slate-100 space-y-4">
        <p className="text-[13px] font-bold text-slate-900">Search &amp; sharing</p>
        <Field label="SEO title" hint={<LengthHint value={post.seoTitle || post.title} ideal={[30, 60]} note="Leave empty to use the post title." />}>
          <TextInput value={post.seoTitle} onChange={(v) => patch({ seoTitle: v })} placeholder={post.title} />
        </Field>
        <Field label="SEO description" hint={<LengthHint value={post.seoDescription} ideal={[120, 160]} note="Leave empty to use the summary." />}>
          <TextArea value={post.seoDescription} onChange={(v) => patch({ seoDescription: v })} rows={3} />
        </Field>
        <SearchPreview
          siteName={published.seo.siteName}
          siteUrl={published.seo.siteUrl}
          path={`/blog/${post.slug}`}
          title={`${post.seoTitle || post.title || "Untitled"}${published.seo.titleSeparator}${published.seo.siteName}`}
          description={description}
        />
      </div>
    </div>
  );

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 lg:-mt-8">
      {/* Document bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3">
        <Link
          to="/dashboard/blog"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white"
        >
          <ArrowLeft size={15} /> All posts
        </Link>
        <span
          className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
            isLive ? "bg-emerald-50 text-emerald-700" : "bg-slate-200/70 text-slate-600"
          }`}
        >
          {isLive ? "Live on site" : "Not published"}
        </span>
        {dirty && <span className="text-[12px] text-amber-600 font-medium">Unpublished edits</span>}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => preview.open(post.slug ? `/blog/${post.slug}` : "/blog")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold bg-white ring-1 ring-slate-200 text-slate-700 hover:text-slate-900"
          >
            <Eye size={14} /> <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="xl:hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold bg-white ring-1 ring-slate-200 text-slate-700 hover:text-slate-900"
          >
            <SlidersHorizontal size={14} /> <span className="hidden sm:inline">Post settings</span>
          </button>
          {canEdit && (
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={() => {
                if (pending.current) {
                  window.clearTimeout(pending.current);
                  flush.current();
                }
                void save();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] disabled:opacity-40"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : access.canPublish ? <UploadCloud size={14} /> : <Send size={14} />}
              {access.canPublish ? "Publish" : "Submit"}
            </button>
          )}
        </div>
      </div>

      {/* Ribbon */}
      {canEdit && editor && state && (
        <div className="sticky top-[72px] z-20 px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[var(--dash-shadow-sm)]">
            <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1.5">
              <TB label="Undo (Ctrl+Z)" onClick={() => chain().undo().run()} disabled={!state.canUndo}>
                <Undo2 size={16} />
              </TB>
              <TB label="Redo (Ctrl+Y)" onClick={() => chain().redo().run()} disabled={!state.canRedo}>
                <Redo2 size={16} />
              </TB>
              <Divider />
              <label className="sr-only" htmlFor="block-style">Text style</label>
              <select
                id="block-style"
                value={state.block}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "p") chain().setParagraph().run();
                  else chain().setHeading({ level: Number(v) as 2 | 3 | 4 }).run();
                }}
                className="h-9 shrink-0 rounded-full pl-3 pr-2 text-[13px] font-medium cursor-pointer outline-none"
              >
                {BLOCK_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Divider />
              <TB label="Bold (Ctrl+B)" active={state.bold} onClick={() => chain().toggleBold().run()}>
                <Bold size={16} />
              </TB>
              <TB label="Italic (Ctrl+I)" active={state.italic} onClick={() => chain().toggleItalic().run()}>
                <Italic size={16} />
              </TB>
              <TB label="Underline (Ctrl+U)" active={state.underline} onClick={() => chain().toggleUnderline().run()}>
                <UnderlineIcon size={16} />
              </TB>
              <TB label="Strikethrough" active={state.strike} onClick={() => chain().toggleStrike().run()}>
                <Strikethrough size={16} />
              </TB>
              <TB label="Highlight" active={state.highlight} onClick={() => chain().toggleHighlight().run()}>
                <Highlighter size={16} />
              </TB>
              <div className="relative shrink-0">
                <TB label="Text colour" active={!!state.color} onClick={() => setColorOpen((o) => !o)}>
                  <Palette size={16} style={state.color ? { color: state.color } : undefined} />
                </TB>
              </div>
              <Divider />
              <TB label="Align left" active={state.left} onClick={() => chain().setTextAlign("left").run()}>
                <AlignLeft size={16} />
              </TB>
              <TB label="Centre" active={state.center} onClick={() => chain().setTextAlign("center").run()}>
                <AlignCenter size={16} />
              </TB>
              <TB label="Align right" active={state.right} onClick={() => chain().setTextAlign("right").run()}>
                <AlignRight size={16} />
              </TB>
              <TB label="Justify" active={state.justify} onClick={() => chain().setTextAlign("justify").run()}>
                <AlignJustify size={16} />
              </TB>
              <Divider />
              <TB label="Bulleted list" active={state.bullet} onClick={() => chain().toggleBulletList().run()}>
                <List size={16} />
              </TB>
              <TB label="Numbered list" active={state.ordered} onClick={() => chain().toggleOrderedList().run()}>
                <ListOrdered size={16} />
              </TB>
              <TB label="Quote" active={state.quote} onClick={() => chain().toggleBlockquote().run()}>
                <Quote size={16} />
              </TB>
              <TB label="Code" active={state.code} onClick={() => chain().toggleCodeBlock().run()}>
                <Code2 size={16} />
              </TB>
              <TB label="Divider line" onClick={() => chain().setHorizontalRule().run()}>
                <Minus size={16} />
              </TB>
              <Divider />
              <TB
                label="Link"
                active={state.link || linkOpen}
                onClick={() => {
                  setLinkValue(state.linkHref);
                  setLinkOpen((o) => !o);
                }}
              >
                <Link2 size={16} />
              </TB>
              <TB label="Insert image" onClick={() => setPicking(true)}>
                <ImagePlus size={16} />
              </TB>
              <TB
                label="Insert table"
                active={state.table}
                onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              >
                <Table2 size={16} />
              </TB>
              <Divider />
              <TB label="Clear formatting" onClick={() => chain().unsetAllMarks().clearNodes().run()}>
                <Eraser size={16} />
              </TB>
            </div>

            {colorOpen && (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-3 py-2">
                <span className="text-[12px] font-semibold text-slate-500 mr-1">Text colour</span>
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    title={c.label}
                    aria-label={c.label}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (c.value) chain().setColor(c.value).run();
                      else chain().unsetColor().run();
                      setColorOpen(false);
                    }}
                    className={`w-7 h-7 ring-2 ${state.color === c.value ? "ring-[var(--dash-gold)]" : "ring-slate-200"}`}
                    style={{ background: c.value || "conic-gradient(#111d43 0 25%, #fff 0 50%, #111d43 0 75%, #fff 0)" }}
                  />
                ))}
              </div>
            )}

            {linkOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyLink();
                }}
                className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-3 py-2"
              >
                <label htmlFor="link-href" className="text-[12px] font-semibold text-slate-500">
                  Link to
                </label>
                <input
                  id="link-href"
                  autoFocus
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  placeholder="https://… or /contact"
                  className="flex-1 min-w-[180px] rounded-full px-3.5 py-1.5 text-[13px] outline-none"
                />
                <button type="submit" className="px-3.5 py-1.5 text-[12.5px] font-semibold text-white bg-[var(--dash-brand)]">
                  Apply
                </button>
                {state.link && (
                  <button
                    type="button"
                    onClick={() => {
                      chain().extendMarkRange("link").unsetLink().run();
                      setLinkOpen(false);
                    }}
                    className="px-3 py-1.5 text-[12.5px] font-semibold text-[var(--dash-danger)] hover:bg-[var(--dash-danger-soft)]"
                  >
                    Remove link
                  </button>
                )}
                <button type="button" aria-label="Close" onClick={() => setLinkOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                  <X size={15} />
                </button>
              </form>
            )}

            {state.image && (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-3 py-2">
                <label htmlFor="img-alt" className="text-[12px] font-semibold text-slate-500">
                  Image description
                </label>
                <input
                  id="img-alt"
                  value={state.imageAlt}
                  onChange={(e) => editor.chain().updateAttributes("image", { alt: e.target.value }).run()}
                  placeholder="What the image shows, for screen readers and Google"
                  className="flex-1 min-w-[200px] rounded-full px-3.5 py-1.5 text-[13px] outline-none"
                />
              </div>
            )}

            {state.table && (
              <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 px-2 py-1.5">
                <span className="text-[12px] font-semibold text-slate-500 px-1.5">Table</span>
                {[
                  { label: "Row below", icon: Rows3, run: () => chain().addRowAfter().run() },
                  { label: "Column right", icon: Columns3, run: () => chain().addColumnAfter().run() },
                  { label: "Delete row", icon: Rows3, run: () => chain().deleteRow().run(), danger: true },
                  { label: "Delete column", icon: Columns3, run: () => chain().deleteColumn().run(), danger: true },
                  { label: "Delete table", icon: Trash2, run: () => chain().deleteTable().run(), danger: true },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={b.run}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold ${
                      b.danger
                        ? "text-slate-500 hover:text-[var(--dash-danger)] hover:bg-[var(--dash-danger-soft)]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <b.icon size={14} /> {b.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page + settings */}
      <div className="grid xl:grid-cols-[minmax(0,1fr)_380px] gap-6 px-4 sm:px-6 lg:px-8 py-6">
        <div className="min-w-0">
          <article className="mx-auto max-w-[860px] rounded-2xl bg-white shadow-[var(--dash-shadow-md)] ring-1 ring-slate-900/5 px-5 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-14">
            <label htmlFor="post-title" className="sr-only">Title</label>
            <textarea
              id="post-title"
              value={post.title}
              readOnly={!canEdit}
              onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
              placeholder="Article title"
              rows={1}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
              // Inline so the dashboard's form-field box styling doesn't apply.
              style={{ background: "transparent", border: 0, boxShadow: "none", padding: 0 }}
              className="w-full resize-none overflow-hidden text-[28px] sm:text-[38px] font-bold leading-[1.15] tracking-tight text-slate-900 placeholder:text-slate-300"
            />
            <div className="mt-6 sm:mt-8">
              <EditorContent editor={editor} />
            </div>
          </article>
          <p className="mx-auto max-w-[860px] mt-3 flex flex-wrap gap-x-4 gap-y-1 px-2 text-[12px] text-slate-500 tabular-nums">
            <span>{words.toLocaleString()} words</span>
            <span>{readingMinutes(post.content)} min read</span>
            <span>Drafts save automatically</span>
          </p>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-[150px] max-h-[calc(100vh-170px)] overflow-y-auto dash-card p-5">
            <p className="text-[15px] font-bold text-slate-900 mb-4">Post settings</p>
            {settings}
          </div>
        </aside>
      </div>

      {/* Settings drawer below xl */}
      {settingsOpen && (
        <div className="xl:hidden fixed inset-0 z-[60] flex justify-end">
          <button type="button" aria-label="Close settings" className="absolute inset-0 bg-slate-900/40" onClick={() => setSettingsOpen(false)} />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto p-5 sm:p-6 dash-fade-up">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[16px] font-bold text-slate-900">Post settings</p>
              <button type="button" aria-label="Close" onClick={() => setSettingsOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            {settings}
          </div>
        </div>
      )}

      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(url) => {
            chain().setImage({ src: url, alt: "" }).run();
            setPicking(false);
          }}
        />
      )}
    </div>
  );
};

export default BlogPostEditor;
