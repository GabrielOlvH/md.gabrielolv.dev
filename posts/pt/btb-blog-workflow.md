---
title: "Por Trás dos Bytes: Meu Fluxo Atual de CMS do Blog"
date: 2025-05-12
tags:
  - Web
  - "#ContentCreation"
  - "#Personal"
  - "#Cloudflare"
  - "#Git"
  - "#Obsidian"
  - "#CMS"
excerpt: Explorando o fluxo de trabalho de CMS para meu blog
---
# Por Trás dos Bytes: Como Construí Meu Fluxo de Trabalho do Blog (Obsidian + Git + Cloudflare)

Como estudante de Ciência da Computação equilibrando aulas, projetos pessoais, uma startup e a interminável busca por emprego, eu precisava de um fluxo de trabalho para blog que fosse simples, rápido e não atrapalhasse minha rotina. Meu antigo portfólio rapidamente ficou desatualizado e não refletia minhas habilidades ou projetos atuais. Não mostrava muito, não tinha um espaço para eu escrever esses posts e, no geral, era simplesmente feio.

Então, decidi construir algo melhor—algo que me permitisse escrever de qualquer lugar, fazer deploy automaticamente, manter-se atualizado sem muito esforço e ter uma aparência MUITO melhor, afinal, é tudo sobre a aparência. Aqui está como configurei.

## Por Que Abandonei Meu Antigo Portfólio

Meu primeiro portfólio era adequado no início. Mas conforme aprendi mais, construí projetos mais interessantes e melhorei minhas habilidades, ele rapidamente ficou desatualizado. O design parecia ultrapassado e feio, os projetos não representavam minhas capacidades atuais, e atualizá-lo era trabalhoso. Não era uma boa impressão, especialmente quando me candidatava para estágios ou empregos.

Percebi que precisava de algo fácil de manter, flexível e sempre atualizado. Eis meu novo fluxo de trabalho.

## Meu Novo Fluxo de Trabalho: Obsidian + Git + Cloudflare Pages

Aqui está a stack que escolhi:

- **Obsidian** para escrever e organizar conteúdo.
- **Git** (via plugin Obsidian Git) para controle de versão e sincronização.
- **Cloudflare Pages** para deploy automático e hospedagem.

Vamos detalhar.

### Passo 1: Escrevendo de Qualquer Lugar com Obsidian

Obsidian é meu aplicativo preferido para anotações. É baseado em Markdown, local-first e disponível em todos os meus dispositivos (notebook, tablet e celular). Isso significa que posso escrever ou editar posts do blog literalmente em qualquer lugar—entre as aulas, ou até mesmo no celular quando tenho uma ideia aleatória.

**Por que Obsidian?**

- **Markdown:** Simples, limpo e portátil. Sem formatos proprietários.
- **Sincronização entre Dispositivos:** Sincronizo minhas notas usando a ferramenta de sincronização integrada do Obsidian, então elas estão sempre atualizadas em todos os dispositivos.
- **Organização:** Os recursos de links e tags do Obsidian me ajudam a manter minhas notas estruturadas e conectadas. (e é satisfatório ver o Graph View crescer)

### Passo 2: Sincronização e Controle de Versão com Git

Para manter tudo organizado e versionado, uso o plugin **Obsidian Git** para publicar posts. Ele integra o Git diretamente no Obsidian, permitindo que eu faça commits e pushes sem sair do aplicativo.

**Como funciona:**

- Termino de escrever ou editar um post.
- Abro o painel do git, faço stage dos posts do blog alterados e push para o repositório do blog.
- O Git rastreia cada alteração, então posso facilmente reverter ou revisar versões anteriores.

### Passo 3: Deploy Automático com Cloudflare Workers & Pages

Quando minhas alterações chegam ao GitHub, o **Cloudflare Pages** assume. Ele detecta automaticamente novos commits, constrói meu site, que utiliza Geração de Site Estático, e faz o deploy globalmente em minutos.

**Por que Cloudflare Pages?**

- **Builds Automáticos:** Sem etapas manuais de deploy. Apenas push para o GitHub, e o Cloudflare cuida do resto.
- **CDN Global:** Tempos de carregamento rápidos em todo lugar, ótimo para visitantes (e potenciais empregadores!).
- **Plano Gratuito:** Conteúdo estático entregue gratuitamente para sempre.

## Por Que Geração de Site Estático (SSG)?

Meu blog usa Geração de Site Estático (SSG), significando que todas as páginas são pré-construídas em arquivos estáticos HTML, CSS e JavaScript durante o build. Alguns dos benefícios são:

- **Velocidade:** Sites estáticos carregam super rápido—sem espera por renderização server-side.
- **Escalabilidade:** Arquivos estáticos são fáceis de servir em escala.
- **Gratuito:** Cloudflare hospeda websites estáticos gratuitamente.

## Como Isso Se Compara a Outras Opções

Aqui está uma rápida análise de por que escolhi esta configuração em vez de outras opções comuns:

| Opção                                        | Prós                                      | Contras                                         |
| -------------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| **CMS Tradicional (WordPress)**              | Fácil de usar, muitos plugins             | Mais lento, maior manutenção, e estamos em 2025 |
| **CMS Headless (Contentful, Sanity)**        | Conteúdo estruturado, baseado em API      | Complexidade extra, custos potenciais           |
| **Outros Hosts Estáticos (Netlify, Vercel)** | Recursos similares, ótima experiência dev | Nada contra eles (só contra o CEO da Vercel)    |
| **Auto-Hospedagem**                          | Controle total                            | Manutenção mais alta                            |

Para mim, a combinação Obsidian + Git + Cloudflare Pages atinge o ponto ideal: fácil, rápido, seguro e gratuito.

## Benefícios do Meu Fluxo de Trabalho Atual

- **Escrever em Qualquer Lugar:** Obsidian me permite escrever em qualquer dispositivo, a qualquer momento.
- **Deploys Automáticos:** Git + Cloudflare Pages significa zero etapas manuais de deploy.
- **Sempre Atualizado:** Fácil de manter e postar novo conteúdo.
- **Ótima Performance:** Tempos de carregamento rápidos e disponibilidade global.
- **Custo-Benefício:** Literalmente 0 dinheiro gasto nisso.

---

E assim nasceu minha solução CMS caseira! 🎉 (com certeza não sou o primeiro usar essa combinação)

Se você também é do tipo que gosta de uma solução elegante (e gratuita), talvez essa receita seja pra você. Afinal, às vezes as melhores soluções são aquelas que a gente mesmo cozinha, não é mesmo?

Até a próxima! 👋