---
title: Por Que Explorei Svelte (+ SvelteKit) no Meio de um Projeto React
date: 2025-05-06
tags:
  - React
  - Desenvolvimento
  - Web
  - Svelte
  - SvelteKit
  - NextJS
excerpt: Explorando as diferenças entre Svelte e React
---
# A Virada no Meu Portfólio: Por Que Explorei Svelte (+ SvelteKit) no Meio de um Projeto React

Construir um portfólio de desenvolvedor – é algo importante, certo? Seu aperto de mão digital, o lugar para mostrar suas habilidades de programação. Como muitas pessoas, primeiro recorri ao peso pesado da indústria: React, frequentemente combinado com seu poderoso companheiro, **Next.js**. Essa combinação é uma fera para aplicações full-stack, lidando com tudo, desde renderização no lado do servidor até rotas de API. Então, comecei a esboçar componentes, lutar com o estado e entrar no ritmo usual do JSX e Next.js.

Mas então, continuei ouvindo sussurros (e às vezes gritos) no Twitter sobre **Svelte** e seu framework de aplicação oficial, **SvelteKit** (e Vue, mas isso é história para outro dia). Svelte 5, com seus novos "Runes" para reatividade, e SvelteKit continuavam aparecendo no meu feed, elogiados pelo desempenho e por uma experiência de desenvolvimento elegante. Isso me fez pensar: essa abordagem que prioriza o compilador poderia *realmente* ser tão diferente? Poderia ser uma opção melhor para o meu portfólio?

Spoiler: decidi descobrir, bem no meio de tudo. Este post é sobre essa pequena aventura, comparando os dois, e por que Svelte, principalmente como uma busca interessante por aprendizado, acabou chamando minha atenção.

## Conceitos Fundamentais & Meta-Frameworks: Uma História de Duas Stacks

### React + Next.js: A Vanguarda do DOM Virtual & Framework Rico em Recursos

React constrói UIs com componentes e usa um DOM Virtual (VDOM) para atualizações inteligentes (Se você estiver curioso, aliás, construir uma versão leve disso é um ótimo projeto de aprendizado!). Next.js adiciona camadas por cima, oferecendo uma maneira estruturada de lidar com roteamento, renderização, APIs e muito mais.

**Exemplo: Uma página simples "Olá, mundo!" em Next.js (App Router):**
*(Arquivo: `app/page.js`)*

```javascript
import React from "react";

export default function HomePage() {
  return <h1>Olá, mundo!</h1>;
}
```

### Svelte 5 + SvelteKit: O Compilador Camaleão & Solução Integrada

Svelte 5 é diferente – é um compilador. Ele pega seus componentes e os transforma em JavaScript puro e leve em tempo de compilação. A reatividade é super clara com seus novos **Runes** (como `$state`). SvelteKit é seu parceiro oficial, fazendo com que coisas como roteamento, funcionalidades do lado do servidor e endpoints de API pareçam realmente integrados.

**Exemplo: Uma página simples "Olá, mundo!" em SvelteKit (Svelte 5):**
*(Arquivo: `src/routes/+page.svelte`)*

```html
<script>
  // No Svelte 5, 'let' é reativo por padrão para o estado local do componente.
  let name = 'mundo';
</script>

<h1>Olá {name}!</h1>

<style>
  /* Estes estilos se aplicam apenas a este componente! */
  h1 {
    color: blue;
  }
</style>
```

## Confronto de Sintaxe e Estrutura: Como as Coisas Parecem & Se Comportam

Além de como os componentes são escritos, a maneira como esses frameworks organizam coisas como rotas e busca de dados tem seu próprio sabor.

### Roteamento Baseado em Arquivos

Ambos usam a estrutura de pastas para rotas, o que é bem legal.

**Next.js (App Router):**
Página `/dashboard/settings`? Procure por `app/dashboard/settings/page.js`.

```javascript
// Arquivo: app/dashboard/settings/page.js
// Esta é a sua UI para '/dashboard/settings'.
export default function SettingsPage() {
  return <h2>Configurações</h2>;
}
```

**SvelteKit:**
Mesma rota, `/dashboard/settings`, significa um arquivo em `src/routes/dashboard/settings/+page.svelte`.

```html
<!-- Arquivo: src/routes/dashboard/settings/+page.svelte -->
<!-- A UI para '/dashboard/settings' fica aqui. -->
<h2>Configurações</h2>
```

### Carregamento de Dados para uma Página

Buscar dados antes de mostrar uma página é um clássico.

**Next.js (App Router - Server Component):**
Você pode buscar dados diretamente em um Server Component `async`.

```javascript
// Arquivo: app/posts/[id]/page.js
async function getPost(id) { /* ...lógica de busca... */ }

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  // ...renderizar post ou não encontrado...
}
```

**SvelteKit (com Svelte 5):**
O carregamento de dados geralmente acontece em um arquivo `+page.server.js`.

```typescript
// Arquivo: src/routes/posts/[id]/+page.server.js
export async function load({ params, fetch }) {
  // ...lógica de busca usando params.id...
  // return { post } ou { error }
}
```

```html
<!-- Arquivo: src/routes/posts/[id]/+page.svelte -->
<script> export const { data } = $props(); </script>
<!-- Use data.post ou data.error aqui -->
```

### Layouts & Estilização

Coisas compartilhadas como cabeçalhos? Tratadas por `layout.js` (Next.js) ou `+layout.svelte` (SvelteKit). Uma coisa legal do Svelte: estilos em uma tag `<style>` são automaticamente escopados apenas para aquele componente. Sem bagunças acidentais de CSS!

## Por Baixo dos Panos: Desempenho & Tamanho do Bundle (A Teoria)

SvelteKit *pode* significar tamanhos de aplicativo menores e carregamentos mais rápidos porque o Svelte compila e remove grande parte da sobrecarga do framework. Para um portfólio simples, no entanto, o ganho de velocidade *real* que você notaria pode ser minúsculo. Meu interesse aqui era mais sobre entender o "como" e o "porquê".

## Experiência do Desenvolvedor: Curva de Aprendizado & Ecossistema

*   **Curva de Aprendizado:** Svelte/SvelteKit muitas vezes parece um pouco mais rápido de aprender, em parte devido àquela estrutura natural de arquivo `.svelte`. Simplesmente faz sentido.
*   **Ferramentas & Configuração:** Ambos utilizam Vite para uma experiência de desenvolvimento rápida. A configuração do projeto é direta para ambos.
*   **Ecossistema:** React/Next.js tem um ecossistema incomparável. O ecossistema de Svelte/SvelteKit é menor, mas está crescendo.

## A Virada no Portfólio: Por Que Eu *Realmente* Mudei de Rumo

Então, por que pular do barco no meio da construção do portfólio? No início, fui definitivamente atraído por toda a conversa no Twitter sobre a velocidade e os bundles minúsculos do Svelte/SvelteKit. "Portfólio ultrarrápido!", pensei.

Mas, à medida que me aprofundava, percebi que para um site como o meu – bastante direto, principalmente conteúdo estático – a diferença de desempenho que você poderia *realmente sentir* não seria um divisor de águas. Tanto Next.js quanto SvelteKit podem criar sites realmente rápidos.

A **verdadeira razão pela qual continuei com SvelteKit foi simples: eu estava curioso e queria aprender.** Meu feed do Twitter fazia o Svelte 5 parecer legal, e eu queria ver como era essa reatividade baseada em Runes e que priorizava o compilador. Meu portfólio se tornou o playground perfeito e de baixa pressão para experimentar algo novo e expandir meu conjunto de habilidades. A velocidade potencial foi um bônus agradável, mas a aventura de aprender foi o prêmio principal.

## A Conclusão: Tudo é Sobre Contexto (e se Divertir Aprendendo!)

Então, React + Next.js ou Svelte 5 + SvelteKit? Como em todas as coisas, nada será "melhor" o tempo todo. React e Next.js são potências da indústria, incríveis para coisas grandes e complexas. Mas Svelte e SvelteKit são uma opção super empolgante e moderna, especialmente se você se importa com desempenho de ponta e, bem, você pode contribuir para o pequeno ecossistema! Crie seus próprios pacotes para preencher lacunas que ainda existem!

Para o meu portfólio, a mudança não foi sobre perseguir ganhos minúsculos de velocidade. Foi sobre **a diversão de explorar algo novo que eu tinha visto bombar no Twitter.** Isso me tirou da minha zona de conforto, me ensinou uma maneira diferente de pensar sobre desenvolvimento web e adicionou outra ferramenta legal ao meu arsenal. E isso, para mim, valeu totalmente a pena. Se você está curioso sobre Svelte, experimente! A jornada de aprendizado em si já é uma recompensa e tanto.
