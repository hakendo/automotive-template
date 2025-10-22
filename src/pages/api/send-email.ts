import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, message, carBrand, carModel, carYear, carMileage } = data;

    const isConsignment = carBrand && carModel;
    const subject = isConsignment 
      ? `(Consignación Web) Solicitud de ${name} - ${carBrand} ${carModel}`
      : `(Contacto Web) Nuevo mensaje de ${name}`;

    let htmlContent = `
      <h2>${isConsignment ? 'Nueva solicitud de Consignación' : 'Nuevo mensaje de Contacto'}</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono (WhatsApp):</strong> ${phone}</p>
    `;

    if (isConsignment) {
      htmlContent += `
        <h3>Datos del Vehículo</h3>
        <ul>
          <li><strong>Marca:</strong> ${carBrand}</li>
          <li><strong>Modelo:</strong> ${carModel}</li>
          <li><strong>Año:</strong> ${carYear}</li>
          <li><strong>Kilometraje:</strong> ${carMileage} km</li>
        </ul>
      `;
    }

    if (message) {
      htmlContent += `
        <p><strong>Mensaje Adicional:</strong></p>
        <p>${message}</p>
      `;
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "web@automotiveconsulting.cl",
      to: ["roco.solange@automotiveconsulting.cl", "salas.yovani@automotiveconsulting.cl"],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, data: emailData }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
};