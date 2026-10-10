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

React 19, Vite 8, Tailwind 4. Interfaz en español, importes USD con formato `es-MX`. Los valores enumerados de la API permanecen en inglés y se traducen únicamente al mostrarlos.

API predeterminada: `http://localhost:4000/api`; `VITE_API_URL` permite cambiarla. La sesión usa sessionStorage, se elimina al cerrar sesión y vence después de ocho horas.

## Verificación

```sh
pnpm test
pnpm build
pnpm lint
```

Las fotografías externas y las fuentes necesitan internet. Las cargas fallidas conservan el registro para reintentar. Las imágenes son públicas; no cargues contenido confidencial.

## Reversión

Los temas y la localización son una unidad de presentación reversible mediante sus componentes, utilidades y estilos, sin modificar modelos ni identificadores de API. No se crearon commits ni PR.
