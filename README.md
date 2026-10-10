# Aurelia Estates — CRM inmobiliario

CRM adaptable en español con landing fotográfica, espacio privado conectado a la API y temas claro y oscuro.

## Inicio

Usa Node.js 22.13+ y pnpm 11.10.0. Las dependencias se fijan en `pnpm-lock.yaml`.

Inicia el backend en `/Volumes/SSD/Desarrollo/Node/CRM-DEMO/Backend` con `pnpm seed` y `pnpm dev`. En este proyecto:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abre `http://localhost:5173`. El correo está precargado; ingresa manualmente la contraseña configurada en el backend. No hay contraseñas ni secretos de MongoDB en el cliente.

## Funcionalidades

- Resumen de portafolio, oportunidades, agenda y actividad.
- Contactos y propiedades con CRUD, búsqueda y filtros.
- Carga de imágenes, galería y eliminación.
- Oportunidades con etapas editables, tareas y perfil.
- Temas claro y oscuro accesibles desde landing, login y CRM; preferencia guardada en el navegador. En la primera visita se respeta el sistema.

## Estructura

`src/pages`: pantallas; `src/components`: interfaz reutilizable; `src/hooks`: carga de datos; `src/services`: API; `src/utils`: formato español, etiquetas y preferencia de tema; `src/css`: estilos adaptables y tokens semánticos de tema.

React 19, Vite 8, Tailwind 4. Interfaz en español, importes MXN con formato `es-MX` y código de moneda explícito. El frontend conserva los valores numéricos sin conversión de divisas. Los valores enumerados de la API permanecen en inglés y se traducen únicamente al mostrarlos.

API de desarrollo: `http://localhost:4000/api`. El build de producción usa Railway; `VITE_API_URL` permite cambiarla. La sesión usa sessionStorage, se elimina al cerrar sesión y vence después de ocho horas.

## Producción en Vercel

URL: `https://crm-demo-frontend-ivory.vercel.app/`.

El archivo `.env.production` contiene únicamente la URL pública:

```sh
VITE_API_URL=https://crm-demo-backend-production-9526.up.railway.app/api
```

En Vercel usa este proyecto como directorio raíz, preset **Vite**, instalación `pnpm install --frozen-lockfile`, build `pnpm build` y salida `dist`. Si existe una variable `VITE_API_URL` en Vercel, actualízala al mismo valor: tiene prioridad sobre `.env.production`.

Redeploya después de cambiar la variable: Vite la integra al compilar, no en tiempo de ejecución. Nunca agregues `MONGODB_URI`, contraseñas ni `JWT_SECRET` a variables `VITE_*`. La API acepta su URL raíz o con `/api`, normaliza barras finales y agrega el prefijo una sola vez.

Railway debe permitir `FRONTEND_ORIGIN=https://crm-demo-frontend-ivory.vercel.app`. El desarrollo con `pnpm dev` permanece local. La navegación actual usa estado de React, no rutas de navegador; no requiere rewrites SPA adicionales.

## Compartir la demo

La landing pública incluye título y descripción en español, URL canónica, Open Graph, tarjeta de X/Twitter y datos estructurados que identifican el sitio como una **demo**, sin credenciales ni datos privados. La vista previa usa `public/og-image.png` (1200 × 630), con fuente editable en `public/og-image.svg`.

Favicons, icono de Apple y manifest con apertura en navegador complementan la identidad; no se agrega service worker ni se promete funcionamiento sin conexión. `robots.txt` y `sitemap.xml` publican únicamente la raíz: el espacio privado conserva la navegación interna y la autenticación existentes. Robots no reemplaza controles de acceso.

Después de redesplegar en Vercel, comparte `https://crm-demo-frontend-ivory.vercel.app/`. Comprueba que `/og-image.png` devuelve la imagen y que el HTML contiene las etiquetas antes de ejecutar JavaScript. Si cambias el dominio, actualiza las URLs de `index.html`, `public/robots.txt`, `public/sitemap.xml` y sus pruebas. Las plataformas de mensajería pueden conservar una vista previa anterior en caché; la actualización no siempre es inmediata.

## Verificación

```sh
pnpm test
pnpm build
pnpm lint
```

Las fotografías externas y las fuentes necesitan internet. Las cargas fallidas conservan el registro para reintentar. Las imágenes son públicas; no cargues contenido confidencial.

## Reversión

Los temas y la localización son una unidad de presentación reversible mediante sus componentes, utilidades y estilos, sin modificar modelos ni identificadores de API. No se crearon commits ni PR.

## Flujo comercial

La landing consulta la API pública y muestra únicamente propiedades disponibles que el asesor publicó explícitamente. Abre una ficha con `/?property=<id>` para ver fotos, copiar enlace, descargar PDF y solicitar información sin sesión. El formulario crea contacto y oportunidad en el servidor con consentimiento y control de reintentos.

En el CRM: **Contactos → Historial** registra notas/llamadas/visitas; **Tareas y agenda** permite vincular cliente, propiedad y oportunidad; **Seguimiento** abre tareas vencidas y oportunidades sin actividad por siete días. El resumen incluye tasa de cierre y comisiones estimadas en MXN. Los porcentajes son configurables por oportunidad; no representan cobros.

Los metadatos de compartir siguen siendo generales y estáticos, no específicos por inmueble. El PDF usa fotos locales cargadas; las fotos externas de muestra permanecen en la web. No hay integraciones de email, WhatsApp o calendario externo.

Después de redesplegar ambos proyectos, ejecuta la migración indicada en la documentación del backend o publica manualmente las propiedades. No se despliega automáticamente desde este cambio.
