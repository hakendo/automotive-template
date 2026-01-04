import type { APIRoute } from "astro";
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

const recaptchaSecret = import.meta.env.RECAPTCHA_SECRET_KEY;
const brevoApiKey = import.meta.env.BREVO_API_KEY;

const CONTACT_REQUIRED_FIELDS = ["name", "email", "message", "phone"] as const;
const CONSIGNMENT_REQUIRED_FIELDS = ["name", "email", "phone", "carBrand", "carModel", "carYear", "carMileage"] as const;
const CONTACT_RECIPIENT = "roco.solange@automotiveconsulting.cl";
const CONTACT_BCC = "contacto@venpu.cl";
const FROM_ADDRESS = "Automotive Consulting <noreply@automotiveconsulting.cl>";
const FROM_EMAIL = "noreply@automotiveconsulting.cl";

const isValidEmail = (value: unknown): value is string =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizePayload = (payload: Record<string, unknown>) =>
  Object.entries(payload).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === "string") acc[key] = value.trim();
    return acc;
  }, {});

const buildHtml = (data: Record<string, string>) => {
  const formLabel = data.formType === "consignacion" ? "Formulario de Consignación" : "Formulario de Contacto";
  const rows = Object.entries(data)
    .filter(([key]) => key !== "g-recaptcha-response" && key !== "formType")
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase());
      return `<tr><td style="padding:4px 8px;font-weight:600;">${label}</td><td style="padding:4px 8px;">${value
        .split("\n")
        .map((line) => line || "<br>")
        .join("<br>")}</td></tr>`;
    })
    .join("");

  return `
    <h1 style="margin:0 0 12px;">${formLabel}</h1>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%;">
      ${rows}
    </table>
  `;
};

const buildConfirmationHtml = (name: string, data: Record<string, string>) => {
  const isConsignation = data.formType === "consignacion";
  const formType = isConsignation ? "consignación" : "contacto";
  
  let detailsHtml = "";
  if (isConsignation) {
    detailsHtml = `
      <tr><td style="padding:8px;font-weight:600;">Marca:</td><td style="padding:8px;">${data.carBrand || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:600;">Modelo:</td><td style="padding:8px;">${data.carModel || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:600;">Año:</td><td style="padding:8px;">${data.carYear || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:600;">Kilometraje:</td><td style="padding:8px;">${data.carMileage || "N/A"} km</td></tr>
    `;
  } else {
    detailsHtml = `
      <tr><td style="padding:8px;font-weight:600;">Mensaje:</td><td style="padding:8px;">${data.message || "N/A"}</td></tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #0f766e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Automotive Consulting</h1>
      </div>
      <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0f766e; margin-top: 0;">¡Hola ${name}!</h2>
        <p>Gracias por completar nuestro formulario de ${formType}. Hemos recibido tu solicitud correctamente.</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <h3 style="color: #0f766e; margin-top: 0;">Resumen de tu solicitud:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding:8px;font-weight:600;">Nombre:</td><td style="padding:8px;">${data.name || "N/A"}</td></tr>
            <tr><td style="padding:8px;font-weight:600;">Email:</td><td style="padding:8px;">${data.email || "N/A"}</td></tr>
            <tr><td style="padding:8px;font-weight:600;">Teléfono:</td><td style="padding:8px;">${data.phone || "N/A"}</td></tr>
            ${detailsHtml}
          </table>
        </div>
        
        <p><strong>¿Qué sigue ahora?</strong></p>
        <ul style="padding-left: 20px;">
          <li>Revisaremos tu solicitud y te contactaremos en menos de 24 horas hábiles.</li>
          <li>Uno de nuestros especialistas se pondrá en contacto contigo para coordinar los siguientes pasos.</li>
          <li>Te acompañaremos durante todo el proceso.</li>
        </ul>
        
        <p>Si necesitas una respuesta urgente, puedes contactarnos directamente:</p>
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <p style="margin: 5px 0;"><strong>Teléfono:</strong> <a href="tel:+56976225094" style="color: #0f766e;">+56 9 7622 5094</a></p>
          <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:roco.solange@automotiveconsulting.cl" style="color: #0f766e;">roco.solange@automotiveconsulting.cl</a></p>
        </div>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          Este es un correo automático, por favor no respondas directamente a este mensaje.
        </p>
      </div>
    </body>
    </html>
  `;
};

export const POST: APIRoute = async ({ request }) => {
  if (!recaptchaSecret || !brevoApiKey) {
    console.error("Faltan variables de entorno RECAPTCHA_SECRET_KEY o BREVO_API_KEY.");
    return new Response(
      JSON.stringify({ success: false, message: "Configuración del servidor incompleta." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Datos inválidos." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = typeof payload["g-recaptcha-response"] === "string" ? payload["g-recaptcha-response"] : "";
  if (!token) {
    return new Response(JSON.stringify({ success: false, message: "Token reCAPTCHA faltante." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ 
        secret: recaptchaSecret, 
        response: token,
        remoteip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
      }).toString(),
    });

    const verification = (await recaptchaResponse.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!verification.success) {
      console.warn("reCAPTCHA no válido:", verification);
      return new Response(JSON.stringify({ success: false, message: "No pudimos validar el reCAPTCHA." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Fallo al verificar reCAPTCHA:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error al validar reCAPTCHA. Intenta nuevamente." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const data = normalizePayload(payload);
  
  // Determinar qué campos son requeridos según el tipo de formulario
  const requiredFields = data.formType === "consignacion" 
    ? CONSIGNMENT_REQUIRED_FIELDS 
    : CONTACT_REQUIRED_FIELDS;

  for (const field of requiredFields) {
    const value = data[field];
    if (!value) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `El campo ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} es obligatorio.` 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  if (!isValidEmail(data.email)) {
    return new Response(JSON.stringify({ success: false, message: "El correo ingresado no es válido." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resend = new Resend(resendApiKey);
  const subject =
    data.formType === "consignacion"
      ? "Nueva solicitud de consignación - Automotive Consulting"
      : "Nuevo mensaje de contacto - Automotive Consulting";

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: RECIPIENTS,
      subject,
      html: buildHtml(data),
      replyTo: data.email,
    });

    if ("error" in result && result.error) {
      throw new Error(result.error.message ?? "Error desconocido al enviar correo.");
    }
  } catch (error) {
    console.error("Error enviando correo:", error);
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message ?? "No se pudo enviar el correo."
        : "No se pudo enviar el correo.";

    return new Response(JSON.stringify({ success: false, message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
