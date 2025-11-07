# Flevo - Programa de Lealtad

Aplicación web de programa de lealtad desarrollada con React y Tailwind CSS.

## Tecnologías

- **React** 18.2.0
- **React Router DOM** 6.8.0
- **Tailwind CSS** 3.3.0
- **Axios** para comunicación con API

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

2. Configura las variables en `.env`:
```
REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_USER_TYPE_HASH=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

## Ejecución

```bash
npm start
```

La aplicación se ejecutará en http://localhost:3000

## Estructura del Proyecto

```
src/
├── features/
│   └── auth/           # Módulo de autenticación
├── pages/              # Páginas principales
├── shared/
│   ├── components/     # Componentes reutilizables
│   ├── hooks/          # Hooks personalizados
│   └── utils/          # Utilidades
├── assets/             # Recursos estáticos
└── App.js              # Componente principal
```

## Funcionalidades

- **Autenticación**: Login, registro, verificación OTP
- **Recuperación de contraseña**: Flujo completo con OTP
- **Interfaz moderna**: Diseño responsive con Tailwind CSS
- **Validación de formularios**: Email, teléfono y contraseñas
- **Manejo de errores**: ErrorBoundary y validaciones

## Scripts Disponibles

- `npm start` - Ejecuta la aplicación en modo desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas

## API Backend

Asegúrate de que el backend esté ejecutándose en http://127.0.0.1:8000

## Navegadores Soportados

- Chrome (última versión)
- Firefox (última versión)
- Safari (última versión)
- Edge (última versión)