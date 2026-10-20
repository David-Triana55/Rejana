# Prisma en el backend

Guía rápida para usar Prisma 7 + PostgreSQL en este proyecto.

## Estructura

```
backend/
├── prisma.config.ts          # Config de Prisma (URL de la BD, ruta de migraciones, comando del seed)
├── prisma/
│   ├── schema.prisma         # Modelos y enums de la base de datos
│   ├── seed.ts               # Datos iniciales
│   └── migrations/           # Historial de migraciones (se genera solo, va en git)
└── src/
    ├── generated/prisma/     # Cliente generado (NO va en git)
    └── prisma/
        ├── prisma.module.ts  # Módulo global de Nest
        └── prisma.service.ts # PrismaService inyectable
```

## Configuración inicial (una sola vez)

1. Levantar PostgreSQL desde la raíz del repo (necesita el `.env` de la raíz con `POSTGRES_*`):

   ```bash
   docker compose up -d
   ```

2. Crear `backend/.env` a partir de `backend/.env.example` y poner la misma contraseña:

   ```env
   DATABASE_URL="postgresql://rejana:TU_PASSWORD@localhost:5432/rejana_dev?schema=public"
   ```

3. Instalar dependencias y generar el cliente:

   ```bash
   npm install
   npm run prisma:generate
   ```

> El cliente generado (`src/generated`) no se sube a git. Hay que correr `prisma:generate` después de clonar
> el repo y cada vez que cambie `schema.prisma`. (`prisma:migrate` también lo regenera.)

## Comandos

| Script                    | Qué hace                                                        |
| ------------------------- | --------------------------------------------------------------- |
| `npm run prisma:generate` | Regenera el cliente TypeScript a partir de `schema.prisma`      |
| `npm run prisma:migrate`  | Crea y aplica una migración en desarrollo (`prisma migrate dev`) |
| `npm run prisma:deploy`   | Aplica migraciones pendientes sin crear nuevas (prod / CI)      |
| `npm run prisma:seed`     | Ejecuta `prisma/seed.ts`                                        |
| `npm run prisma:studio`   | Abre una UI web para ver y editar datos                         |

## Flujo de trabajo diario

### 1. Cambiar el modelo

Editar `prisma/schema.prisma`:

```prisma
enum UserRole {
  ADMIN
  USER
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Crear la migración

```bash
npm run prisma:migrate -- --name add_user_table
```

Esto genera una carpeta SQL en `prisma/migrations/`, la aplica a la BD y regenera el cliente.
**Subir la carpeta de migración a git.**

### 3. Usar el cliente en Nest

`PrismaModule` es global: no hace falta importarlo en cada módulo, solo inyectar `PrismaService`.

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: { email: string; password: string }) {
    return this.prisma.user.create({ data });
  }
}
```

Tipos y enums se importan del cliente generado:

```ts
import { UserRole, type User } from '../generated/prisma/client.js';
```

### 4. Seed

Escribir los datos iniciales en `prisma/seed.ts` (usar `upsert` para que sea re-ejecutable) y correr:

```bash
npm run prisma:seed
```

## Producción / CI

```bash
npm run prisma:generate
npm run prisma:deploy
```

Nunca usar `prisma migrate dev` ni `migrate reset` contra una base de producción.

## Comandos útiles extra

```bash
npx prisma migrate status     # Ver qué migraciones están aplicadas
npx prisma migrate reset      # BORRA la BD, reaplica migraciones y corre el seed (solo dev)
npx prisma db push            # Sincroniza schema sin crear migración (solo prototipos)
npx prisma format             # Formatea schema.prisma
npx prisma validate           # Valida schema.prisma
```

## Problemas comunes

- **`Cannot resolve environment variable: DATABASE_URL`**: falta `backend/.env`.
- **`Cannot find module '../generated/prisma/client.js'`**: falta correr `npm run prisma:generate`.
- **No conecta a la BD**: revisar `docker compose ps` y que usuario/contraseña de `DATABASE_URL` coincidan con el `.env` de la raíz.

## ¿Qué es `migrations/.gitkeep`?

Git solo guarda archivos, no carpetas vacías. `.gitkeep` es un archivo vacío cuyo único fin es que
`migrations/` exista en el repo antes de tener la primera migración. No es una función de git, solo una
convención (el nombre da igual). Cuando se cree la primera migración se puede borrar.
