# Sistema de Autenticación y Roles con NestJS

Este proyecto es un sistema robusto de autenticación y gestión de roles desarrollado con NestJS, implementando las mejores prácticas de seguridad y arquitectura.

## Características Principales

- 🔐 Autenticación JWT
- 👥 Gestión de Roles y Permisos
- 🛡️ Protección de Rutas
- 📝 Documentación con Swagger
- 🐳 Contenedorización con Docker
- 🗄️ Base de datos PostgreSQL

## Requisitos Previos

- Node.js (versión recomendada: 18.x o superior)
- pnpm (gestor de paquetes)
- Docker y Docker Compose
- PostgreSQL (si se ejecuta localmente)

## Configuración del Entorno

1. Clona el repositorio:
```bash
git clone https://github.com/rody-huancas/auth-roles-nestjs
cd auth-roles-nestjs
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
Reemplaza el archivo .env.example por .env, y agrega tus credenciales


## Ejecución del Proyecto

### Usando Docker Compose

```bash
# Inicia la base de datos PostgreSQL
docker-compose up -d

# Inicia la aplicación en modo desarrollo
pnpm run start:dev
```

### Sin Docker

```bash
# Desarrollo
pnpm run start:dev

# Producción
pnpm run build
pnpm run start:prod
```

## Estructura del Proyecto

```
src/
├── auth/           # Módulo de autenticación
├── users/          # Módulo de usuarios
├── roles/          # Módulo de roles
├── common/         # Utilidades y decoradores comunes
└── config/         # Configuraciones de la aplicación
```

## API Endpoints

La documentación completa de la API está disponible en Swagger UI cuando la aplicación está en ejecución:
```
http://localhost:3000/api
```

## Scripts Disponibles

- `pnpm run start:dev`: Inicia el servidor en modo desarrollo
- `pnpm run build`: Compila el proyecto
- `pnpm run start:prod`: Inicia el servidor en modo producción
- `pnpm run test`: Ejecuta las pruebas unitarias
- `pnpm run test:e2e`: Ejecuta las pruebas end-to-end
- `pnpm run lint`: Ejecuta el linter
- `pnpm run format`: Formatea el código

## Tecnologías Utilizadas

- NestJS 11.x
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Passport.js
- Docker
- Swagger/OpenAPI

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

