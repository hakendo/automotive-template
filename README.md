# 🚗 Wildcars - Plataforma de Vehículos Premium

<div align="center">
  <img src="./public/logowildars.webp" alt="Wildcars Logo" width="300" height="auto">
  
  **Donde los buenos autos encuentran buenos dueños**
  
  [![Astro](https://img.shields.io/badge/Astro-5.11.0-red.svg?style=flat-square&logo=astro)](https://astro.build/)
  [![React](https://img.shields.io/badge/React-19.1.0-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
</div>

---

## 🌟 **Características Principales**

✨ **Catálogo Dinámico** - Navegación fluida con filtros avanzados  
🎨 **Diseño Responsivo** - Experiencia perfecta en todos los dispositivos  
🔍 **Búsqueda Inteligente** - Encuentra el vehículo perfecto rápidamente  
📱 **Mobile-First** - Optimizado para dispositivos móviles  
⚡ **Carga Ultrarrápida** - Powered by Astro SSR  
💌 **Sistema de Contacto** - Backend propio con envío por Brevo y confirmación automática  
🛡️ **Anti-Spam** - Protección con reCAPTCHA  
🎯 **SEO Optimizado** - Mejor posicionamiento en buscadores  
🤝 **Partner Confiable** - Más que una automotora, tu aliado automotriz

---

## 🛠️ **Stack Tecnológico**

### **Frontend**

- **[Astro 5.11.0](https://astro.build/)** - Framework SSR moderno y ultra-rápido
- **[React 19.1.0](https://reactjs.org/)** - Componentes interactivos
- **[TailwindCSS 4.1.11](https://tailwindcss.com/)** - Styling utility-first
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Swiper 11.2.10](https://swiperjs.com/)** - Carruseles y sliders interactivos

### **Backend & APIs**

- **[Brevo](https://www.brevo.com/)** - Envío de correos transaccionales
- **[Astro Node 9.3.0](https://docs.astro.build/en/guides/integrations-guide/node/)** - Servidor SSR

### **Herramientas**

- **[Astro Icon 1.1.5](https://github.com/natemoo-re/astro-icon)** - Iconografía optimizada
- **[Vite](https://vitejs.dev/)** - Build tool ultrarrápido

---

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**

- Node.js 18.0.0 o superior
- npm o yarn
- Git

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/sebahernandez/wildcars.git
cd wildcars
```

### **2. Instalar Dependencias**

```bash
npm install
```

### **3. Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# 💌 Envío de correos con Brevo
BREVO_API_KEY="tu_api_key_brevo"

# 🔑 Token de API (para datos de vehículos)
PUBLIC_TOKEN="tu_public_token_aqui"
```

### **4. Levantar el Servidor de Desarrollo**

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:4321` 🎉

---

## 📁 **Estructura del Proyecto**

```text
wildcars/
├── 📁 public/                    # Archivos estáticos
│   ├── favicon.svg
│   ├── logowildars.webp         # Logo principal de Wildcars
│   └── frontis-autoloa.webp
├── 📁 src/
│   ├── 📁 assets/               # Recursos (imágenes, iconos)
│   │   ├── astro.svg
│   │   ├── background.svg
│   │   └── brands/              # Logos de marcas
│   ├── 📁 components/           # Componentes reutilizables
│   │   ├── banner-brand/
│   │   ├── banner-stock/
│   │   ├── catalogo/
│   │   ├── featured-cars/
│   │   ├── footer/
│   │   ├── hamburger-menu/
│   │   ├── hero-slider/
│   │   ├── navbar/
│   │   ├── product-card/
│   │   ├── testimonials/
│   │   └── whatsapp-button/
│   ├── 📁 helpers/              # Funciones utilitarias
│   │   ├── formatHelpers.ts
│   │   └── stringHelpers.ts
│   ├── 📁 layouts/              # Layouts base
│   │   └── Layout.astro
│   ├── 📁 lib/                  # Servicios y APIs
│   │   └── fetchSliders.ts
│   ├── 📁 pages/                # Páginas del sitio
│   │   ├── index.astro          # Página principal
│   │   ├── nosotros.astro       # Sobre nosotros
│   │   ├── catalogo.astro       # Catálogo de vehículos
│   │   ├── contacto.astro       # Formulario de contacto
│   │   ├── 404.astro            # Página de error
│   │   └── [...name].astro      # Páginas dinámicas de vehículos
│   ├── 📁 styles/               # Estilos globales
│   │   └── global.css
│   └── 📁 types/                # Definiciones de tipos
│       └── vehicule.ts
├── 📄 astro.config.mjs          # Configuración de Astro
├── 📄 tailwind.config.js        # Configuración de TailwindCSS
├── 📄 tsconfig.json             # Configuración de TypeScript
└── 📄 package.json              # Dependencias del proyecto
```

---

## 🎯 **Comandos Principales**

| Comando               | Acción                                     |
| --------------------- | ------------------------------------------ |
| `npm install`         | 📦 Instala todas las dependencias          |
| `npm run dev`         | 🚀 Inicia servidor de desarrollo           |
| `npm run build`       | 🏗️ Construye la aplicación para producción |
| `npm run preview`     | 👀 Previsualiza la build localmente        |
| `npm run astro check` | 🔍 Verifica errores de TypeScript          |

---

## 🌍 **Variables de Entorno**

### **PUBLIC_RECAPTCHA_SITE_KEY**

- **Propósito**: Clave pública de reCAPTCHA v2 (casilla de verificación) usada en el navegador.
- **Obtener**: [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
- **Formato**: `6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **RECAPTCHA_SECRET_KEY**

- **Propósito**: Clave secreta usada por el backend para validar los tokens reCAPTCHA v2.
- **Obtener**: Misma propiedad en Google reCAPTCHA, pestaña Integración → “Clave secreta”.
- **Formato**: `6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **RESEND_API_KEY**

- **Propósito**: Envío de los correos de contacto desde el backend.
- **Obtener**: [Resend Dashboard](https://resend.com/api-keys)
- **Formato**: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **PUBLIC_TOKEN**

- **Propósito**: Autenticación para API de vehículos
- **Obtener**: Panel de administración del proveedor
- **Formato**: String alfanumérico

---

## 🎨 **Características del Diseño**

### **🎯 Páginas Principales**

- **Homepage** - Hero slider, vehículos destacados, testimonios
- **Nosotros** - Historia, valores, equipo
- **Catálogo** - Listado completo con filtros
- **Contacto** - Formulario con validación
- **404** - Página de error personalizada

### **📱 Componentes Interactivos**

- **Navbar Responsivo** - Menú hamburguesa en móvil
- **Hero Slider** - Carrusel de imágenes principales con transiciones suaves
- **Product Cards** - Tarjetas de vehículos con hover effects
- **Filtros Dinámicos** - Búsqueda por marca, modelo, precio
- **Whatsapp Button** - Contacto directo flotante
- **Testimoniales** - Reseñas de clientes satisfechos

### **🎨 Sistema de Diseño**

- **Colores**: Rojo corporativo (#dc2626) + Grises elegantes
- **Tipografía**: Inter font family para máxima legibilidad
- **Espaciado**: Sistema consistente basado en Tailwind
- **Iconografía**: SVG optimizados y escalables
- **Filosofía**: Diseño limpio que refleja confianza y profesionalismo

---

## 🚀 **Deployment**

### **Build para Producción**

```bash
npm run build
```

### **Previsualización Local**

```bash
npm run preview
```

### **Configuración Recomendada**

- **Vercel**: Configuración automática
- **Netlify**: Compatible out-of-the-box
- **Node.js**: Servidor SSR con adaptador incluido

---

## 🤝 **Contribución**

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 **Contacto**

- **Sitio Web**: [Wildcars](https://www.wildcars.cl)
- **Email**: contacto@wildcars.cl
- **Developer**: [@sebahernandez](https://github.com/sebahernandez)
- **Filosofía**: "Donde los buenos autos encuentran buenos dueños"

---

<div align="center">
  <p>⭐ ¡Si te gusta este proyecto, dale una estrella! ⭐</p>
  <p>Hecho con ❤️ por el equipo de Wildcars</p>
  <p><em>Más que una automotora, tu partner confiable en el mundo automotriz</em></p>
</div>
