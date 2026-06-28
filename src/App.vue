<script setup>
import { ref, onMounted } from "vue";
import RoadmapTimeline from "./components/RoadmapTimeline.vue";
import Modal from "./components/Modal.vue";

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDark.value = false;
    document.documentElement.classList.remove("dark");
  }
});

// Tab state
const activeTab = ref("Frontend");
const tabs = ["Frontend", "Backend", "AI"];

// Modal state
const isModalOpen = ref(false);
const activeNodeDetails = ref({
  title: "",
  description: "",
  resources: [],
});

const openDetailsModal = (node) => {
  activeNodeDetails.value = {
    title: node.title,
    description: node.detailedDescription || node.description,
    resources: node.resources || [],
  };
  isModalOpen.value = true;
};

// Field overview texts (exactly two sentences)
const overviews = {
  Frontend:
    "Frontend engineering focuses on crafting the user-facing portion of web applications. It bridges the gap between visual design and technical implementation, ensuring responsive and performant user experiences.",
  Backend:
    "Backend engineering manages the server-side logic, databases, APIs, and architecture that power web applications. It focuses on system reliability, secure data flows, and performant server processes.",
  AI: "Artificial Intelligence integration leverages powerful machine learning models to solve complex cognitive tasks. It connects modern applications with intelligent logic, vector reasoning, and real-time generation.",
};

// 4-5 dummy data nodes for the roadmap
const roadmapData = {
  Frontend: [
    {
      step: "01",
      title: "Semantic HTML & Responsive Layouts",
      description:
        "Master modern layout engines like CSS Grid and Flexbox alongside Tailwind CSS to construct fluid, accessible interfaces.",
      detailedDescription:
        "To survive in modern frontend engineering, interfaces must be fluid, lightning-fast, and accessible. This stage covers semantic layout planning, advanced grid layering, content-driven layouts with Flexbox, and Tailwind utility systems for extremely quick iterations without leaving your HTML markup.",
      milestones: ["Grid & Flexbox", "Tailwind Setup", "A11y Standards"],
      resources: [
        {
          name: "CSS Tricks - Complete Guide to Grid",
          url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
        },
        {
          name: "Tailwind CSS Official Documentation",
          url: "https://tailwindcss.com/docs",
        },
      ],
    },
    {
      step: "02",
      title: "JavaScript Essentials & DOM",
      description:
        "Understand variables, scopes, asynchronous patterns (promises, async/await), and event delegation in browser contexts.",
      detailedDescription:
        "JavaScript is the engine of interactivity on the web. This section ensures a deep, complete understanding of functional programming concepts, the event loop, closures, scope chains, and asynchronous behaviors crucial for seamless app experiences.",
      milestones: [
        "Promises / Async-Await",
        "Event Delegation",
        "ES6+ Features",
      ],
      resources: [
        {
          name: "MDN Web Docs - JavaScript Guide",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        },
        {
          name: "JavaScript.info - Detailed Tutorials",
          url: "https://javascript.info/",
        },
      ],
    },
    {
      step: "03",
      title: "Reactive Component Frameworks",
      description:
        "Deep dive into component lifecycle, reactive state management, and props pattern with modern libraries like Vue 3.",
      detailedDescription:
        "Static sites are not enough. High-performance apps utilize declarative rendering frameworks. This phase teaches you how to construct highly reusable UI component trees, utilize Vue 3's reactive Composition API (or React Hooks), structure modular global stores, and map complex browser routing cleanly.",
      milestones: ["Composition API", "Lifecycle Hooks", "Component Props"],
      resources: [
        { name: "Vue 3 Official Documentation", url: "https://vuejs.org/" },
        {
          name: "Frontend Masters - Modern Frontend Paths",
          url: "https://frontendmasters.com/",
        },
      ],
    },
    {
      step: "04",
      title: "State Management & Routing",
      description:
        "Learn global reactive state control systems and standard dynamic client-side router configurations.",
      detailedDescription:
        "As applications grow, routing state and managing variables across sibling and nested components becomes complex. This milestone standardizes state managers like Pinia (or Redux) and router frameworks to allow painless page transitions and persistent states.",
      milestones: ["Pinia / Redux", "Dynamic Routing", "Navigation Guards"],
      resources: [
        { name: "Pinia State Store Guide", url: "https://pinia.vuejs.org/" },
        { name: "Vue Router Official Docs", url: "https://router.vuejs.org/" },
      ],
    },
    {
      step: "05",
      title: "Build Tools & Optimization",
      description:
        "Understand code splitting, lazy loading, and profiling tools to maintain high speed and low bundle footprints.",
      detailedDescription:
        "A great UI is useless if it loads slowly. This phase trains you in browser-level optimization. You will learn code splitting, bundle minification via Vite/Rollup, dynamic resource prefetching, progressive images, and profiling your Core Web Vitals using Chrome Lighthouse to exceed speed targets.",
      milestones: ["Vite Config", "Lazy Loading", "Lighthouse Audits"],
      resources: [
        { name: "web.dev - Core Web Vitals", url: "https://web.dev/vitals/" },
        {
          name: "Vite Guide & Best Practices",
          url: "https://vitejs.dev/guide/",
        },
      ],
    },
  ],
  Backend: [
    {
      step: "01",
      title: "Language Fundamentals & Scripting",
      description:
        "Select a server environment (NodeJS, Python, or Go) and gain confidence in scripting, file systems, and execution flows.",
      detailedDescription:
        "The bedrock of backend execution is language mastery. This section builds confidence in basic I/O operations, writing unit-tests, scripting repetitive system processes, and handling process-level errors reliably.",
      milestones: [
        "NodeJS / Python / Go",
        "I/O Stream Basics",
        "Error Catching",
      ],
      resources: [
        { name: "Node.js Official Documentation", url: "https://nodejs.org/" },
        { name: "Python Starter Tutorials", url: "https://docs.python.org/3/" },
      ],
    },
    {
      step: "02",
      title: "API Design & Protocols",
      description:
        "Build robust, RESTful endpoints and explore event-driven architecture, versioning strategies, and OpenAPI specs.",
      detailedDescription:
        "Backend stability hinges on communication APIs. In this section, you will master standard RESTful architecture, HTTP response guidelines, payload validation techniques, WebSocket servers for real-time channels, and interactive documentation using Swagger/OpenAPI.",
      milestones: ["RESTful Design", "WebSockets", "Swagger/OpenAPI"],
      resources: [
        {
          name: "RESTful API Tutorial & Guidelines",
          url: "https://restfulapi.net/",
        },
        {
          name: "Swagger / OpenAPI Specification Guide",
          url: "https://swagger.io/specification/",
        },
      ],
    },
    {
      step: "03",
      title: "Data Persistence & Modeling",
      description:
        "Design relational schemas and NoSQL stores. Gain proficiency in indexing strategies, normal forms, and database migrations.",
      detailedDescription:
        "Data is the lifeblood of systems. You will learn schemas design, ACID transactional compliance, query optimizations, compound B-tree index structures, database migrations pipelines, and scaling reads via caching layers (e.g., Redis).",
      milestones: ["Schema Design", "Compound Indexing", "Transactions"],
      resources: [
        {
          name: "Use The Index, Luke! Database Indexing",
          url: "https://use-the-index-luke.com/",
        },
        {
          name: "PostgreSQL Tutorial & Best Practices",
          url: "https://www.postgresqltutorial.com/",
        },
      ],
    },
    {
      step: "04",
      title: "Security & Authentication",
      description:
        "Secure data transit and resource access utilizing robust mechanisms like JWT, OAuth 2.0, CORS, and helmet protections.",
      detailedDescription:
        "Never trust user inputs. This module teaches industry-grade protection. Implement secure session cookies, stateless JWT authentication, OAuth 2.0 single-sign-on integration, secure HTTP header tuning, and protection from OWASP Top 10 vulnerabilities.",
      milestones: ["JWT & Sessions", "OAuth Flow", "CORS & CSP"],
      resources: [
        { name: "JWT.io - Introduction and Tokens", url: "https://jwt.io/" },
        {
          name: "OWASP Top 10 Security Project",
          url: "https://owasp.org/www-project-top-ten/",
        },
      ],
    },
    {
      step: "05",
      title: "Distributed Caching & Message Queues",
      description:
        "Mitigate database loads by setting up caching levels and managing backend communication asynchronously.",
      detailedDescription:
        "High-scale systems rely on lightweight caching layers and event brokers. Learn to implement Redis in-memory caches and utilize event streaming brokers like Apache Kafka or RabbitMQ to isolate independent processes.",
      milestones: ["Redis Cache", "RabbitMQ / Kafka", "Pub-Sub Pattern"],
      resources: [
        { name: "Redis Cache Documentation", url: "https://redis.io/docs/" },
        {
          name: "RabbitMQ Getting Started Guide",
          url: "https://www.rabbitmq.com/getstarted.html",
        },
      ],
    },
  ],
  AI: [
    {
      step: "01",
      title: "Python & Foundational AI APIs",
      description:
        "Grasp fundamental Python libraries and learn to make structured inference queries to model APIs.",
      detailedDescription:
        "Getting started in AI integration begins with leveraging cloud APIs. This phase teaches you environment management, synchronous/asynchronous SDK structures, and structured JSON payload handling.",
      milestones: ["Python SDKs", "JSON Responses", "Rate Limits"],
      resources: [
        {
          name: "OpenAI API Reference Guide",
          url: "https://platform.openai.com/docs/api-reference",
        },
        {
          name: "Anthropic API Quickstart",
          url: "https://docs.anthropic.com/en/api/getting-started",
        },
      ],
    },
    {
      step: "02",
      title: "Prompt Engineering & Tool Use",
      description:
        "Create complex, predictable prompt structures and integrate models with programmatic external functions.",
      detailedDescription:
        "Unlock autonomous behaviors. Design robust system directions, configure multi-shot examples, and setup function-calling schemas where the model decides when to query APIs or run local code routines.",
      milestones: [
        "System Directives",
        "Function Calling",
        "Few-Shot Patterns",
      ],
      resources: [
        {
          name: "OpenAI Prompting Guide",
          url: "https://platform.openai.com/docs/guides/prompt-engineering",
        },
        {
          name: "Anthropic Prompt Library",
          url: "https://docs.anthropic.com/en/prompt-library/library",
        },
      ],
    },
    {
      step: "03",
      title: "Embeddings & Vector Search",
      description:
        "Convert textual information into numerical representations and construct local search catalogs.",
      detailedDescription:
        "Power your apps with semantic comprehension. Generate vector embeddings using models, persist them into vector libraries, and perform lightning-fast Cosine Similarity queries to find related information.",
      milestones: ["Text Embeddings", "Cosine Similarity", "Vector Indexes"],
      resources: [
        {
          name: "Pinecone Vector DB Master Class",
          url: "https://www.pinecone.io/learn/",
        },
        { name: "Chroma DB Documentation", url: "https://docs.trychroma.com/" },
      ],
    },
    {
      step: "04",
      title: "Retrieval-Augmented Generation (RAG)",
      description:
        "Feed specialized database findings to models to allow queries on custom documents.",
      detailedDescription:
        "RAG resolves the LLM knowledge limit. Learn to chunk files efficiently, query vector collections based on user questions, and inject relevant context dynamically into LLM prompts for factual responses.",
      milestones: [
        "Document Chunking",
        "Context Injection",
        "Hallucination Mitigating",
      ],
      resources: [
        {
          name: "LangChain RAG Architecture Guide",
          url: "https://python.langchain.com/docs/use_cases/question_answering/",
        },
        { name: "LlamaIndex Documentation", url: "https://www.llamaindex.ai/" },
      ],
    },
    {
      step: "05",
      title: "Fine-Tuning & Local Inference",
      description:
        "Host open-weight models locally and understand when to tweak model weights directly.",
      detailedDescription:
        "To maintain database privacy and lower API costs, deploy open models. This phase explores running GGUF/AWQ quantized models locally using Ollama/vLLM and configuring adapters (LoRA) for targeted performance tasks.",
      milestones: ["Ollama / vLLM", "Quantization Formats", "LoRA Adapters"],
      resources: [
        {
          name: "vLLM Engine for High-Throughput Serve",
          url: "https://github.com/vllm-project/vllm",
        },
        { name: "Ollama Local Engine Setup", url: "https://ollama.com/" },
      ],
    },
  ],
};

// Projects to build by category (3 levels)
const projectTiers = {
  Frontend: [
    {
      level: "Level 1: Beginner",
      title: "Minimalist Pomodoro Timer",
      desc: "Construct a sleek, focus-driven circular countdown clock. Work with core web browser interval APIs, reactive state switches, and simple dark mode layout toggles.",
      stack: ["HTML5", "Vite", "Tailwind CSS", "Local Storage"],
    },
    {
      level: "Level 2: Intermediate",
      title: "Collaborative Markdown Editor",
      desc: "Implement a beautiful split-screen markdown compiler with local data persistence, auto-saving indicators, and simple syntax theme customizations.",
      stack: ["Vue 3 / React", "Marked.js", "Tailwind CSS", "Local Storage"],
    },
    {
      level: "Level 3: Advanced",
      title: "Real-Time Kanban Dashboard",
      desc: "Create a highly interactive workspace with drag-and-drop lists, card filtering, custom labels, and realistic animation frames.",
      stack: ["Vue 3", "Tailwind CSS", "SortableJS", "Pinia Store"],
    },
  ],
  Backend: [
    {
      level: "Level 1: Beginner",
      title: "Multi-User Task REST API",
      desc: "Deploy a clean backend system allowing users to sign-up, securely log-in, and manage custom task catalogs. Include full request parsing, data schemas, and status handling.",
      stack: ["NodeJS / Express", "SQLite", "bcrypt", "JSON Web Tokens"],
    },
    {
      level: "Level 2: Intermediate",
      title: "Real-Time WebSocket Chat Server",
      desc: "Establish a scalable chat router holding secure room channels, real-time message relays, historical query lookups, and system alerts.",
      stack: [
        "NodeJS",
        "WebSockets / Socket.io",
        "Redis Pub/Sub",
        "PostgreSQL",
      ],
    },
    {
      level: "Level 3: Advanced",
      title: "Microservice Billing Pipeline",
      desc: "Build a highly scalable, event-driven subscription processor handling transaction queues, webhook alerts, and async invoice exports securely.",
      stack: [
        "Docker",
        "NodeJS / Go",
        "RabbitMQ / Kafka",
        "PostgreSQL",
        "Redis",
      ],
    },
  ],
  AI: [
    {
      level: "Level 1: Beginner",
      title: "Semantic Document Searcher",
      desc: "Index custom textual lines and perform mathematical similarity queries against natural questions. Connect to embedding models and display results instantly.",
      stack: ["Python", "OpenAI Embedding API", "ChromaDB / SQLite"],
    },
    {
      level: "Level 2: Intermediate",
      title: "Multi-Agent Support Assistant",
      desc: "Design an automated helpdesk router holding secondary specialized agents (billing, technical, refunds) that communicate via clean function interfaces.",
      stack: ["Python", "FastAPI", "OpenAI Tool Calling", "LangChain"],
    },
    {
      level: "Level 3: Advanced",
      title: "Custom Code Assistant Engine",
      desc: "Host a quantized code generation LLM locally, parse contextual project files, feed prompt repositories, and generate clean syntax patches asynchronously.",
      stack: ["Docker", "vLLM / llama.cpp", "FastAPI", "ChromaDB", "Python"],
    },
  ],
};

// Best Practices / General Advice
const generalAdvice = [
  {
    title: "Embrace the struggle",
    body: "Learning to code is non-linear. Feeling stuck is a natural part of developing neural pathways for logic, not a sign of lack of ability.",
  },
  {
    title: "Build to learn",
    body: "Reading documentation or tutorials provides familiarity, but building projects, breaking them, and debugging them builds true muscle memory.",
  },
  {
    title: "Prioritize consistency",
    body: "Devoting 45 minutes of daily, high-focus effort yields vastly superior retention compared to an occasional 8-hour sprint on weekends.",
  },
];
</script>

<template>
  <div
    class="min-h-screen flex flex-col selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300"
  >
    <!-- Header -->
    <header
      class="border-b border-zinc-200/60 dark:border-zinc-800/60 sticky top-0 bg-[#fbfbfa]/85 dark:bg-[#0c0c0d]/85 backdrop-blur-sm z-50"
    >
      <div
        class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <!-- Minimalist logo -->
          <div
            class="w-2.5 h-2.5 bg-zinc-800 dark:bg-zinc-100 rounded-none"
          ></div>
          <span class="font-mono text-sm tracking-widest uppercase font-medium"
            >survival.map</span
          >
        </div>

        <!-- Dark/Light Mode Toggle Switch -->
        <button
          @click="toggleDarkMode"
          class="group relative flex items-center justify-between w-14 h-8 px-1 rounded-full focus:outline-none border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 hover:border-zinc-700 dark:hover:border-zinc-200"
          aria-label="Toggle dark mode"
        >
          <span
            class="absolute left-1 top-1 w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ease-out"
            :class="
              isDark
                ? 'translate-x-6 bg-white text-zinc-800'
                : 'translate-x-0 bg-zinc-800 text-white'
            "
            >{{ isDark ? "D" : "L" }}</span
          >
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow max-w-4xl w-full mx-auto px-6 py-16 md:py-24">
      <!-- Hero Section -->
      <section class="mb-16 text-left">
        <p
          class="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4"
        >
          the engineer's compass
        </p>
        <h1
          class="text-3xl md:text-5xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 leading-tight"
        >
          A minimalist guide to surviving modern software engineering.
        </h1>
        <p
          class="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed font-light"
        >
          No noise, no hype. Just a structured, distilled roadmap covering the
          core competencies that stand the test of time.
        </p>
      </section>

      <!-- 3-Tab Navigation Menu (Centered) -->
      <section class="mb-12">
        <div
          class="flex justify-center border-b border-zinc-200/60 dark:border-zinc-800/60"
        >
          <nav class="flex gap-8 -mb-px" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="pb-4 px-1 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-b-2 bg-transparent focus:outline-none"
              :class="
                activeTab === tab
                  ? 'border-zinc-800 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-medium'
                  : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              "
            >
              {{ tab }}
            </button>
          </nav>
        </div>
      </section>

      <!-- 3-Tab Restructured Dynamic Core Area -->
      <div class="space-y-24">
        <!-- 1. Overview Section -->
        <section class="text-left max-w-2xl mx-auto">
          <h2
            class="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 border-b border-zinc-100 dark:border-zinc-900/50 pb-2"
          >
            Field Overview
          </h2>
          <p
            class="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed font-light"
          >
            {{ overviews[activeTab] }}
          </p>
        </section>

        <!-- 2. The Roadmap Section (Timeline) -->
        <section class="max-w-2xl mx-auto">
          <h2
            class="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-10 text-left border-b border-zinc-100 dark:border-zinc-900/50 pb-2"
          >
            The Timeline Path
          </h2>
          <RoadmapTimeline
            :items="roadmapData[activeTab]"
            @node-click="openDetailsModal"
          />
        </section>

        <!-- 3. Projects Section -->
        <section class="max-w-4xl mx-auto text-left">
          <h2
            class="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8 border-b border-zinc-100 dark:border-zinc-900/50 pb-2"
          >
            Projects to Build
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              v-for="project in projectTiers[activeTab]"
              :key="project.level"
              class="p-6 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between"
            >
              <div>
                <span
                  class="font-mono text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-3"
                >
                  {{ project.level }}
                </span>
                <h3
                  class="text-base font-normal text-zinc-800 dark:text-zinc-100 mb-3"
                >
                  {{ project.title }}
                </h3>
                <p
                  class="text-zinc-500 dark:text-zinc-400 text-xs font-light leading-relaxed mb-6"
                >
                  {{ project.desc }}
                </p>
              </div>

              <div
                class="border-t border-zinc-100 dark:border-zinc-900/50 pt-4 mt-auto"
              >
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tech in project.stack"
                    :key="tech"
                    class="font-mono text-[8px] text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/30 px-1.5 py-0.5 border border-zinc-200/40 dark:border-zinc-800/40"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Persistent Best Practices & Advice Section -->
      <section
        class="mt-32 pt-16 border-t border-zinc-200/60 dark:border-zinc-800/60"
      >
        <div class="text-left mb-10">
          <p
            class="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2"
          >
            guideline
          </p>
          <h2 class="text-xl font-normal text-zinc-900 dark:text-zinc-100">
            Best Practices & Advice
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="advice in generalAdvice"
            :key="advice.title"
            class="p-6 border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/30 dark:bg-zinc-900/10"
          >
            <h3
              class="font-mono text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3"
            >
              {{ advice.title }}
            </h3>
            <p
              class="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed"
            >
              {{ advice.body }}
            </p>
          </div>
        </div>
      </section>

      <!-- Extra Quote Section (Utilizing lot of negative space) -->
      <section
        class="mt-20 py-12 border-t border-b border-zinc-100 dark:border-zinc-900 text-center"
      >
        <p
          class="font-light italic text-zinc-400 dark:text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed"
        >
          "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
        </p>
      </section>
    </main>

    <!-- Persistent Footer -->
    <footer
      class="border-t border-zinc-200/60 dark:border-zinc-800/60 mt-auto bg-[#fbfbfa]/50 dark:bg-[#0c0c0d]/50"
    >
      <div
        class="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div class="text-left">
          <span class="font-mono text-[11px] text-zinc-400 dark:text-zinc-500"
            >© 2026 CODING SURVIVAL ROADMAP.</span
          >
        </div>
        <div class="flex gap-6 font-mono text-[11px]">
          <a
            href="#"
            class="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors duration-200"
            >ROADMAP</a
          >
          <a
            href="#"
            class="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors duration-200"
            >RESOURCES</a
          >
          <a
            href="#"
            class="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors duration-200"
            >GITHUB</a
          >
        </div>
      </div>
    </footer>

    <!-- Reusable Modal Details Component -->
    <Modal
      :is-open="isModalOpen"
      :title="activeNodeDetails.title"
      :description="activeNodeDetails.description"
      :resources="activeNodeDetails.resources"
      @close="isModalOpen = false"
    />
  </div>
</template>
