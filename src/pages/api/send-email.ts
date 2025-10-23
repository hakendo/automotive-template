import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

// Variables de entorno
const resendApiKey = import.meta.env.RESEND_API_KEY;
const hcaptchaSecretKey = import.meta.env.HCAPTCHA_SECRET_KEY;
const recipientEmail = 'roco.solange@automotiveconsulting.cl';
const ccEmail = 'maravena@eserp.cl';

// Verificaciones de inicio
if (!resendApiKey) console.error("FATAL: Variable RESEND_API_KEY no configurada.");
if (!hcaptchaSecretKey) console.error("FATAL: Variable HCAPTCHA_SECRET_KEY no configurada.");

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Helper para validar email
function isValidEmail(email: string | null | undefined): email is string {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Endpoint POST
export const POST: APIRoute = async ({ request }) => {
  console.log("API Endpoint /api/send-email alcanzado (esperando JSON).");

  if (!resend || !hcaptchaSecretKey) {
      console.error("Error: Falta configuración de Resend o hCaptcha.");
      return new Response(JSON.stringify({ success: false, message: 'Error de configuración del servidor.' }), { status: 500, headers: { "Content-Type": "application/json" }});
  }

  try {
    // 1. Leer cuerpo como JSON (Método Wildcars)
    const data = await request.json();
    console.log("Datos JSON recibidos:", data);

    const { name, email, phone, message } = data;
    const hcaptchaToken = data['h-captcha-response']; // Token de hCaptcha desde JSON

    // 2. Verificación de hCaptcha
    if (!hcaptchaToken) {
        console.log("Error: Token hCaptcha faltante en JSON.");
        return new Response(JSON.stringify({ success: false, message: 'Verificación CAPTCHA es requerida.' }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    
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
    
    // 3. Validaciones de campos
    if (!name || typeof name !== 'string' || name.trim() === '' ||
        !message || typeof message !== 'string' || message.trim() === '') {
       console.error("Error: Nombre o Mensaje faltante/inválido en JSON.");
       return new Response(JSON.stringify({ success: false, message: 'Nombre y Mensaje son requeridos.' }), { status: 400, headers: { "Content-Type": "application/json" } });
   }
    if (!isValidEmail(email)) {
       console.error("Error: Email faltante o inválido en JSON:", email);
        return new Response(JSON.stringify({ success: false, message: 'Correo electrónico inválido o faltante.' }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // 4. Construir y enviar correo
    const emailSubject = `Nuevo Contacto Web - Automotive Consulting`;
    let htmlContent = `<h1>Nuevo mensaje de contacto sitio web</h1><p><strong>Nombre:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}<hr><p><strong>Mensaje:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`;

        console.log("Intentando enviar correo a:", recipientEmail);
        // El SDK de Resend puede devolver la respuesta directamente o lanzar excepción.
        let sendResult: any;
        try {
            sendResult = await resend.emails.send({
                from: "Web Automotive Consulting <onboarding@resend.dev>",
                to: [recipientEmail],
                cc: [ccEmail],
                subject: emailSubject,
                html: htmlContent,
                headers: { 'Reply-To': email }
            });
        } catch (err) {
            console.error("Resend SDK error:", err);
            const msg = (err as any)?.message || 'Hubo un problema al enviar tu mensaje.';
            return new Response(JSON.stringify({ success: false, message: msg }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        // Normalizar respuesta
        const emailId = sendResult?.id ?? (sendResult?.data?.id ?? null);
        console.log('Correo enviado con éxito, ID:', emailId);
    return new Response(JSON.stringify({ success: true, message: 'Mensaje enviado con éxito.' }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
     console.error("Error general en API Route:", error);
     const message = error instanceof SyntaxError ? "Error en el formato de los datos enviados." : "Ocurrió un error inesperado en el servidor.";
     return new Response(JSON.stringify({ success: false, message }), {
         status: error instanceof SyntaxError ? 400 : 500,
         headers: { "Content-Type": "application/json" },
     });
  }
};