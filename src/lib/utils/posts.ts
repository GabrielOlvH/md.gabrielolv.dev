import { defaultLocale, getLocaleFromFilename, getOriginalSlug }
  from '$lib/i18n'
import { markdownToHtml, type TocItem } from '$lib/utils/markdown';

export interface PostMetadata {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingTime: number
  locale: string
}


function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function parseFrontmatter(content: string) {
  const regex = /---\s*([\s\S]*?)\s*---/
  const match = content.match(regex)
  if (!match) return { frontmatter: {}, content }
  const rawFm = match[1]
  const body = content.replace(regex, '').trim()
  const fm: Record<string, string | string[]> = {}
  for (const line of rawFm.split('\n')) {
    const [key, ...rest] = line.split(':')
    if (!rest.length) continue
    let val = rest.join(':').trim()
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map((s) => s.trim())
    }
    fm[key.trim()] = val
  }
  return { frontmatter: fm, content: body }
}



type PostEntry = {
  metadata: PostMetadata
  html: string,
  toc: TocItem[]
}
// eagerly load all Markdown
const modules = import.meta.glob('/posts/*.md', { as: 'raw', eager: true })

// build everything exactly once at startup / build time
const allEntries: PostEntry[] =
  Object.entries(modules).map(([path, raw]) => {
    const filename = path.split('/').pop()!
    const fileLocale = getLocaleFromFilename(filename) ?? defaultLocale
    const original = filename.replace(/\.mdx?$/, '')
    const slug = getOriginalSlug(original)

    // frontmatter parse as before…
    const { frontmatter, content } = parseFrontmatter(raw as string)

    const date = frontmatter.date
      ? new Date(frontmatter.date).toISOString()
      : new Date().toISOString()

    const readingTime = estimateReadingTime(content)

    const metadata: PostMetadata = {
      slug,
      title: frontmatter.title || slug,
      date,
      readingTime,
      tags: frontmatter.tags || [],
      excerpt:
        frontmatter.excerpt ||
        (content.length > 150 ? content.slice(0, 150) + '…' : content),
      locale: fileLocale
    }

    // here’s the only difference:
    const { html, toc } = markdownToHtml(content)

    return { metadata, html, toc }
  })

// build your two lookup tables
const postsByLocale =  allEntries.reduce(
  (acc, { metadata }) => {
    const list = acc[metadata.locale] ?? []
    list.push(metadata)
    acc[metadata.locale] = list
    return acc
  },
  {} as Record<string, PostMetadata[]>
)
const postMap = allEntries.reduce(
  (acc, { metadata, html, toc }) => {
    const mapForLocale = acc[metadata.locale] ?? {}
    mapForLocale[metadata.slug] = { metadata, html, toc }
    acc[metadata.locale] = mapForLocale
    return acc
  },
  {} as Record<string, Record<
    string,
    { metadata: PostMetadata; html: string; toc: TocItem[] }
  >>
)

export async function getAllPosts(locale: string): Promise<PostMetadata[]> {
  return postsByLocale[locale] ?? []
}

export async function getPostBySlug(
  slug: string,
  locale: string
): Promise<
  { metadata: PostMetadata; content: string; toc: TocItem[] } | null
> {
  const entry =
    postMap[locale]?.[slug] ?? postMap[defaultLocale]?.[slug] ?? null
  if (!entry) return null
  return {
    metadata: entry.metadata,
    content: entry.html,
    toc: entry.toc
  }
}