
interface ImportMetaEnv {
  readonly VITE_HUB_URL: string;
  readonly VITE_ITEM_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}