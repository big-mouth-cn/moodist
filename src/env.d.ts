/// <reference types="astro/client" />

declare module '*.module.css';

interface ImportMetaEnv {
  readonly PUBLIC_LLM_API_KEY?: string;
  readonly PUBLIC_LLM_BASE_URL?: string;
  readonly PUBLIC_LLM_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
