interface ImportMetaEnv {
  readonly PUBLIC_TOKEN: string;
  readonly RESEND_API_KEY: string;
  readonly PUBLIC_HCAPTCHA_SITE_KEY: string;
  readonly HCAPTCHA_SECRET_KEY: string;
  // más variables de entorno si las hay...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
