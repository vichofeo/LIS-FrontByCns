# 🏥 Sistema Salud

> Monorepo Angular con múltiples librerías de dominio — construido con [Angular CLI](https://angular.dev) v20 y arquitectura multi-proyecto.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Scripts Disponibles](#-scripts-disponibles)
- [Librerías del Proyecto](#-librerías-del-proyecto)
- [Alias de Importación](#-alias-de-importación)
- [Convenciones de Código](#-convenciones-de-código)
- [Contribución](#-contribución)

---

## 📖 Descripción

**Sistema Salud** es una aplicación Angular organizada como monorepo multi-proyecto. La aplicación principal (`sistema-salud`) consume librerías de dominio independientes, cada una encargada de un área funcional del sistema: autenticación, citas médicas, farmacia, laboratorio, usuarios y vigencia.

---

## 🛠 Tecnologías

| Herramienta | Versión |
|---|---|
| [Angular](https://angular.dev) | `^20.3.0` |
| [TypeScript](https://www.typescriptlang.org/) | `~5.9.2` |
| [PrimeNG](https://primeng.org) | `^20.4.0` |
| [PrimeFlex](https://primeflex.org) | `^4.0.0` |
| [Font Awesome](https://fontawesome.com) | `^7.2.0` |
| [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) | `^20.0.2` |
| [SweetAlert2](https://sweetalert2.github.io) | `^11.x` |
| [Quill](https://quilljs.com) | `^2.0.3` |
| [pdfmake](http://pdfmake.org) | `^0.3.10` |

---

## 📁 Estructura del Proyecto

```
sistema-salud/
│
├── src/                                # Aplicación principal
│   ├── app/
│   │   └── main/                       # Módulos y rutas principales
│   ├── assets/                         # Recursos estáticos
│   ├── environments/
│   │   ├── environment.ts              # Configuración desarrollo
│   │   └── environment.prod.ts         # Configuración producción
│   ├── styles.scss                     # Estilos globales
│   └── main.ts                         # Punto de entrada
│
├── projects/                           # Librerías de dominio
│   ├── auth/                           # 🔐 Autenticación y autorización
│   │   └── src/
│   │       └── public-api.ts
│   │
│   ├── cita-medica/                    # 📅 Gestión de citas médicas
│   │   └── src/
│   │       └── public-api.ts
│   │
│   ├── farmacia/                       # 💊 Módulo de farmacia
│   │   └── src/
│   │       └── public-api.ts
│   │
│   ├── laboratorio/                    # 🔬 Módulo de laboratorio
│   │   └── src/
│   │       └── public-api.ts
│   │
│   ├── usuario/                        # 👤 Gestión de usuarios
│   │   └── src/
│   │       └── public-api.ts
│   │
│   ├── vigencia/                       # 📆 Control de vigencias
│   │   └── src/
│   │       └── public-api.ts
│   │
│   └── shared/                         # 🔧 Componentes y utilidades compartidas
│       └── src/
│           └── public-api.ts
│
├── angular.json                        # Configuración Angular CLI
├── tsconfig.json                       # Configuración TypeScript raíz
├── tsconfig.app.json                   # TS config aplicación principal
├── package.json
└── README.md
```

---

## ✅ Requisitos Previos

- **Node.js** `>= 18.x` → [Descargar](https://nodejs.org)
- **Angular CLI** `^20.x`:

```bash
npm install -g @angular/cli
```

---

## 📦 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/sistema-salud.git
cd sistema-salud

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

---

## 🧩 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start
# equivalente a: ng serve

# Compilar para producción
npm run build

# Compilar en modo watch (desarrollo)
npm run watch

# Ejecutar tests unitarios
npm test

# Formatear código con Prettier
npm run format

# Lint del código
npm run lint

# Lint con corrección automática
npm run lint:fix
```

---

## 📚 Librerías del Proyecto

Cada librería vive en `projects/` y se publica a través de su `public-api.ts`.

| Librería | Ruta | Descripción |
|---|---|---|
| `auth` | `projects/auth/` | Autenticación, guards y OAuth2/OIDC |
| `cita-medica` | `projects/cita-medica/` | Agendamiento y gestión de citas |
| `farmacia` | `projects/farmacia/` | Dispensación y gestión de medicamentos |
| `laboratorio` | `projects/laboratorio/` | Órdenes y resultados de laboratorio |
| `usuario` | `projects/usuario/` | Perfiles y gestión de usuarios |
| `vigencia` | `projects/vigencia/` | Control de vigencias y fechas |
| `shared` | `projects/shared/` | Componentes, pipes y servicios compartidos |

### Compilar una librería

```bash
# Compilar en modo desarrollo
ng build cita-medica --configuration development

# Compilar para producción
ng build cita-medica
```

---

## 🔗 Alias de Importación

El `tsconfig.json` define alias para importar las librerías y entornos de forma limpia:

```typescript
// Librerías de dominio
import { AuthService } from 'auth';
import { CitaComponent } from 'cita-medica';
import { FarmaciaModule } from 'farmacia';
import { LaboratorioService } from 'laboratorio';
import { UsuarioModel } from 'usuario';
import { VigenciaService } from 'vigencia';
import { SharedModule } from 'shared';

// Entornos
import { environment } from '@env/environment';

// Módulos internos de la app
import { SomeService } from '@main/services/some.service';
```

---

## 🌍 Entornos

| Archivo | Uso |
|---|---|
| `src/environments/environment.ts` | Desarrollo local |
| `src/environments/environment.prod.ts` | Build de producción |

El reemplazo se hace automáticamente según la configuración de Angular CLI al ejecutar `ng build --configuration production`.

---

## 📐 Convenciones de Código

### Orden de miembros en un componente

Todo componente debe declarar sus miembros en el siguiente orden. Esto mantiene la consistencia y facilita la lectura del código en todo el equipo.

```typescript
export class MiComponente {

  // ─── 1. Propiedades públicas ───────────────────────────────────────────────
  titulo = '';
  user = signal<UserClaims | null>(null);

  // ─── 2. Propiedades protegidas ─────────────────────────────────────────────
  protected data: unknown;

  // ─── 3. Propiedades privadas ───────────────────────────────────────────────
  private readonly authService = inject(AuthService);

  // ─── 4. Constructor ────────────────────────────────────────────────────────
  constructor() {}

  // ─── 5. Getters y Setters ──────────────────────────────────────────────────
  get restanteMinutos(): number {
    return 0;
  }

  set restanteMinutos(value: number) {
    // ...
  }

  // ─── 6. Métodos públicos (incluye lifecycle hooks) ─────────────────────────
  ngOnInit(): void {}

  getUser(): void {}

  // ─── 7. Métodos protegidos ─────────────────────────────────────────────────
  protected procesarDatos(): void {}

  // ─── 8. Métodos privados ───────────────────────────────────────────────────
  private cargarDatos(): void {}
}
```

### Resumen del orden

| # | Tipo | Acceso |
|---|---|---|
| 1 | Propiedades | `public` |
| 2 | Propiedades | `protected` |
| 3 | Propiedades | `private` / `private readonly` |
| 4 | Constructor | — |
| 5 | Getters y Setters | cualquiera |
| 6 | Métodos (lifecycle hooks primero) | `public` |
| 7 | Métodos | `protected` |
| 8 | Métodos | `private` |

> **Nota:** Los lifecycle hooks de Angular (`ngOnInit`, `ngOnDestroy`, `ngOnChanges`, etc.) se colocan al inicio de los métodos públicos (sección 6), antes de los métodos de negocio.

---

## 🤝 Contribución

1. Crea una rama: `git checkout -b feature/nombre-feature`
2. Aplica tus cambios y formatea: `npm run format`
3. Verifica lint: `npm run lint`
4. Commit: `git commit -m 'feat: descripción del cambio'`
5. Push y abre un Pull Request

---

## 📄 Licencia

Uso privado — todos los derechos reservados.
