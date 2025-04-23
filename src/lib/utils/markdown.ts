import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Configure marked with syntax highlighting
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      // If language is not specified or not found, try to auto-detect
      const language = lang && hljs.getLanguage(lang) ? lang : 
                      hljs.highlightAuto(code).language || 'plaintext';
      
      // Apply highlighting with the detected or specified language
      return hljs.highlight(code, { language }).value;
    }
  })
);

// Set default options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  headerIds: true, // Add IDs to headers for linking
  mangle: false, // Don't escape HTML
  pedantic: false, // Don't be too strict with markdown spec
  smartLists: true, // Use smarter list behavior
  smartypants: true, // Use smart typography
});

/**
 * Convert markdown to HTML
 * @param markdown Markdown content to convert
 * @returns HTML content
 */
export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown);
}
