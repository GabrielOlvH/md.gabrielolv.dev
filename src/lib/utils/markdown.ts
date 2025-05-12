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

// Custom rehype plugin to add a class to headings
function rehypeAddHeadingClass() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        // Ensure properties exist
        node.properties = node.properties || {};
        // Add the class, handling existing classes
        const existingClasses = node.properties.className || [];
        // Ensure existingClasses is treated as an array
        const classesArray = Array.isArray(existingClasses) ? existingClasses : [String(existingClasses)];

        // Add the new class if it's not already present
        if (!classesArray.includes('heading-with-bar')) {
           node.properties.className = [...classesArray, 'heading-with-bar'];
        } else {
           node.properties.className = classesArray; // Keep existing if class is already there
        }

        // Remove empty string class if it was added automatically
         if (node.properties.className.length > 1 && node.properties.className[0] === '') {
           node.properties.className.shift();
         }
      }
    });
  };
}

export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Turn markdown → { html, toc }
 * toc is an array of all h2–h4 in document order.
 */
export function markdownToHtml(
  markdown: string
): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)           // GitHub-Flavored Markdown

    .use(remarkSmartypants)   // "smart" quotes, dashes, etc.
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
    .use(remarkRehype, { allowDangerousHtml: true }) // pass rawb HTML through
    .use(rehypeSlug)          // adds `id` to headings
    .use(rehypeRaw)
    .use(rehypeAddHeadingClass) // Add class to headings
    .use(rehypeHighlight)    // highlight.js
    .use(rehypeStringify)    // → HTML string

  const file = processor.processSync(markdown)
  return { html: String(file), toc }
}