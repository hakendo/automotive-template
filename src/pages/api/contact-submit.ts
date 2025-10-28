import type { APIRoute } from "astro";

const formEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;
const recaptchaSecret = import.meta.env.RECAPTCHA_SECRET_KEY;

const REQUIRED_FIELDS = ["name", "email", "message"];

const isValidEmail = (email: unknown): email is string =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildFormspreeBody = (data: Record<string, FormDataEntryValue>): URLSearchParams => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "string") params.append(key, value);
  });
  return params;
};

export const POST: APIRoute = async ({ request }) => {
  if (!formEndpoint || !recaptchaSecret) {
    console.error("Formspree endpoint o clave secreta reCAPTCHA no configurados.");
    return new Response(
      JSON.stringify({ success: false, message: "Configuración del servidor incompleta." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (request.headers.get("content-type")?.includes("multipart/form-data")) {
    // No esperamos archivos; normalizamos a JSON.
    const formData = await request.formData();
    request = new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: "Formato inválido de datos enviados." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const token = typeof payload["g-recaptcha-response"] === "string" ? payload["g-recaptcha-response"] : "";
  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: "Token reCAPTCHA faltante." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const recaptchaVerifyResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: recaptchaSecret,
        response: token,
      }).toString(),
    });

    const recaptchaResult = (await recaptchaVerifyResponse.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!recaptchaResult.success || typeof recaptchaResult.score === "number" && recaptchaResult.score < 0.3) {
      console.warn("reCAPTCHA falló:", recaptchaResult);
      return new Response(
        JSON.stringify({ success: false, message: "No pudimos validar que seas humano." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Error al verificar reCAPTCHA:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error al validar reCAPTCHA, intenta nuevamente." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  for (const field of REQUIRED_FIELDS) {
    const value = payload[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: `El campo ${field} es obligatorio.` }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  if (!isValidEmail(payload.email)) {
    return new Response(
      JSON.stringify({ success: false, message: "El correo electrónico no es válido." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const formEntries = Object.entries(payload).reduce<Record<string, FormDataEntryValue>>((acc, [key, value]) => {
    if (typeof value === "string") acc[key] = value;
    return acc;
  }, {});

  // Google recomienda no reenviar el token después de validarlo; lo removemos.
  try {
    const formspreeResponse = await fetch(formEndpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: buildFormspreeBody(formEntries),
    });

    if (!formspreeResponse.ok) {
      const errorBody = await formspreeResponse.json().catch(() => null);
      console.error("Formspree respondió con error:", errorBody || formspreeResponse.statusText);
      throw new Error(typeof errorBody?.error === "string" ? errorBody.error : "Error al enviar formulario.");
    }
  } catch (error) {
    console.error("Error al llamar a Formspree:", error);
    return new Response(
      JSON.stringify({ success: false, message: "No pudimos enviar tu mensaje. Intenta nuevamente." }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
