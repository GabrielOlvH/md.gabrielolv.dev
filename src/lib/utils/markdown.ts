import rehypeSlug from 'rehype-slug';
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Turn markdown → { html, toc }
 * toc is an array of all h2–h4 in document order.
 */
export async function markdownToHtml(
  markdown: string
): Promise<{ html: string; toc: TocItem[] }> {
  const toc: TocItem[] = []

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)           // GitHub-Flavored Markdown
    .use(rehypeSlug)          // adds `id` to headings
    .use(remarkSmartypants)   // “smart” quotes, dashes, etc.
    .use(() => (tree) => {
      // extract TOC
      visit(tree, 'heading', (node: any) => {
        const lvl = node.depth
        if (lvl < 2 || lvl > 4) return

        // flatten text
        let txt = ''
        node.children.forEach((ch: any) => {
          if (ch.type === 'text' || ch.type === 'inlineCode') {
            txt += ch.value
          }
        })

        // get or re-slugify id
        const id =
          node.data?.hProperties?.id ||
          txt
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')

        toc.push({ id, text: txt, level: lvl })
      })
    })
    .use(remarkRehype, { allowDangerousHtml: true }) // pass raw HTML through
    .use(rehypeRaw)          // actually parse the raw HTML
    .use(rehypeHighlight)    // highlight.js
    .use(rehypeStringify)    // → HTML string

  const file = await processor.process(markdown)
  return { html: String(file), toc }
}