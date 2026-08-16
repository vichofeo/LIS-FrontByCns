# Laboratorio

Librería de dominio del módulo de **laboratorio** del Sistema de Salud CNS. Implementa el **motor de formularios dinámicos server-driven** (migrado de Vue/Vuetify) y los subdominios del laboratorio.

El backend es un motor CRUD dinámico `.NET` (proyecto `servicio-back`) que entrega la estructura de cada formulario/grilla. El frontend solo consume `{ ok, data, message }` y renderiza componentes PrimeNG según el `typeCode` de cada campo.

## Estructura

```
projects/laboratorio/src/lib/
├── laboratorio.routing.ts        ← rutas raíz (lazy) hacia los subdominios
├── laboratorio.ts                ← componente stub "laboratorio works!"
├── shared/                       ← transversal / utilitario (exportado)
│   ├── laboratorio-config.ts     ← token LIS_API_BASE_URL
│   ├── mensajes.service.ts       ← toasts por código de mensaje
│   ├── laboratorio-logger.service.ts
│   ├── services/dynamic-api.service.ts
│   ├── models/dynamic-api.models.ts
│   ├── utils/dynamic-form-schema.util.ts
│   ├── messages/laboratorio-messages.ts
│   └── components/
│       ├── dynamic-form/         ← lab-dynamic-form + lab-dynamic-field
│       ├── table/                ← lab-table-check
│       ├── crud/                 ← lab-crud
│       └── tabstep/              ← lab-tab-step
├── pr/                           ← subdominio "pr" (2 páginas reales)
│   ├── pr.routing.ts
│   └── pages/ (servicios, cfg-areas)
├── parametrizacion/              ← subdominio vacío (routing [])
├── configuracion/                ← subdominio vacío
├── preanalitica/                 ← subdominio vacío
├── analitica/                    ← subdominio vacío
└── postanalitica/                ← subdominio vacío
```

## API pública

Todo lo que se consume desde fuera se exporta en `src/public-api.ts`:

- `laboratorioRoutes` (rutas raíz)
- `LIS_API_BASE_URL` (InjectionToken)
- `MensajesService`, `LaboratorioLogger`
- `DynamicApiService`
- Modelos: `DynamicResponse`, `DynamicAgrupadoResponse`, `DynamicEntityData`, `DynamicListItem`, `DynamicFormCampos`, `DynamicGroup`, etc.
- Componentes: `LabCrud`, `TabStep`, `DynamicForm`, `DynamicField`, `TableCheck`
- Tipos: `DynamicFormSchema`, `DynamicFieldConfig`, `FieldTypeCode`, `TableColumn`, `TableRow`, etc.

## Componentes

| Componente | Selector | Propósito |
|---|---|---|
| `LabCrud` | `<lab-crud>` | CRUD completo: grilla (`lab-table-check`) + popup con formulario (`lab-dynamic-form`). Inputs `modelo`, `dominio`, `tituloCentral`, `tituloPopup`, `lengthCols`. |
| `TabStep` | `<lab-tab-step>` | Wizard de modelos agrupados (`agrupado`) en modo tabs o stepper. Inputs `modelGroup`, `dominio`, `idxSelected`, `swStepper`, `lengthCols`. Outputs `saved`, `closed`. |
| `DynamicForm` | `<lab-dynamic-form>` | Renderiza un `DynamicFormSchema` en tarjetas; construye los `FormGroup`. |
| `DynamicField` | `<lab-dynamic-field>` | Resuelve `typeCode` → componente PrimeNG. |
| `TableCheck` | `<lab-table-check>` | Tabla con selección, búsqueda, orden y acciones. |

### Ejemplo

```typescript
import { Component } from '@angular/core'
import { LabCrud } from 'laboratorio'

@Component({
  selector: 'lab-servicios-page',
  standalone: true,
  imports: [LabCrud],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss',
})
export class Servicios {}
```

## Contrato backend (`DynamicApiService`)

Base: `${LIS_API_BASE_URL}dinamico/{dominio}/{modelo}`.

| Método | Verbo | Endpoint | Uso |
|---|---|---|---|
| `get(dominio, modelo, params?)` | GET | `/{dominio}/{modelo}?idx=` | grilla / formulario |
| `save(dominio, modelo, body)` | POST | `/{dominio}/{modelo}/save` | insertar / actualizar `{ idx?, ...datos }` |
| `cbox(dominio, modelo, values)` | POST | `/{dominio}/{modelo}/cbox` | combos dependientes |
| `agrupado(dominio, modelo)` | POST | `/{dominio}/{modelo}/agrupado` | modelos agrupados (wizard) |

> **No hay PUT/DELETE.** El backend no expone endpoints de eliminación: `lab-crud.onDelete()` solo muestra un toast de "no disponible".

## Configuración

La URL base se inyecta vía el token `LIS_API_BASE_URL` (no se importa `environment` dentro de la lib). La app lo provee en `src/app/app.config.ts`:

```typescript
import { LIS_API_BASE_URL } from 'laboratorio'
import { environment } from '@env/environment'

providers: [
  { provide: LIS_API_BASE_URL, useValue: environment.lisApi },
]
```

## Subdominios

Rutas resueltas hoy (bajo `/admin/laboratorio/`):

- `/pr/servicios` → `lab-crud`
- `/pr/cfg-areas` → `lab-tab-step`

Pendientes (routing `[]`): `parametrizacion`, `configuracion`, `preanalitica`, `analitica`, `postanalitica`.

## Documentación detallada

- `docs/laboratorio/dynamic-form.md` — contrato de formularios dinámicos, type codes y componentes.
- `docs/laboratorio/skills/SKILL.md` — migración del módulo `acrehab`.
- `docs/laboratorio/skills/SKILL-TabStep.md` — migración del patrón TabStep.

## Build

```bash
ng build laboratorio --configuration development
ng build laboratorio   # producción
```
