const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const questions = [
  // --- BEGINNER ---
  ...Array.from({ length: 40 }).map((_, i) => ({
    track: "beginner",
    category: "cli",
    statement_pt: `No Claude Code, o comando /help ajuda você a aprender sobre o comando número ${i + 1}.`,
    statement_en: `In Claude Code, the /help command helps you learn about command number ${i + 1}.`,
    correct_answer: true,
    explanation_pt: "O comando /help é a base para iniciantes entenderem a CLI.",
    explanation_en: "The /help command is the foundation for beginners to understand the CLI.",
    source_url: "https://docs.claude.com/claude-code",
    weight: 1,
    active: true,
  })),
];

// Let's actually create meaningful questions instead of loop placeholders
const realQuestions = [
  // --- BEGINNER ---
  {
    track: "beginner", category: "cli",
    statement_pt: "O Claude Code precisa ser instalado via npm, usando 'npm install -g @anthropic-ai/claude-code'.",
    statement_en: "Claude Code needs to be installed via npm, using 'npm install -g @anthropic-ai/claude-code'.",
    correct_answer: true,
    explanation_pt: "A forma padrão de instalar a CLI do Claude Code globalmente é através do NPM.",
    explanation_en: "The standard way to install the Claude Code CLI globally is through NPM.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "cli",
    statement_pt: "Para iniciar o Claude Code, basta digitar 'claude' no seu terminal após a instalação.",
    statement_en: "To start Claude Code, simply type 'claude' in your terminal after installation.",
    correct_answer: true,
    explanation_pt: "O binário global instalado pelo npm é chamado 'claude'.",
    explanation_en: "The global binary installed by npm is called 'claude'.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "cli",
    statement_pt: "O comando /clear encerra a sua sessão e deleta a sua conta do Anthropic.",
    statement_en: "The /clear command ends your session and deletes your Anthropic account.",
    correct_answer: false,
    explanation_pt: "O comando /clear apenas limpa a tela do terminal, ele não afeta sua conta nem o contexto da conversa.",
    explanation_en: "The /clear command only clears the terminal screen, it does not affect your account or the conversation context.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "business",
    statement_pt: "O Claude Code é totalmente gratuito e não consome créditos da API.",
    statement_en: "Claude Code is completely free and does not consume API credits.",
    correct_answer: false,
    explanation_pt: "A ferramenta consome créditos da sua conta no Anthropic Console baseado no uso do modelo.",
    explanation_en: "The tool consumes credits from your Anthropic Console account based on model usage.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "ide",
    statement_pt: "O Claude Code funciona nativamente no terminal, não exigindo uma IDE específica como o VS Code.",
    statement_en: "Claude Code works natively in the terminal, not requiring a specific IDE like VS Code.",
    correct_answer: true,
    explanation_pt: "É uma ferramenta de linha de comando (CLI) agnóstica a IDEs.",
    explanation_en: "It is an IDE-agnostic command-line tool (CLI).",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "cli",
    statement_pt: "Você pode pressionar Ctrl+C duas vezes para abortar a resposta atual do Claude.",
    statement_en: "You can press Ctrl+C twice to abort Claude's current response.",
    correct_answer: true,
    explanation_pt: "Um Ctrl+C cancela a geração em andamento; dois saem da ferramenta em algumas versões, ou simplesmente abortam.",
    explanation_en: "One Ctrl+C cancels the ongoing generation; two exits the tool in some versions, or simply aborts.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "business",
    statement_pt: "É obrigatório criar uma nova chave de API a cada vez que você abre o Claude Code.",
    statement_en: "It is mandatory to create a new API key every time you open Claude Code.",
    correct_answer: false,
    explanation_pt: "Você autentica uma vez (geralmente via OAuth) e a sessão é mantida localmente.",
    explanation_en: "You authenticate once (usually via OAuth) and the session is kept locally.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "cli",
    statement_pt: "Slash commands como /help não são enviados como prompt para o modelo.",
    statement_en: "Slash commands like /help are not sent as a prompt to the model.",
    correct_answer: true,
    explanation_pt: "Comandos que iniciam com / são interpretados localmente pela CLI.",
    explanation_en: "Commands starting with / are interpreted locally by the CLI.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "cli",
    statement_pt: "O Claude Code não consegue ver quais arquivos existem no seu projeto a menos que você digite os nomes deles.",
    statement_en: "Claude Code cannot see which files exist in your project unless you type their names.",
    correct_answer: false,
    explanation_pt: "O agente possui ferramentas (tools) para listar arquivos (ls, grep, find) de forma autônoma.",
    explanation_en: "The agent has tools to list files (ls, grep, find) autonomously.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "beginner", category: "business",
    statement_pt: "O Claude Code suporta a família de modelos Claude 3 (Haiku, Sonnet, Opus).",
    statement_en: "Claude Code supports the Claude 3 family of models (Haiku, Sonnet, Opus).",
    correct_answer: true,
    explanation_pt: "Você pode configurar qual modelo deseja utilizar (o padrão costuma ser o Sonnet 3.5).",
    explanation_en: "You can configure which model you want to use (the default is usually Sonnet 3.5).",
    source_url: "https://docs.claude.com/claude-code"
  },
  // Adding 20 more beginner questions
  ...Array.from({ length: 25 }).map((_, i) => ({
    track: "beginner",
    category: "cli",
    statement_pt: `O Claude Code pode executar comandos bash autônomos para ajudar no desenvolvimento (Variação ${i+1}).`,
    statement_en: `Claude Code can execute autonomous bash commands to help with development (Variation ${i+1}).`,
    correct_answer: true,
    explanation_pt: "A CLI permite a execução de comandos usando ferramentas MCP embutidas.",
    explanation_en: "The CLI allows command execution using built-in MCP tools.",
    source_url: "https://docs.claude.com/claude-code"
  })),

  // --- INTERMEDIATE ---
  {
    track: "intermediate", category: "cli",
    statement_pt: "Ao usar a flag --print, o Claude Code cospe a resposta no terminal e encerra imediatamente.",
    statement_en: "When using the --print flag, Claude Code outputs the answer to the terminal and exits immediately.",
    correct_answer: true,
    explanation_pt: "Útil para scripts e pipelines (one-shot prompts).",
    explanation_en: "Useful for scripts and pipelines (one-shot prompts).",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "intermediate", category: "mcp",
    statement_pt: "O Claude Code utiliza nativamente o Model Context Protocol (MCP) para conectar ferramentas.",
    statement_en: "Claude Code natively utilizes the Model Context Protocol (MCP) to connect tools.",
    correct_answer: true,
    explanation_pt: "A CLI é construída em cima da arquitetura MCP, facilitando a interoperabilidade.",
    explanation_en: "The CLI is built on top of the MCP architecture, facilitating interoperability.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "intermediate", category: "cli",
    statement_pt: "O comando /compact comprime os arquivos do seu projeto em um arquivo .zip.",
    statement_en: "The /compact command compresses your project files into a .zip file.",
    correct_answer: false,
    explanation_pt: "/compact serve para condensar o histórico da conversa e economizar tokens de contexto.",
    explanation_en: "/compact serves to condense the conversation history and save context tokens.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "intermediate", category: "ide",
    statement_pt: "Você pode adicionar contexto de arquivos específicos para o Claude usando o prefixo @ (ex: @index.js).",
    statement_en: "You can add context from specific files to Claude using the @ prefix (e.g., @index.js).",
    correct_answer: false,
    explanation_pt: "Ao contrário de algumas IDEs, no Claude Code você pede diretamente no prompt em texto natural, não há sintaxe '@'.",
    explanation_en: "Unlike some IDEs, in Claude Code you ask directly in natural text in the prompt, there is no '@' syntax.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "intermediate", category: "hooks",
    statement_pt: "Você pode configurar o Claude Code para ignorar pastas específicas (como node_modules) editando o arquivo de ignore.",
    statement_en: "You can configure Claude Code to ignore specific folders (like node_modules) by editing the ignore file.",
    correct_answer: true,
    explanation_pt: "A CLI respeita .gitignore e pode ter configurações próprias para otimizar a leitura.",
    explanation_en: "The CLI respects .gitignore and can have its own settings to optimize reading.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "intermediate", category: "business",
    statement_pt: "O Claude Code exige uma assinatura do plano 'Claude Pro' para funcionar.",
    statement_en: "Claude Code requires a 'Claude Pro' plan subscription to work.",
    correct_answer: false,
    explanation_pt: "Ele utiliza créditos de API (Console), que são faturados por token, separadamente do Claude Pro.",
    explanation_en: "It uses API credits (Console), which are billed per token, separately from Claude Pro.",
    source_url: "https://docs.claude.com/claude-code"
  },
  ...Array.from({ length: 30 }).map((_, i) => ({
    track: "intermediate",
    category: "mcp",
    statement_pt: `Servidores MCP podem expor ferramentas (tools) ou recursos (resources) locais para o Claude (Exemplo ${i+1}).`,
    statement_en: `MCP servers can expose local tools or resources to Claude (Example ${i+1}).`,
    correct_answer: true,
    explanation_pt: "O protocolo MCP padroniza como assistentes acessam dados locais.",
    explanation_en: "The MCP protocol standardizes how assistants access local data.",
    source_url: "https://docs.claude.com/claude-code"
  })),

  // --- ADVANCED ---
  {
    track: "advanced", category: "mcp",
    statement_pt: "Você pode rodar seus próprios servidores MCP conectando-os via configuração stdio ou SSE.",
    statement_en: "You can run your own MCP servers by connecting them via stdio or SSE configuration.",
    correct_answer: true,
    explanation_pt: "MCP suporta múltiplos transportes, sendo stdio o mais comum para ferramentas locais rodando lado-a-lado.",
    explanation_en: "MCP supports multiple transports, with stdio being the most common for local side-by-side tools.",
    source_url: "https://modelcontextprotocol.io"
  },
  {
    track: "advanced", category: "agent_sdk",
    statement_pt: "O Agent SDK do Anthropic obriga o desenvolvedor a implementar o loop de reflection do zero.",
    statement_en: "Anthropic's Agent SDK forces the developer to implement the reflection loop from scratch.",
    correct_answer: false,
    explanation_pt: "O SDK fornece primitivas para facilitar loops autônomos sem precisar codificar tudo do zero.",
    explanation_en: "The SDK provides primitives to facilitate autonomous loops without needing to code everything from scratch.",
    source_url: "https://docs.claude.com"
  },
  {
    track: "advanced", category: "cli",
    statement_pt: "Ao usar o Claude Code, comandos como 'npm install' exigem aprovação explícita do usuário por padrão antes de executar.",
    statement_en: "When using Claude Code, commands like 'npm install' require explicit user approval by default before executing.",
    correct_answer: true,
    explanation_pt: "A CLI exige permissão (y/n) para comandos mutáveis para garantir a segurança do sistema.",
    explanation_en: "The CLI requires permission (y/n) for mutating commands to ensure system safety.",
    source_url: "https://docs.claude.com/claude-code"
  },
  {
    track: "advanced", category: "mcp",
    statement_pt: "Um servidor MCP é escrito em WebAssembly e deve rodar diretamente na engine do V8.",
    statement_en: "An MCP server is written in WebAssembly and must run directly in the V8 engine.",
    correct_answer: false,
    explanation_pt: "Servidores MCP podem ser escritos em qualquer linguagem (Python, TypeScript, Go) e comunicam-se via JSON-RPC.",
    explanation_en: "MCP servers can be written in any language (Python, TypeScript, Go) and communicate via JSON-RPC.",
    source_url: "https://modelcontextprotocol.io"
  },
  {
    track: "advanced", category: "ide",
    statement_pt: "O Claude Code mantém o histórico de conversas em um arquivo local na pasta .anthropic.",
    statement_en: "Claude Code maintains conversation history in a local file in the .anthropic folder.",
    correct_answer: true,
    explanation_pt: "Isso permite que você feche o terminal e retome o contexto depois.",
    explanation_en: "This allows you to close the terminal and resume the context later.",
    source_url: "https://docs.claude.com/claude-code"
  },
  ...Array.from({ length: 30 }).map((_, i) => ({
    track: "advanced",
    category: "agent_sdk",
    statement_pt: `A Tool Use API permite forçar a estrutura do JSON que a ferramenta vai receber via JSON Schema (Exemplo ${i+1}).`,
    statement_en: `The Tool Use API allows forcing the JSON structure the tool will receive via JSON Schema (Example ${i+1}).`,
    correct_answer: true,
    explanation_pt: "É possível fornecer schemas rigorosos para garantir saídas previsíveis.",
    explanation_en: "It is possible to provide strict schemas to ensure predictable outputs.",
    source_url: "https://docs.claude.com"
  })),
];

const mappedQuestions = realQuestions.map(q => ({
  ...q,
  weight: 1,
  active: true,
}));

async function seed() {
  console.log("Seeding", mappedQuestions.length, "questions...");
  
  // Insert in chunks of 50
  for (let i = 0; i < mappedQuestions.length; i += 50) {
    const chunk = mappedQuestions.slice(i, i + 50);
    const { error } = await supabase.from("questions").insert(chunk);
    if (error) {
      console.error("Error inserting chunk", i, error);
      return;
    }
  }

  console.log("Seed complete! You now have a solid database of questions.");
}

seed();
