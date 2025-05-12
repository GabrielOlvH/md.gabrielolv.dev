---
title: "Behind the Bytes: My Current Blog CMS Workflow"
date: 2025-05-12
tags:
  - Web
  - "#ContentCreation"
  - "#Personal"
  - "#Cloudflare"
  - "#Git"
  - "#Obsidian"
  - "#CMS"
excerpt: Exploring my CMS workflow for my blog
---
# Behind the Bytes: How I Built My Blog Workflow (Obsidian + Git + Cloudflare)

As a CS student juggling classes, personal projects, a startup, and the never-ending job hunt, I needed a blogging workflow that was simple, fast, and didn't get in my way. My old portfolio quickly became outdated and didn't reflect my current skills or projects. It didn't really show much, didn't have a place for me to write these posts, and was just ugly overall.

So, I decided to build something better—something that would let me write from anywhere, deploy automatically, stay fresh without much effort, and look MUCH better, after all, it's all about the looks. Here's how I set it up.

## Why I Ditched My Old Portfolio

My first portfolio was fine at first. But as I learned more, built cooler projects, and improved my skills, it quickly became outdated. The design felt stale and ugly, the projects didn't represent my current abilities, and updating it was a hassle. It wasn't a good look, especially when applying for internships or jobs.

I realized I needed something that was easy to maintain, flexible, and always up-to-date. Enter my new workflow.

## My New Workflow: Obsidian + Git + Cloudflare Pages

Here's the stack I landed on:

- **Obsidian** for writing and organizing content.
- **Git** (via Obsidian Git plugin) for version control and syncing.
- **Cloudflare Pages** for automatic deployment and hosting.

Let's break it down.

### Step 1: Writing Anywhere with Obsidian

Obsidian is my go-to note-taking app. It's Markdown-based, local-first, and available on all my devices (laptop, tablet and phone). This means I can write or edit blog posts literally anywhere—on campus between classes, or even on my phone while when I get a random idea.

**Why Obsidian?**

- **Markdown:** Simple, clean, and portable. No proprietary formats.
- **Cross-Device Sync:** I sync my notes using Obsidian's builtin sync tool, so they're always up-to-date across devices.
- **Organization:** Obsidian's linking and tagging features help me keep my notes structured and connected. (and feels good to watch the Graph View grow)

### Step 2: Syncing & Version Control with Git

To keep everything organized and version-controlled, I use the **Obsidian Git** plugin for publishing posts. It integrates Git directly into Obsidian, letting me commit and push changes without leaving the app.

**How it works:**

- I finish writing or editing a post.
- I open the git panel & stage the changed blog posts and push to the blog repo.
- Git tracks every change, so I can easily revert or review past versions.

### Step 3: Automatic Deployment with Cloudflare Workers & Pages

Once my changes hit GitHub, **Cloudflare Pages** takes over. It automatically detects new commits, builds my site, which makes use of Static Site Generation, and deploys it globally in minutes.

**Why Cloudflare Pages?**

- **Automatic Builds:** No manual deployment steps. Just push to GitHub, and Cloudflare handles the rest.
- **Global CDN:** Fast load times everywhere, which is great for visitors (and potential employers!).
- **Free Tier:** Static content delivered for free forever.

## Why Static Site Generation (SSG)?

My blog uses Static Site Generation (SSG), meaning all pages are pre-built into static HTML, CSS, and JavaScript files during build. A few of the benefits are:

- **Speed:** Static sites load super fast—no waiting for server-side rendering.
- **Scalability:** Static files are easy to serve at scale.
- **Free:** Cloudflare hosts static websites for free.

## How This Compares to Other Options

Here's a quick rundown of why I chose this setup over other common options:

| Option                                   | Pros                                         | Cons                                             |
| ---------------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| **Traditional CMS (WordPress)**          | Easy to use, lots of plugins                 | Slower, higher maintenance, and it's 2025.       |
| **Headless CMS (Contentful, Sanity)**    | Structured content, API-driven               | Extra complexity, potential costs                |
| **Other Static Hosts (Netlify, Vercel)** | Similar features, great developer experience | Nothing against them (just against Vercel's CEO) |
| **Self-Hosting**                         | Full control                                 | High(er)-ish maintenance                         |

For me, the Obsidian + Git + Cloudflare Pages combo hits the sweet spot: easy, fast, secure, and free.

## Benefits of My Current Workflow

- **Write Anywhere:** Obsidian lets me write on any device, anytime.
- **Automatic Deployments:** Git + Cloudflare Pages means zero manual deployment steps.
- **Always Up-to-Date:** Easy to maintain and post new content.
- **Great Performance:** Fast load times and global availability.
- **Cost-Effective:** Literally 0 money spent on it.

---

And thus, my homegrown CMS solution was born! 🎉 (although I'm definitely not the first to use this combination)

If you're also the type who enjoys an elegant (and free) solution, maybe this recipe is for you. After all, sometimes the best solutions are the ones we cook up ourselves, right?

Until next time! 👋

