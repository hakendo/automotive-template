import type { APIRoute } from "astro";
import * as brevo from "@getbrevo/brevo";

const brevoApiKey = import.meta.env.BREVO_API_KEY;
const FROM_EMAIL = "noreply@automotiveconsulting.cl";
const FROM_NAME = "Automotive Consulting";
const TO_EMAIL = "roco.solange@automotiveconsulting.cl";
const BCC_EMAIL = "contacto@venpu.cl";

const isValidEmail = (value: unknown): value is string =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizePayload = (payload: Record<string, unknown>) =>
  Object.entries(payload).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === "string") acc[key] = value.trim();
    return acc;
  }, {});

// Función para escapar HTML y prevenir XSS
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

const buildContactEmailHtml = (data: Record<string, string>) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0d9488; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: 600; color: #374151; margin-bottom: 5px; }
          .value { color: #1f2937; }
          .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Nuevo Mensaje de Contacto</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nombre:</div>
              <div class="value">${escapeHtml(data.name || "No proporcionado")}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${escapeHtml(data.email || "No proporcionado")}</div>
            </div>
            <div class="field">
              <div class="label">Teléfono:</div>
              <div class="value">${escapeHtml(data.phone || "No proporcionado")}</div>
            </div>
            <div class="field">
              <div class="label">Mensaje:</div>
              <div class="value" style="white-space: pre-wrap;">${escapeHtml(data.message || "No proporcionado")}</div>
            </div>
          </div>
          <div class="footer">
            <p>Este mensaje fue enviado desde el formulario de contacto de Automotive Consulting.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const buildConfirmationEmailHtml = (data: Record<string, string>) => {
  const firstName = data.name?.split(" ")[0] || "Estimado/a";
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0d9488; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; }
          .summary { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488; }
          .summary-item { margin-bottom: 10px; }
          .summary-label { font-weight: 600; color: #374151; }
          .summary-value { color: #1f2937; margin-top: 5px; }
          .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .contact-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">¡Gracias por contactarnos!</h1>
          </div>
          <div class="content">
            <p>Hola ${escapeHtml(firstName)},</p>
            
            <p>Hemos recibido tu mensaje correctamente. Nuestro equipo lo revisará y te contactará dentro de las próximas 24 horas hábiles.</p>
            
            <div class="summary">
              <h2 style="margin-top: 0; color: #0d9488;">Resumen de tu mensaje:</h2>
              <div class="summary-item">
                <div class="summary-label">Nombre:</div>
                <div class="summary-value">${escapeHtml(data.name || "No proporcionado")}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Email:</div>
                <div class="summary-value">${escapeHtml(data.email || "No proporcionado")}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Teléfono:</div>
                <div class="summary-value">${escapeHtml(data.phone || "No proporcionado")}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Mensaje:</div>
                <div class="summary-value" style="white-space: pre-wrap; margin-top: 10px;">${escapeHtml(data.message || "No proporcionado")}</div>
              </div>
            </div>
            
            <p>Si necesitas una respuesta urgente, puedes contactarnos directamente:</p>
            
            <div class="contact-info">
              <p><strong>Teléfono:</strong> <a href="tel:+56976225094" style="color: #0d9488;">+56 9 7622 5094</a></p>
              <p><strong>Email:</strong> <a href="mailto:roco.solange@automotiveconsulting.cl" style="color: #0d9488;">roco.solange@automotiveconsulting.cl</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/56976225094" style="color: #0d9488;">Chat inmediato</a></p>
            </div>
            
            <p style="margin-top: 30px;">Saludos cordiales,<br><strong>Equipo de Automotive Consulting</strong></p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas directamente a este mensaje.</p>
            <p>Si tienes alguna pregunta, utiliza los canales de contacto mencionados arriba.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const POST: APIRoute = async ({ request }) => {
  if (!brevoApiKey) {
    console.error("Falta la variable de entorno BREVO_API_KEY.");
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

  const data = normalizePayload(payload);

  // Validar campos requeridos
  const requiredFields = ["name", "email", "phone", "message"] as const;
  for (const field of requiredFields) {
    const value = data[field];
    if (!value) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `El campo ${field === "name" ? "nombre" : field === "phone" ? "teléfono" : field} es obligatorio.` 
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

  // Inicializar cliente de Brevo
  const apiInstance = new brevo.TransactionalEmailsApi();
  (apiInstance as any).authentications.apiKey.apiKey = brevoApiKey;

  try {
    // Enviar correo al equipo
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `Nuevo mensaje de contacto - ${escapeHtml(data.name)}`;
    sendSmtpEmail.htmlContent = buildContactEmailHtml(data);
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: TO_EMAIL }];
    sendSmtpEmail.bcc = [{ email: BCC_EMAIL }];
    sendSmtpEmail.replyTo = { email: data.email, name: data.name };

    const teamEmailResult = await apiInstance.sendTransacEmail(sendSmtpEmail);

    // Enviar correo de confirmación al usuario
    const confirmationEmail = new brevo.SendSmtpEmail();
    confirmationEmail.subject = "Confirmación de contacto - Automotive Consulting";
    confirmationEmail.htmlContent = buildConfirmationEmailHtml(data);
    confirmationEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    confirmationEmail.to = [{ email: data.email, name: data.name }];

    const confirmationEmailResult = await apiInstance.sendTransacEmail(confirmationEmail);

    // Verificar que ambos correos se enviaron correctamente
    if (!teamEmailResult || !confirmationEmailResult) {
      throw new Error("No se pudo enviar uno o ambos correos.");
    }

    return new Response(JSON.stringify({ success: true, message: "Correo enviado exitosamente." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error enviando correo con Brevo:", error);
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message ?? "No se pudo enviar el correo."
        : "No se pudo enviar el correo.";

    return new Response(JSON.stringify({ success: false, message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
