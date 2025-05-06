---
title: Why I Explored Svelte (+ SvelteKit) Mid-React Project
date: 2025-05-06
tags:
  - React
  - Desenvolvimento
  - Svelte
  - SvelteKit
  - NextJS
  - Web
excerpt: Exploring the differences between Svelte and React
---
# My Portfolio Pivot: Why I Explored Svelte (+ SvelteKit) Mid-React Project

Building a developer portfolio – it's kind of a big deal, right? Your digital handshake, the place to show off your coding chops. Like many folks, I first reached for the industry heavyweight: React, often paired with its powerful sidekick, **Next.js**. This combo is a beast for full-stack apps, handling everything from server-side rendering to API routes. So, I started sketching out components, wrestling with state, and getting into the usual JSX and Next.js groove.

But then, I kept hearing whispers (and sometimes shouts) on Twitter about **Svelte** and its official application framework, **SvelteKit** (and Vue, but that's a story for another day). Svelte 5, with its new "Runes" for reactivity, and SvelteKit kept popping up on my feed, praised for performance and a slick developer experience. It got me thinking: could this compiler-first approach *really* be that different? Could it be a better fit for my portfolio?

Spoiler: I decided to find out, right in the middle of everything. This post is about that little adventure, comparing the two, and why Svelte, mostly as a cool learning quest, ended up grabbing my attention.

## Core Concepts & Meta-Frameworks: A Tale of Two Stacks

### React + Next.js: The Virtual DOM Vanguard & Feature-Rich Framework

React builds UIs with components and uses a Virtual DOM (VDOM) for smart updates (If you're curious in fact, building a lightweight version of this is a great learning project!). Next.js layers on top, giving you a structured way to handle routing, rendering, APIs, and more. 

**Example: A simple "Hello World" page in Next.js (App Router):**
*(File: `app/page.js`)*

```javascript
import React from "react";

export default function HomePage() {
  return <h1>Hello, world!</h1>;
}
```

### Svelte 5 + SvelteKit: The Compiler Chameleon & Integrated Solution

Svelte 5 is different – it's a compiler. It takes your components and turns them into lean vanilla JavaScript at build time. Reactivity is super clear with its new **Runes** (like `$state`). SvelteKit is its official partner, making things like routing, server-side stuff, and API endpoints feel really integrated.

**Example: A simple "Hello World" page in SvelteKit (Svelte 5):**
*(File: `src/routes/+page.svelte`)*

```html
<script>
  // In Svelte 5, 'let' is reactive by default for component-local state.
  let name = 'world'; 
</script>

<h1>Hello {name}!</h1>

<style>
  /* These styles only apply to this component! */
  h1 {
    color: blue;
  }
</style>
```


## Syntax and Structure Showdown: How Things Look & Feel

Beyond just how components are written, the way these frameworks organize things like routes and data fetching has its own flavor.

### File-based Routing

Both use your folder structure for routes, which is pretty neat.

**Next.js (App Router):**
`/dashboard/settings` page? Look for `app/dashboard/settings/page.js`.

```javascript
// File: app/dashboard/settings/page.js
// This is your UI for '/dashboard/settings'.
export default function SettingsPage() {
  return <h2>Settings</h2>;
}
```

**SvelteKit:**
Same route, `/dashboard/settings`, means a file at `src/routes/dashboard/settings/+page.svelte`.

```html
<!-- File: src/routes/dashboard/settings/+page.svelte -->
<!-- UI for '/dashboard/settings' lives here. -->
<h2>Settings</h2>
```

### Data Loading for a Page

Grabbing data before showing a page is a classic.

**Next.js (App Router - Server Component):**
You can fetch data right in an `async` Server Component.

```javascript
// File: app/posts/[id]/page.js
async function getPost(id) { /* ...fetch logic... */ }

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  // ...render post or not found...
}
```

**SvelteKit (with Svelte 5):**
Data loading usually happens in a `+page.server.js` file.

```typescript
// File: src/routes/posts/[id]/+page.server.js
export async function load({ params, fetch }) {
  // ...fetch logic using params.id...
  // return { post } or { error }
}
```

```html
<!-- File: src/routes/posts/[id]/+page.svelte -->
<script> export const { data } = $props(); </script>
<!-- Use data.post or data.error here -->
```

### Layouts & Styling

Shared stuff like headers? Handled by `layout.js` (Next.js) or `+layout.svelte` (SvelteKit). A cool Svelte thing: styles in a `<style>` tag are automatically scoped to just that component. No accidental CSS messes!

## Under the Hood: Performance & Bundle Size (The Theory)

SvelteKit *can* mean smaller app sizes and faster loads because Svelte compiles away a lot of the framework overhead. For a simple portfolio, though, the *actual* speed boost you'd notice might be tiny. My interest here was more about understanding the "how" and "why."

## Developer Experience: Learning Curve & Ecosystem

*   **Learning Curve:** Svelte/SvelteKit often feels a bit quicker to pick up, partly due to that natural `.svelte` file structure. It just clicks.
*   **Tooling & Setup:** Both leverage Vite for a fast development experience. Project setup is straightforward for both.
*   **Ecosystem:** React/Next.js has an unparalleled ecosystem. Svelte/SvelteKit's ecosystem is smaller but growing.


## The Portfolio Pivot: Why I *Really* Switched Gears

So, why jump ship mid-portfolio build? At first, I was definitely drawn in by all the Twitter talk about Svelte/SvelteKit's speed and tiny bundles. "Lightning-fast portfolio!" I thought.

But as I got into it, I realized that for a site like mine – pretty straightforward, mostly static content – the performance difference you could *actually feel* wasn't going to be a game-changer. Both Next.js and SvelteKit can make really fast sites.

The **real reason I stuck with SvelteKit was simple: I was curious and wanted to learn.** My Twitter feed made Svelte 5 sound cool, and I wanted to see what this compiler-first, Rune-based reactivity was all about. My portfolio became the perfect, low-pressure playground to try something new and expand my skillset. The potential speed was a nice bonus, but the adventure of learning was the main prize.

## The Takeaway: It's All About Context (and Having Fun Learning!)

So, React + Next.js or Svelte 5 + SvelteKit? As for all things, nothing will "better" all the time. React and Next.js are industry powerhouses, awesome for big, complex stuff. But Svelte and SvelteKit are a super exciting, modern option, especially if you care about top-notch performance and, well, you can contribute to the small ecosystem! Create your own packages to fill gaps that are still missing!

For my portfolio, the switch wasn't about chasing tiny speed gains. It was about **the fun of exploring something new that I'd seen buzzing on Twitter.** It pushed me out of my comfort zone, taught me a different way to think about web dev, and added another cool tool to my belt. And that, for me, was totally worth it. If you're Svelte-curious, give it a shot! The learning journey itself is a pretty great reward.

***
