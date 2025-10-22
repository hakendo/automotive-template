import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resendApiKey = import.meta.env.RESEND_API_KEY;
const hcaptchaSecretKey = import.meta.env.HCAPTCHA_SECRET_KEY;
const recipientEmail = 'roco.solange@automotiveconsulting.cl';
const ccEmail = 'maravena@eserp.cl';

if (!resendApiKey) console.error("FATAL: Variable RESEND_API_KEY no configurada.");
if (!hcaptchaSecretKey) console.error("FATAL: Variable HCAPTCHA_SECRET_KEY no configurada.");

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function isValidEmail(email: string | null | undefined): email is string {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  console.log("API Endpoint /api/send-email alcanzado.");

  if (!resend || !hcaptchaSecretKey) {
      console.error("Error: Falta configuración de Resend o hCaptcha en el servidor.");
      return new Response(JSON.stringify({ success: false, message: 'Error de configuración del servidor.' }), { status: 500, headers: { "Content-Type": "application/json" }});
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const emailValue = formData.get('email');
    const phone = formData.get('phone') as string | null;
    const message = formData.get('message') as string;
    const hcaptchaToken = formData.get('h-captcha-response') as string;

    console.log("Valores leídos:", { name, emailValue, phone, message, hcaptchaToken });

    // --- Verificación de hCaptcha ---
    if (!hcaptchaToken) {
        console.log("Error: Token hCaptcha faltante.");
        return new Response(JSON.stringify({ success: false, message: 'Verificación CAPTCHA es requerida.' }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    // ...(Código de verificación hCaptcha)...
    const verifyParams = new URLSearchParams();
    verifyParams.append('secret', hcaptchaSecretKey);
    verifyParams.append('response', hcaptchaToken);
    const hcaptchaVerifyUrl = 'https://api.hcaptcha.com/siteverify';
    let hcaptchaData: { success: boolean; 'error-codes'?: string[] };
    try {
        const hcaptchaResponse = await fetch(hcaptchaVerifyUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: verifyParams.toString() });
        if (!hcaptchaResponse.ok) throw new Error(`Error del servidor hCaptcha: ${hcaptchaResponse.statusText}`);
        hcaptchaData = await hcaptchaResponse.json();
        console.log("Respuesta de hCaptcha:", hcaptchaData);
    } catch (fetchError) {
        console.error('Error al contactar servidor hCaptcha:', fetchError);
        return new Response(JSON.stringify({ success: false, message: 'No se pudo verificar el CAPTCHA.' }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    if (!hcaptchaData.success) {
      console.error('Fallo en la verificación de hCaptcha:', hcaptchaData['error-codes']);
      const errorMsg = hcaptchaData['error-codes']?.includes('invalid-input-response') ? 'Verificación CAPTCHA inválida o expirada.' : 'Fallo en la verificación CAPTCHA.';
      return new Response(JSON.stringify({ success: false, message: errorMsg }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    console.log("Verificación hCaptcha exitosa.");
    // --- Fin de Verificación ---

    // === Validaciones ===
    const email = (typeof emailValue === 'string' && emailValue.trim() !== '') ? emailValue.trim() : null;

    if (!name || !message) {
        console.error("Error: Nombre o Mensaje faltante.");
        return new Response(JSON.stringify({ success: false, message: 'Nombre y Mensaje son requeridos.' }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
     if (!email || !isValidEmail(email)) { // Usar la función isValidEmail
        console.error("Error: Email faltante o inválido:", email);
         return new Response(JSON.stringify({ success: false, message: 'Correo electrónico inválido o faltante.' }), { status: 400, headers: { "Content-Type": "application/json" } });
     }
    // === Fin Validaciones ===


    // Construye el contenido del correo
    const emailSubject = `Nuevo Contacto Web - Automotive Consulting`;
    let htmlContent = `<h1>Nuevo mensaje de contacto sitio web</h1><p><strong>Nombre:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}<hr><p><strong>Mensaje:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`;

    // --- CORRECCIÓN AQUÍ ---
    // Envía el correo usando Resend, con reply_to dentro de headers
    console.log("Intentando enviar correo...");
    const { data: emailData, error: sendError } = await resend.emails.send({
      from: "Web Automotive Consulting <onboarding@resend.dev>",
      to: [recipientEmail],
      cc: [ccEmail],
      subject: emailSubject,
      html: htmlContent,
      headers: { // <-- reply_to va dentro de headers
        'Reply-To': email
      }
    });
    // --- FIN CORRECCIÓN ---


    if (sendError) {
       console.error("Resend Error:", sendError);
       const resendErrorMessage = (sendError as any)?.message || "Hubo un problema al enviar tu mensaje.";
       return new Response(JSON.stringify({ success: false, message: resendErrorMessage }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    console.log('Correo enviado con éxito, ID:', emailData?.id);
    return new Response(JSON.stringify({ success: true, message: 'Mensaje enviado con éxito.' }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
     console.error("Error general en API Route:", error);
     return new Response(JSON.stringify({ success: false, message: "Ocurrió un error inesperado en el servidor." }), {
         status: 500,
         headers: { "Content-Type": "application/json" },
     });
  }
};