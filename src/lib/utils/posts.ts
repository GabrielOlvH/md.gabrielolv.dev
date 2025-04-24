import { defaultLocale, getLocaleFromFilename, getOriginalSlug } from "$lib/i18n";

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  locale: string;
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function parseFrontmatter(content: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(content);

  if (!match) {
    return {
      frontmatter: {
        title: "Untitled",
        date: new Date().toISOString(),
        excerpt: "",
        tags: []
      },
      content
    };
  }

  const frontmatterBlock = match[1];
  const contentWithoutFrontmatter = content.replace(frontmatterRegex, "").trim();
  const frontmatter: Record<string, any> = {};

  frontmatterBlock.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      let value = valueParts.join(":").trim();

      // Handle array values (e.g., tags)
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value.slice(1, -1).split(",").map((item) => item.trim());
      }
      frontmatter[key.trim()] = value;
    }
  });

  return { frontmatter, content: contentWithoutFrontmatter };
}

// Glob import to compile all Markdown files from the "posts" folder at build time.
// Adjust the glob path as needed based on your project structure.
const postsGlob = import.meta.glob("/posts/*.md", { as: "raw" });

export async function getAllPosts(
  locale: string
): Promise<PostMetadata[]> {
  const postsData = await Promise.all(
    Object.entries(postsGlob).map(async ([filePath, resolver]) => {
      const fileContents = await resolver();
      const filename = filePath.split("/").pop();
      if (!filename) return null;

      const fileLocale = getLocaleFromFilename(filename);
      if (
        fileLocale !== locale &&
        !(fileLocale === null && locale === defaultLocale)
      ) {
        return null;
      }

      // Get the slug without locale suffix and file extension
      const originalFilename = filename.replace(/\.mdx?$/, "");
      const slug = getOriginalSlug(originalFilename);

      // Parse frontmatter and calculate reading time
      const { frontmatter, content } = parseFrontmatter(fileContents);
      const readingTime = estimateReadingTime(content);
      const date = frontmatter.date
        ? new Date(frontmatter.date).toISOString()
        : new Date().toISOString();

      return {
        slug,
        title: frontmatter.title || slug,
        date,
        readingTime,
        tags: frontmatter.tags || [],
        excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
        locale
      } as PostMetadata;
    })
  );

  // Remove null entries and sort by date in descending order
  const posts = postsData.filter(
    (post): post is PostMetadata => Boolean(post)
  );
  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return posts;
}

export async function getPostBySlug(
  slug: string,
  locale: string
): Promise<{ metadata: PostMetadata; content: string } | null> {
  const entries = Object.entries(postsGlob);
  for (const [filePath, resolver] of entries) {
    const filename = filePath.split("/").pop();
    if (!filename) continue;

    const fileSlug = getOriginalSlug(filename.replace(/\.mdx?$/, ""));
    const fileLocale = getLocaleFromFilename(filename);

    if (
      fileSlug === slug &&
      (fileLocale === locale ||
        (fileLocale === null && locale === defaultLocale))
    ) {
      const fileContents = await resolver();
      const { frontmatter, content } = parseFrontmatter(fileContents);
      const readingTime = estimateReadingTime(content);
      const date = frontmatter.date
        ? new Date(frontmatter.date).toISOString()
        : new Date().toISOString();

      const metadata: PostMetadata = {
        slug,
        title: frontmatter.title || slug,
        date,
        readingTime,
        tags: frontmatter.tags || [],
        excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
        locale
      };

      return { metadata, content };
    }
  }
  return null;
}
