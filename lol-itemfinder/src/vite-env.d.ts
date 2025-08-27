/// <reference types="vite/client" />

// Define additional types for Vite's import.meta.env
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  // Add any other env vars you use here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
