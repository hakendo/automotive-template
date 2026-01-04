/**
 * Script de prueba para el endpoint de contacto
 * 
 * Uso:
 * 1. Asegúrate de que el servidor esté corriendo: npm run dev
 * 2. Ejecuta este script: node test-contact-api.js
 */

const testEndpoint = async () => {
  const url = 'http://localhost:4321/api/contact';
  
  const testData = {
    name: "Juan Pérez",
    email: "test@ejemplo.com",
    phone: "+56 9 1234 5678",
    message: "Este es un mensaje de prueba para verificar que el endpoint funciona correctamente."
  };

  console.log('🧪 Probando endpoint de contacto...\n');
  console.log('📤 Enviando datos:', testData);
  console.log('📍 URL:', url);
  console.log('');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('📊 Estado HTTP:', response.status);
    console.log('📋 Respuesta:', JSON.stringify(result, null, 2));
    console.log('');

    if (response.ok && result.success) {
      console.log('✅ ¡Prueba exitosa! El endpoint funciona correctamente.');
      console.log('📧 Verifica que los correos hayan llegado:');
      console.log('   - Al equipo: roco.solange@automotiveconsulting.cl');
      console.log('   - Copia oculta: contacto@venpu.cl');
      console.log('   - Confirmación: test@ejemplo.com');
    } else {
      console.log('❌ Error en la respuesta:', result.message);
    }
  } catch (error) {
    console.error('❌ Error al conectar con el servidor:', error.message);
    console.log('');
    console.log('💡 Asegúrate de que:');
    console.log('   1. El servidor esté corriendo (npm run dev)');
    console.log('   2. El servidor esté en http://localhost:4321');
    console.log('   3. La variable BREVO_API_KEY esté configurada en .env');
  }
};

// Ejecutar la prueba
testEndpoint();
