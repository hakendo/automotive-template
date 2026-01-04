# 🧪 Guía de Pruebas - Formulario de Contacto con Brevo

## 📋 Pasos para Probar el Formulario

### 1. **Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto (si no existe):

```env
BREVO_API_KEY="tu_api_key_de_brevo_aqui"
```

**Para obtener tu API Key de Brevo:**
1. Ve a [Brevo Dashboard](https://app.brevo.com/)
2. Inicia sesión o crea una cuenta
3. Ve a **Settings** → **SMTP & API** → **API Keys**
4. Crea una nueva API Key o copia una existente
5. Pégala en tu archivo `.env`

### 2. **Verificar que el Servidor Funcione**

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
npm run dev
```

Deberías ver algo como:
```
  ➜  Local:   http://localhost:4321/
  ➜  Network: use --host to expose
```

### 3. **Abrir el Formulario de Contacto**

1. Abre tu navegador y ve a: `http://localhost:4321/contacto`
2. Verifica que el formulario se muestre correctamente
3. Deberías ver los campos:
   - Nombre completo
   - Teléfono
   - Correo electrónico
   - Mensaje

### 4. **Probar Validaciones del Formulario**

#### Prueba 1: Campos Vacíos
- Deja todos los campos vacíos
- Haz clic en "Enviar mensaje"
- **Esperado:** Deberías ver mensajes de error indicando que los campos son obligatorios

#### Prueba 2: Email Inválido
- Completa todos los campos pero usa un email inválido (ej: "test@")
- Haz clic en "Enviar mensaje"
- **Esperado:** Deberías ver un mensaje de error indicando que el email no es válido

#### Prueba 3: Teléfono Inválido
- Completa todos los campos pero usa un teléfono inválido (ej: "123")
- Haz clic en "Enviar mensaje"
- **Esperado:** Deberías ver un mensaje de error indicando que el teléfono no es válido

### 5. **Probar Envío Exitoso**

Completa el formulario con datos válidos:

```
Nombre: Juan Pérez
Teléfono: +56 9 1234 5678
Email: tu-email-de-prueba@ejemplo.com
Mensaje: Este es un mensaje de prueba para verificar que el formulario funciona correctamente.
```

**Qué verificar:**

1. **En el navegador:**
   - Deberías ver un mensaje verde: "¡Mensaje enviado exitosamente! Revisa tu correo para la confirmación. Te responderemos pronto."
   - El botón debería cambiar a "Enviando..." mientras se procesa
   - Después de 3 segundos, deberías ser redirigido a `/gracias`

2. **En la consola del navegador (F12):**
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña "Console"
   - Deberías ver logs como:
     ```
     Enviando formulario a API: {name: "...", email: "...", phone: "...", message: "..."}
     Formulario enviado exitosamente: {success: true, message: "..."}
     ```

3. **En la consola del servidor (terminal):**
   - No deberías ver errores
   - Si hay errores, aparecerán aquí con detalles

### 6. **Verificar Correos Enviados**

#### Correo al Equipo
- Revisa la bandeja de entrada de: `roco.solange@automotiveconsulting.cl`
- También revisa la bandeja de entrada de: `contacto@venpu.cl` (copia oculta)
- **Esperado:** Deberías recibir un correo con:
  - Asunto: "Nuevo mensaje de contacto - [Nombre]"
  - Contenido HTML con los datos del formulario
  - Reply-To configurado con el email del usuario

#### Correo de Confirmación al Usuario
- Revisa la bandeja de entrada del email que usaste en el formulario
- **Esperado:** Deberías recibir un correo con:
  - Asunto: "Confirmación de contacto - Automotive Consulting"
  - Resumen de tu mensaje
  - Información de contacto de la empresa

### 7. **Probar Manejo de Errores**

#### Simular Error de API Key
1. Temporalmente cambia `BREVO_API_KEY` en `.env` a un valor inválido
2. Reinicia el servidor (`Ctrl+C` y luego `npm run dev`)
3. Intenta enviar el formulario
4. **Esperado:** Deberías ver un mensaje de error en el formulario

#### Simular Error de Red
1. Desconecta tu internet
2. Intenta enviar el formulario
3. **Esperado:** Deberías ver un mensaje de error indicando que no se pudo enviar

### 8. **Verificar en Producción (Vercel)**

Si ya tienes el proyecto desplegado en Vercel:

1. **Configurar Variable de Entorno en Vercel:**
   - Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
   - Ve a **Settings** → **Environment Variables**
   - Agrega: `BREVO_API_KEY` con tu API key de Brevo
   - Selecciona los ambientes (Production, Preview, Development)
   - Guarda y redeploya

2. **Probar en Producción:**
   - Ve a tu sitio en producción
   - Navega a la página de contacto
   - Completa y envía el formulario
   - Verifica que los correos se envíen correctamente

## 🔍 Checklist de Verificación

- [ ] El servidor de desarrollo inicia sin errores
- [ ] El formulario se muestra correctamente
- [ ] Las validaciones funcionan (campos vacíos, email inválido, teléfono inválido)
- [ ] El formulario se envía correctamente con datos válidos
- [ ] Se muestra el mensaje de éxito
- [ ] Se redirige a la página de agradecimiento
- [ ] El correo al equipo llega a `roco.solange@automotiveconsulting.cl`
- [ ] El correo con copia oculta llega a `contacto@venpu.cl`
- [ ] El correo de confirmación llega al usuario
- [ ] Los correos tienen el formato HTML correcto
- [ ] El manejo de errores funciona correctamente

## 🐛 Solución de Problemas

### Error: "Configuración del servidor incompleta"
- **Causa:** Falta la variable `BREVO_API_KEY`
- **Solución:** Verifica que el archivo `.env` existe y tiene la variable configurada

### Error: "No se pudo enviar el correo"
- **Causa:** API Key inválida o problemas con Brevo
- **Solución:** 
  - Verifica que tu API Key sea correcta
  - Verifica que tu cuenta de Brevo esté activa
  - Revisa los logs del servidor para más detalles

### Los correos no llegan
- **Causa:** Puede ser spam o demora en el envío
- **Solución:**
  - Revisa la carpeta de spam
  - Espera unos minutos (a veces hay demora)
  - Verifica en el dashboard de Brevo que los correos se enviaron

### El formulario no se envía
- **Causa:** Error en el código JavaScript o en la API
- **Solución:**
  - Abre la consola del navegador (F12) y revisa errores
  - Revisa la consola del servidor para errores del backend
  - Verifica que el endpoint `/api/contact` esté accesible

## 📝 Notas Adicionales

- **Modo Desarrollo:** En desarrollo, los logs aparecerán en la consola del navegador
- **Rate Limiting:** Brevo tiene límites de envío según tu plan
- **Dominio Verificado:** Asegúrate de que el dominio `automotiveconsulting.cl` esté verificado en Brevo para evitar problemas de entrega
