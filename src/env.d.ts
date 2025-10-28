interface ImportMetaEnv {
  readonly PUBLIC_TOKEN: string;
  readonly PUBLIC_FORMSPREE_ENDPOINT: string;
  readonly PUBLIC_RECAPTCHA_SITE_KEY: string;
  // más variables de entorno si las hay...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
