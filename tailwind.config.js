/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--color-text)',
            a: {
              color: 'var(--color-primary)',
              textDecoration: 'none',
              '&:hover': {
                color: 'var(--color-primary-dark)',
              },
            },
            h1: {
              color: 'var(--color-heading)',
              fontWeight: '700',
            },
            h2: {
              color: 'var(--color-heading)',
              fontWeight: '600',
            },
            h3: {
              color: 'var(--color-heading)',
              fontWeight: '600',
            },
            h4: {
              color: 'var(--color-heading)',
              fontWeight: '600',
            },
            code: {
              color: 'var(--color-code)',
              backgroundColor: 'var(--color-code-bg)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
            pre: {
              backgroundColor: 'var(--color-code-block-bg)',
              color: 'var(--color-code-block)',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
            },
            blockquote: {
              borderLeftColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            },
            hr: {
              borderColor: 'var(--color-border)',
            },
            strong: {
              color: 'var(--color-text-bold)',
            },
            thead: {
              color: 'var(--color-heading)',
              borderBottomColor: 'var(--color-border)',
            },
            tbody: {
              tr: {
                borderBottomColor: 'var(--color-border)',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
