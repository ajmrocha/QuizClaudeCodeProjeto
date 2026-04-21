# PRD — Claude Code Quiz

**Versão:** 1.0
**Data:** 2026-04-21
**Autor:** Angel J. M. Rocha (angel.jmrocha@gmail.com)
**Status:** Especificação inicial — pronto para consumo pelo Claude Code

---

## 1. Visão Geral

Aplicação web de quiz educativo sobre **Claude Code** (a CLI oficial da Anthropic). Formato Verdadeiro/Falso, com três trilhas de dificuldade (Iniciante, Intermediário, Avançado), ranking público por trilha, badges digitais por desempenho e compartilhamento social.

### 1.1 Objetivos de Negócio

1. **Educar** a comunidade sobre Claude Code de forma lúdica e progressiva.
2. **Gerar buzz / portfólio** — projeto público, compartilhável, demonstrando uso de stack moderna.
3. **Ranking competitivo** — estimular engajamento recorrente via leaderboard público.

### 1.2 Não-Objetivos (Out of Scope v1)

- Monetização (freemium, assinaturas, anúncios).
- Captura de leads / email marketing.
- Certificados em PDF.
- Sistema de login com OAuth ou senha.
- CMS externo ou UI administrativa para perguntas.
- Analytics.
- Testes automatizados (pós-MVP).
- Modo multiplayer em tempo real.

### 1.3 Público-Alvo

**Misto — todos os níveis.** Desde desenvolvedores iniciantes conhecendo Claude Code pela primeira vez até usuários avançados testando domínio de hooks, MCP e Agent SDK. A segmentação por nível ocorre via **escolha de trilha** no início da rodada.

---

## 2. Requisitos Funcionais

### 2.1 Fluxo Principal

```
Home
  ↓ (usuário digita nickname + escolhe trilha + escolhe tamanho da rodada + liga/desliga timer)
Rodada em andamento
  ↓ (N perguntas V/F com feedback imediato + explicação + link doc)
Tela de Resultado
  ↓ (score, badge se ≥70%, botões de ação)
├── Compartilhar (X / LinkedIn / link único)
├── Revisão completa (todas as perguntas + corretas + erros)
├── Praticar só os erros
├── Ver no Ranking
└── Jogar de novo
```

### 2.2 Funcionalidades Detalhadas

#### RF-01: Entrada do Usuário (Home)
- Campo **nickname** (3–20 caracteres, alfanumérico + `_` + `-`, sem espaços).
- Seletor de **trilha**: `Iniciante` | `Intermediário` | `Avançado`.
- Seletor de **tamanho da rodada**: `30` | `40` | `50` perguntas.
- Toggle **cronômetro on/off** (padrão: off). Se ligado: 30 s por pergunta.
- Toggle **idioma**: `PT-BR` | `EN` (padrão detectado do navegador; persiste em `localStorage`).
- Botão **Começar**.

#### RF-02: Sorteio de Perguntas
- A cada rodada, sortear `N` perguntas distintas do pool **da trilha selecionada**.
- Sorteio pseudoaleatório (seed por sessão para reprodutibilidade em debug).
- Nenhuma pergunta se repete dentro da mesma rodada.

#### RF-03: Rodada em Andamento
- Uma pergunta por tela.
- Enunciado + dois botões: **Verdadeiro** | **Falso**.
- Indicador de progresso: `Pergunta 5/30`.
- Categoria da pergunta visível (badge/tag).
- Se cronômetro ligado: barra de 30 s por pergunta. Ao zerar → conta como erro automático.
- Após resposta:
  - Badge visual verde (acerto) ou vermelho (erro).
  - **Explicação curta** (1–3 linhas) do porquê.
  - **Link** para a seção correspondente dos docs oficiais (`docs.claude.com/claude-code/...`).
  - Botão **Próxima**.
- Botão **Desistir** disponível (confirma antes de sair).

#### RF-04: Sistema de Pontuação
- Score por pergunta com **peso por dificuldade**:
  - Iniciante: 1 ponto
  - Intermediário: 2 pontos
  - Avançado: 3 pontos
- Score total = soma de acertos × peso.
- Tempo total da rodada registrado em ms (usado como desempate no ranking).
- Percentual de acerto calculado sobre número de perguntas da rodada.

#### RF-05: Badges (Tier System)
Desbloqueados **apenas se acerto ≥ 70%**:
- **Bronze** — 70–79%
- **Prata** — 80–89%
- **Ouro** — 90–100%

Geração: imagem PNG dinâmica (rota API `/api/badge/[tier]?nickname=X&score=Y`), renderizada com [`@vercel/og`](https://vercel.com/docs/functions/og-image-generation) ou similar. Dimensões: 1200×630 (padrão Open Graph).

#### RF-06: Tela de Resultado
- Score final (pontos + percentual).
- Badge desbloqueado (ou mensagem "Não atingiu 70% — tente novamente").
- Tempo total.
- Posição no ranking (se entrou no top 100 da trilha).
- Ações:
  - **Compartilhar** (X, LinkedIn, copiar link único).
  - **Ver revisão**.
  - **Praticar só os erros** (nova rodada com apenas as questões erradas).
  - **Ver ranking** da trilha.
  - **Jogar de novo**.

#### RF-07: Revisão Pós-Quiz
- Lista todas as perguntas da rodada.
- Para cada: enunciado, resposta do usuário, resposta correta, explicação, link do doc.
- Visualmente destaca erros em vermelho, acertos em verde.
- Botão **Praticar só os erros** no topo.

#### RF-08: Ranking por Trilha
- Página `/ranking` com três tabs: `Iniciante` | `Intermediário` | `Avançado`.
- Top 100 de cada trilha.
- Colunas: posição, nickname, score, % acerto, tempo, data.
- Ordenação: score DESC, tempo ASC (desempate).
- Paginação/scroll infinito opcional (v1: só top 100 fixo).
- Destaque da linha do usuário atual se presente.

#### RF-09: Compartilhamento
- **X / Twitter**: botão abre `twitter.com/intent/tweet` com texto pré-preenchido + URL única do resultado.
- **LinkedIn**: botão abre `linkedin.com/sharing/share-offsetUrl` com URL única.
- **Link único**: página `/resultado/[id]` com Open Graph tags (imagem do badge, título, descrição). Botão "copiar link".
- Texto padrão: `"Fiz {score}% no Claude Code Quiz (trilha {trilha}). Desafia aí: {url}"`.

#### RF-10: Internacionalização (i18n)
- Dois idiomas: `pt-BR` (padrão) e `en`.
- UI e perguntas traduzidas.
- Toggle persistente em `localStorage`.
- Biblioteca sugerida: [`next-intl`](https://next-intl-docs.vercel.app/).
- Cada pergunta possui campos `statement_pt`, `statement_en`, `explanation_pt`, `explanation_en`.

#### RF-11: Banco de Perguntas
- **300 perguntas** no pool inicial (100 por trilha).
- Armazenadas em **tabela Supabase**. Edição via SQL/dashboard Supabase (sem UI admin no v1).
- **6 categorias** cobertas, distribuídas ao longo das trilhas:
  1. **Negócio/Conceito** — o que é Claude Code, modelos, preços, casos de uso.
  2. **CLI básico** — comandos, flags, slash commands, TODO/Plan.
  3. **Hooks & Settings** — `settings.json`, `PreToolUse`/`PostToolUse`, `PermissionMode`.
  4. **MCP** — servers, configuração, protocolo.
  5. **Agent SDK** — subagents, tools, automações.
  6. **IDE & Integrações** — VS Code, JetBrains, CI/CD, GitHub Actions.
- **Fonte de verdade única:** documentação oficial Anthropic em `docs.claude.com/claude-code`. Toda pergunta deve ter `source_url` apontando para a página/seção exata.

---

## 3. Requisitos Não-Funcionais

| Categoria | Requisito |
|-----------|-----------|
| **Performance** | LCP < 2.5 s em 4G. Interação pergunta→resposta < 100 ms (client-side). |
| **Acessibilidade** | WCAG 2.1 AA. Navegação por teclado. ARIA labels. Contraste ≥ 4.5:1. |
| **Responsividade** | Mobile-first. Suporte a 320 px até 2560 px. |
| **SEO** | SSR/SSG quando possível. Meta tags Open Graph em todas as páginas compartilháveis. |
| **Privacidade** | Nenhum dado pessoal coletado além do nickname voluntário. Sem cookies de tracking. |
| **Rate limiting** | Submissão de resultado ao ranking: máx. 10 submissões/hora por IP (anti-spam). |
| **Navegadores** | Últimas 2 versões de Chrome, Firefox, Safari, Edge. |

---

## 4. Arquitetura Técnica

### 4.1 Stack

| Camada | Escolha |
|--------|---------|
| **Framework** | Next.js 15 (App Router, Server Components) |
| **Linguagem** | TypeScript (strict) |
| **Estilo** | Tailwind CSS + shadcn/ui |
| **Ícones** | `lucide-react` |
| **Backend** | Next.js Route Handlers (`app/api/*`) |
| **Banco** | Supabase (PostgreSQL) |
| **Cliente DB** | `@supabase/supabase-js` |
| **i18n** | `next-intl` |
| **OG Images** | `@vercel/og` (via `next/og`) |
| **Deploy** | Vercel (frontend + API) + Supabase (DB gerenciado) |
| **Analytics** | Nenhum (explicitamente fora de escopo v1) |
| **Testes** | Nenhum no v1 (explicitamente fora de escopo) |

### 4.2 Estrutura de Pastas (sugerida)

```
app/
  [locale]/
    page.tsx                 # Home (nickname + seleções)
    quiz/page.tsx            # Rodada em andamento
    resultado/[id]/page.tsx  # Resultado compartilhável
    ranking/page.tsx         # Leaderboards
    revisao/page.tsx         # Review pós-quiz
  api/
    questions/route.ts       # GET: sorteia N questões por trilha
    results/route.ts         # POST: salva resultado, retorna id
    ranking/route.ts         # GET: top 100 por trilha
    badge/[tier]/route.tsx   # Imagem OG dinâmica do badge
components/
  ui/                        # shadcn/ui primitives
  quiz/
    QuestionCard.tsx
    AnswerFeedback.tsx
    Timer.tsx
    ProgressBar.tsx
  ranking/
    RankingTable.tsx
  shared/
    LocaleSwitcher.tsx
    ShareButtons.tsx
lib/
  supabase/
    client.ts
    server.ts
  quiz/
    scoring.ts               # cálculo de score com pesos
    sampler.ts               # sorteio sem repetição
    types.ts
  i18n/
    messages/{pt-BR,en}.json
    config.ts
public/
  og/                        # imagens estáticas (fallback)
```

### 4.3 Schema Supabase

```sql
-- ========================================================
-- Tabela: questions
-- ========================================================
create table public.questions (
  id             uuid primary key default gen_random_uuid(),
  track          text not null check (track in ('beginner','intermediate','advanced')),
  category       text not null check (category in (
                   'business','cli','hooks','mcp','agent_sdk','ide'
                 )),
  statement_pt   text not null,
  statement_en   text not null,
  correct_answer boolean not null,                  -- true = "Verdadeiro"
  explanation_pt text not null,
  explanation_en text not null,
  source_url     text not null,                     -- link docs oficial
  weight         smallint not null,                 -- 1 (beginner), 2 (intermediate), 3 (advanced)
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

create index idx_questions_track_active
  on public.questions(track) where active = true;

-- ========================================================
-- Tabela: results
-- ========================================================
create table public.results (
  id              uuid primary key default gen_random_uuid(),
  nickname        text not null check (
                    char_length(nickname) between 3 and 20
                    and nickname ~ '^[A-Za-z0-9_-]+$'
                  ),
  track           text not null check (track in ('beginner','intermediate','advanced')),
  round_size      smallint not null check (round_size in (30,40,50)),
  correct_count   smallint not null,
  score           integer not null,                 -- soma de acertos × peso
  percentage      numeric(5,2) not null,            -- 0.00 a 100.00
  duration_ms     integer not null,
  badge_tier      text check (badge_tier in ('bronze','silver','gold')),  -- null se <70%
  timer_enabled   boolean not null default false,
  question_ids    uuid[] not null,                  -- ordem da rodada
  answers         jsonb not null,                   -- [{qid, chosen, correct, time_ms}, ...]
  ip_hash         text,                             -- sha256(ip + salt) p/ rate limiting
  created_at      timestamptz not null default now()
);

create index idx_results_ranking
  on public.results(track, score desc, duration_ms asc);

create index idx_results_created
  on public.results(created_at desc);

-- ========================================================
-- RLS (Row Level Security)
-- ========================================================
alter table public.questions enable row level security;
alter table public.results   enable row level security;

-- Leitura pública de questions ativas
create policy "questions_public_read"
  on public.questions for select
  using (active = true);

-- Leitura pública de results (pro ranking)
create policy "results_public_read"
  on public.results for select
  using (true);

-- Insert público em results (via API, com rate limit a nível app)
create policy "results_public_insert"
  on public.results for insert
  with check (true);
```

### 4.4 Endpoints da API

| Método | Rota | Descrição | Request | Response |
|--------|------|-----------|---------|----------|
| `GET`  | `/api/questions?track={t}&size={n}&locale={l}` | Sorteia N questões ativas da trilha | query params | `{ questions: Question[] }` (sem `correct_answer` — validado server-side na submissão) |
| `POST` | `/api/results` | Salva resultado da rodada | `{ nickname, track, roundSize, timerEnabled, answers: [{qid, chosen, timeMs}] }` | `{ id, score, percentage, correctCount, badgeTier, rankingPosition }` |
| `GET`  | `/api/ranking?track={t}&limit=100` | Top 100 da trilha | query params | `{ entries: RankingEntry[] }` |
| `GET`  | `/api/badge/{tier}?nickname=X&score=Y&track=Z` | Imagem PNG do badge (OG) | query params | `image/png` 1200×630 |
| `GET`  | `/resultado/{id}` (página) | Página compartilhável de resultado com OG tags | path param | HTML SSR |

**Ponto crítico de segurança**: `/api/questions` **não** retorna `correct_answer`. O usuário envia suas respostas para `/api/results`, e o backend busca as respostas corretas, calcula score e retorna o resultado. Isso evita trapaça via DevTools.

### 4.5 Cálculo de Score (lib/quiz/scoring.ts)

```ts
type Answer = { qid: string; chosen: boolean; timeMs: number };
type Question = { id: string; correctAnswer: boolean; weight: number };

function calculateScore(answers: Answer[], questions: Question[]) {
  const qMap = new Map(questions.map(q => [q.id, q]));
  let score = 0;
  let correctCount = 0;
  for (const a of answers) {
    const q = qMap.get(a.qid);
    if (!q) continue;
    if (a.chosen === q.correctAnswer) {
      score += q.weight;
      correctCount += 1;
    }
  }
  const percentage = (correctCount / answers.length) * 100;
  const badgeTier =
    percentage >= 90 ? 'gold'
    : percentage >= 80 ? 'silver'
    : percentage >= 70 ? 'bronze'
    : null;
  return { score, correctCount, percentage, badgeTier };
}
```

### 4.6 Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only, usado nas API routes
NEXT_PUBLIC_SITE_URL=               # ex: https://claude-code-quiz.vercel.app
IP_HASH_SALT=                       # salt para hash de IP (rate limit)
```

---

## 5. Entregáveis por Sprint (sugestão)

### Sprint 1 — Fundação (projeto funcional, sem ranking)
- Setup Next.js 15 + TS + Tailwind + shadcn/ui.
- Setup Supabase (projeto + schema + RLS).
- Seed inicial: 60 perguntas (20 por trilha) para testar fluxo.
- Home com nickname + seleções.
- Rodada completa com sorteio, feedback imediato, explicação, link.
- Tela de resultado com score e badge (sem compartilhamento ainda).
- i18n com next-intl (PT-BR + EN).

### Sprint 2 — Social & Engajamento
- Página `/resultado/[id]` compartilhável com OG tags.
- Geração dinâmica de badge PNG via `next/og`.
- Botões de compartilhar (X, LinkedIn, copiar link).
- Ranking `/ranking` com 3 tabs por trilha.
- Rate limiting por IP hash em `/api/results`.

### Sprint 3 — Revisão & Polimento
- Tela de revisão pós-quiz.
- Modo "praticar só os erros".
- Cronômetro opcional (30 s/pergunta).
- Acessibilidade (auditoria axe/Lighthouse).
- Responsividade mobile completa.
- Pool completo: 300 perguntas (100 por trilha), todas com `source_url` validada.

---

## 6. Critérios de Aceite (v1)

- [ ] Usuário digita nickname válido e escolhe trilha + tamanho + timer.
- [ ] Rodada sorteia N questões únicas da trilha (sem repetição).
- [ ] Após responder, feedback imediato mostra correta/errada + explicação + link.
- [ ] Score calculado com pesos (1/2/3) por dificuldade.
- [ ] Badge Bronze/Prata/Ouro concedido apenas se ≥ 70%.
- [ ] Resultado gera página `/resultado/[id]` com OG image compartilhável.
- [ ] Ranking mostra top 100 por trilha, ordenado por score DESC + tempo ASC.
- [ ] Revisão pós-quiz lista todas as questões com respostas do usuário vs. corretas.
- [ ] Modo "praticar só erros" reinicia rodada apenas com questões erradas.
- [ ] Toggle PT-BR / EN funciona em toda a UI e nas perguntas.
- [ ] Mobile responsivo (testado 320 px até 1440 px).
- [ ] `/api/questions` nunca expõe `correct_answer` ao cliente.
- [ ] Rate limit de 10 submissões/hora por IP em `/api/results`.

---

## 7. Decisões em Aberto (para resolver durante implementação)

- Biblioteca de animações (Framer Motion vs. CSS puro). Recomendação: CSS + Tailwind primeiro; adicionar Framer só se necessário.
- Design do badge PNG (layout, cores, tipografia). Recomendação: usar cores do Tailwind `amber-600` (bronze), `slate-400` (prata), `yellow-400` (ouro).
- Mecanismo de anti-trapaça além do server-side validation (ex.: assinatura HMAC do `question_ids` na sessão).
- Estratégia de cache de `/api/questions` (stateless → cache CDN com Vary por query).

---

## 8. Referências

- Docs oficiais Claude Code: https://docs.claude.com/claude-code
- Supabase: https://supabase.com/docs
- Next.js 15 App Router: https://nextjs.org/docs/app
- shadcn/ui: https://ui.shadcn.com
- next-intl: https://next-intl-docs.vercel.app
- `next/og`: https://nextjs.org/docs/app/api-reference/functions/image-response
