/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_AUTH_MODE: string
  readonly VITE_USE_MOCK_DATA: string
  readonly VITE_APP_NAME: string
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_DEFAULT_THEME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
