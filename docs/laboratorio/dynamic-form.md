# Dynamic Form - Laboratorio

Componentes de formularios dinámicos server-driven para el módulo de laboratorio.
Migrados del patrón `FrmModelElements.vue` (Vue + Vuetify) a Angular standalone + PrimeNG.

## Arquitectura

```
projects/laboratorio/src/lib/shared/components/dynamic-form/
├── index.ts                       ← barrel export
├── dynamic-form.models.ts         ← tipos: DynamicFieldConfig, DynamicFormSchema, FieldTypeCode
├── dynamic-field.component.ts     ← resuelve type code → componente PrimeNG
└── dynamic-form.component.ts      ← contenedor: construye FormGroup, itera secciones/campos
```

Dependencias:
- **PrimeNG 20.4** — componentes de UI (`p-select`, `p-datepicker`, `p-inputNumber`, etc.)
- **@angular/forms** — `FormBuilder`, `FormGroup`, `Validators`
- **DynamicApiService** — servicio HTTP para obtener/enviar el schema (`projects/laboratorio/src/lib/shared/services/dynamic-api.service.ts`)

## Schema JSON (backend → frontend)

El backend devuelve un objeto con esta estructura exacta (idéntica al proyecto Vue original):

```typescript
interface DynamicFormSchema {
  [sectionKey: string]: DynamicFormSection;
}

interface DynamicFormSection {
  label?: string;                          // Título de la sección
  linked?: string;                         // Modelo de referencia para CRUD
  model?: string;                          // Identificador backend
  campos: Record<string, DynamicFieldConfig>;  // Definición de campos
  valores: Record<string, unknown>;                 // Valores actuales
}

interface DynamicFieldConfig {
  label: string;                           // [0] Etiqueta del campo
  editable: boolean;                       // [1] true=editable, false=solo lectura
  required: boolean;                       // [2] true=requerido
  typeCode: FieldTypeCode;                 // [3] Código de tipo de campo
  maxLength?: number;                      // [4] Longitud máxima (texto)
  forcePlain?: boolean;                    // [5] Forzar texto plano (reservado)
  multiple?: boolean;                      // [6] 'M' → selección múltiple (checkboxes)
  rows?: number;                           // [6] filas del textarea (TA/TAR) cuando es numérico
  sinInicial?: boolean;                    // [7] sin opción inicial (-Todos-)
}
```

### Ejemplo real

```json
{
  "datos_personales": {
    "label": "Datos Personales",
    "campos": {
      "nombre": {
        "label": "Nombre del Paciente",
        "editable": true,
        "required": true,
        "typeCode": "TT",
        "maxLength": 80
      },
      "descripcion": {
        "label": "Descripción",
        "editable": true,
        "required": false,
        "typeCode": "TA",
        "maxLength": 512
      },
      "fid_area": {
        "label": "Área",
        "editable": true,
        "required": true,
        "typeCode": "C"
      }
    },
    "valores": {
      "nombre": null,
      "descripcion": null,
      "fid_area": {
        "selected": { "value": "uuid-123", "text": "Bacteriología" },
        "items": [
          { "value": "uuid-123", "text": "Bacteriología" },
          { "value": "uuid-456", "text": "Hematología" }
        ],
        "dependency": false
      }
    }
  }
}
```

> **Nota:** El proyecto también define `DynamicFormCampos` como tupla `[string, boolean, boolean, string, number?, unknown?, unknown?, unknown?]` en `dynamic-api.models.ts`, en el orden `[label, editable, required, typeCode, maxLength?, reservado, M|falseNull, sinInicial]`. La conversión de tupla/lista a `DynamicFormSchema` la hace `toDynamicFormSchema` (`shared/utils/dynamic-form-schema.util.ts`), usada por `lab-crud` y `lab-tab-step`. El índice `[6]` es dual: `'M'` → `multiple`, número → `rows` (textareas).

## Type Codes Soportados

| Código | Tipo | Componente PrimeNG | Comportamiento |
|--------|------|-------------------|----------------|
| `TT` | Texto | `<input pInputText>` | Texto plano de una línea |
| `TN` | Numérico entero | `<p-inputNumber>` | Solo enteros, `minFractionDigits=0` |
| `TD` | Decimal | `<p-inputNumber>` | Decimales, `minFractionDigits=2`, `min=0`, `max=999.9999` |
| `TM` | Email | `<input pInputText type="email">` | Validación de email con regex propia |
| `TP` | Texto plano (solo lectura) | `<input pInputText readonly>` | Idéntico a `forcePlain=true` |
| `TA` / `TAR` | TextArea | `<textarea pTextarea>` | Texto multilínea, filas desde `config.rows` (default 3) |
| `C` | ComboBox | `<p-select>` | Dropdown con búsqueda, items desde `valores[field].items` |
| `F` | Fecha | `<p-datepicker>` | Calendario, formato dd/mm/yy; `minDate=1930-01-01`, `maxDate=hoy` |
| `FT` | Fecha (mañana) | `<p-datepicker>` | `minDate=hoy−30 días` |
| `FC` | Fecha sin límite | `<p-datepicker>` | `minDate=1930-01-01` |
| `RH` | Radio Horizontal | `<p-radioButton>` | Radios en fila (`flex flex-wrap`) |
| `RV` | Radio Vertical | `<p-radioButton>` | Radios en columna (`flex flex-column`) |
| `HH` | Checkbox Horizontal | `<p-checkbox>` | Checkboxes en fila; con `multiple` el control es array |
| `HV` | Checkbox Vertical | `<p-checkbox>` | Checkboxes en columna; "Mostrar más/menos" (límite 7) |
| `SW` | Switch | `<p-toggleswitch>` | On/off; label muestra `{label}: {valor}` |
| `MS` | AutoSuggest | `<p-autoComplete>` | Búsqueda con sugerencias filtradas |
| `MH` | Chips (texto libre) | `<p-chip>` + input | Chips separados por coma; el control guarda string `a,b,c` |
| `FA` | Archivo | `<p-fileUpload mode="basic" [customUpload]>` | Subida → base64 (`data:`) + preview |
| `FI` | Imagen | `<p-fileUpload mode="basic" [customUpload] accept="image/*">` | Subida imagen → base64 + preview |
| `YT` | Texto pequeño | *(no se renderiza)* | Omitido del layout |
| `H` | Oculto | `<input hidden>` | Campo oculto (span 12 columnas) |

## Componentes

### `<lab-dynamic-form>`

Contenedor principal. Recibe el schema completo, construye los `FormGroup` y renderiza secciones en tarjetas.

**Inputs:**

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `schema` | `DynamicFormSchema` | — | Schema completo del formulario (requerido) |
| `lengthCols` | `number` | `3` | Columnas del grid (1-12) para campos visibles |
| `forEdit` | `boolean` | `false` | Modo edición (reservado para lógica futura) |

**Outputs:**

| Output | Tipo | Descripción |
|--------|------|-------------|
| `schemaChange` | `EventEmitter<DynamicFormSchema>` | Emite cuando el schema cambia (two-way binding) |

**Métodos públicos:**

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `getGroup(sectionKey)` | `FormGroup` | Obtiene el FormGroup de una sección |
| `getFormValues()` | `Record<string, Record<string, unknown>>` | Devuelve valores planos de todos los grupos |
| `validate()` | `boolean` | Marca los inválidos como tocados y devuelve si el formulario es válido |

### `<lab-dynamic-field>`

Renderiza un campo individual según su `typeCode`. No se usa directamente en páginas, solo desde `lab-dynamic-form`.

**Inputs:**

| Input | Tipo | Descripción |
|-------|------|-------------|
| `formGroup` | `FormGroup` | FormGroup padre del campo |
| `fieldName` | `string` | Nombre del campo (key en `campos`) |
| `config` | `DynamicFieldConfig` | Configuración del campo |
| `valores` | `Record<string, unknown>` | Valores actuales (para resolver combos y items) |
| `colSpan` | `number` | Columnas que ocupa en el grid |

## Grid (PrimeFlex CSS)

El layout usa **CSS Grid nativo** (no PrimeFlex) con 12 columnas:

```
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0.75rem;
}
.col-3 { grid-column: span 3; }  /* 4 campos por fila */
.col-4 { grid-column: span 4; }  /* 3 campos por fila */
.col-6 { grid-column: span 6; }  /* 2 campos por fila */
.col-12 { grid-column: span 12; } /* 1 campo por fila */
```

Los campos `typeCode: 'H'` usan siempre `col-12`.

## Uso desde una página

### 1. Importar el componente

`lab-dynamic-form` normalmente se consume a través de `lab-crud` o `lab-tab-step`, pero también puede usarse a bajo nivel:

```typescript
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core'
import { DynamicApiService, DynamicForm, DynamicFormSchema, MensajesService } from 'laboratorio'

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [DynamicForm],
  template: `
    <div class="p-3">
      @if (schema()) {
        <lab-dynamic-form #form [schema]="schema()!" [lengthCols]="3" />
      }
      <div class="flex justify-content-end gap-2 mt-3">
        <button pButton label="Guardar" (click)="guardar()"></button>
        <button pButton label="Cancelar" severity="secondary" (click)="cancelar()"></button>
      </div>
    </div>
  `,
})
export class MisDatosComponent implements OnInit {
  private api = inject(DynamicApiService)
  private msj = inject(MensajesService)

  @ViewChild('form') private form!: DynamicForm

  readonly schema = signal<DynamicFormSchema | null>(null)

  ngOnInit(): void {
    this.cargarFormulario()
  }

  private cargarFormulario(): void {
    this.api.get('parametrizacion', 'mi_modelo').subscribe({
      next: res => {
        if (res.ok) {
          const key = Object.keys(res.data)[0]
          // res.data[key].campos + res.data[key].valores → DynamicFormSchema
          this.schema.set(toDynamicFormSchema(res.data[key], 'mi_modelo'))
        }
      },
      error: () => this.msj.showError('LAB_ERR_1003'),
    })
  }

  guardar(): void {
    if (!this.form.validate()) return
    const body = this.form.getFormValues()['datos']
    this.api.save('parametrizacion', 'mi_modelo', body).subscribe({
      next: () => this.msj.showSuccess('LAB_OK_0002'),
      error: () => this.msj.showError('LAB_ERR_1001'),
    })
  }

  cancelar(): void {
    this.cargarFormulario()
  }
}
```

> El helper `toDynamicFormSchema` vive en `shared/utils/dynamic-form-schema.util.ts` y lo usan internamente `lab-crud` y `lab-tab-step`.

### 2. Registrar la ruta (en el routing de laboratorio o de la app)

```typescript
// projects/laboratorio/src/lib/parametrizacion/parametrizacion.routing.ts
import { Route } from '@angular/router'

export const routes: Route[] = [
  {
    path: 'mis-datos',
    loadComponent: () => import('./pages/mis-datos/mis-datos.component').then(m => m.MisDatosComponent),
  },
]
```

## Integración con DynamicApiService

El servicio `DynamicApiService` (`projects/laboratorio/src/lib/shared/services/dynamic-api.service.ts`) usa la URL base `${LIS_API_BASE_URL}dinamico` y expone:

```typescript
class DynamicApiService {
  // GET  {dominio}/{modelo}            → grilla / formulario (opcional ?idx=)
  get(dominio: string, modelo: string, params?: Record<string, string>): Observable<DynamicResponse>

  // POST {dominio}/{modelo}/save        → inserta / actualiza ({ idx?, ...datos })
  save(dominio: string, modelo: string, body: unknown): Observable<DynamicResponse>

  // POST {dominio}/{modelo}/cbox        → combos dependientes
  cbox(dominio: string, modelo: string, selectedValues: Record<string, unknown>): Observable<DynamicResponse>

  // POST {dominio}/{modelo}/agrupado    → modelos agrupados (wizard)
  agrupado(dominio: string, modelo: string): Observable<DynamicAgrupadoResponse>
}
```

> **No hay endpoints PUT/DELETE.** El backend expone `get/save/cbox/agrupado`; `lab-crud.onDelete()` solo muestra un toast de "no disponible".

El `DynamicResponse` tiene esta forma:

```typescript
interface DynamicResponse {
  ok: boolean
  data: Record<string, DynamicEntityData>  // contiene campos + valores
  message: string
}
```

La conversión de `DynamicEntityData` → `DynamicFormSchema` la hace `toDynamicFormSchema` (`shared/utils/dynamic-form-schema.util.ts`), usada por `lab-crud` y `lab-tab-step`.

## Notas Técnicas

1. **Zoneless Change Detection:** El proyecto usa `provideZonelessChangeDetection()`. Los componentes `DynamicField` y `DynamicForm` usan `FormGroup` + `formControlName` (ReactiveForms), que funciona correctamente con zoneless porque los eventos DOM gatillan change detection automáticamente.

2. **Standalone Components:** Ambos componentes son standalone (`standalone: true`) y declaran sus imports directamente. No requieren NgModule.

3. **Valores combos/selectores:** Los items para `typeCode: 'C'`, `'RH'`, `'RV'`, `'HH'`, `'HV'`, `'MS'` se resuelven desde `valores[fieldName].items`. Si el valor del combo está seleccionado, se encuentra en `valores[fieldName].selected`. `MH` NO usa items: es texto libre separado por coma. Los combos **en cascada** (dependientes entre sí) no viven en `dynamic-form`: se resuelven con el componente dedicado `<lab-cbox>` (ver sección "LabCbox" al final).

4. **Campos ocultos (`H`) y `YT`:** No se renderizan visualmente. `H` se renderiza como input oculto (span 12 columnas, `display:none`). `YT` se omite completamente.

5. **Validaciones:** Se aplican `Validators.required` y `Validators.maxLength` automáticamente según `DynamicFieldConfig.required` y `DynamicFieldConfig.maxLength`. `TM` añade una regex de email; `HH`/`HV` requeridos usan la regla "al menos una opción" (valida arrays).

6. **Versiones:** Angular 20.3, PrimeNG 20.4, PrimeFlex 4.x, TypeScript 5.9.

## Referencias

- Código original Vue: `vuetifyGenerico/src/components/inputs/FrmModelElements.vue`
- Modelos existentes: `projects/laboratorio/src/lib/shared/models/dynamic-api.models.ts`
- Servicio API: `projects/laboratorio/src/lib/shared/services/dynamic-api.service.ts`
- Servicio de mensajes: `projects/laboratorio/src/lib/shared/mensajes.service.ts`

---

# TableCheck - Laboratorio

Componente de tabla con selección vía checkboxes, migrado de `TableDataChecks.vue` (Vue + Vuetify).

```
projects/laboratorio/src/lib/shared/components/table/
├── index.ts                       ← barrel export
├── table-check.models.ts          ← tipos: TableColumn, TableCheckEvent
└── table-check.component.ts       ← componente tabla con selección
```

## `<lab-table-check>`

Tabla con soporte para selección múltiple/única, columnas dinámicas, búsqueda, paginación, eliminación y expansión de filas.

### Inputs

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `columns` | `TableColumn[]` | `[]` | Definición de columnas |
| `data` | `TableRow[]` | `[]` | Datos de la tabla (`TableRow = Record<string, unknown>`) |
| `color` | `string` | `'teal'` | Color del encabezado (`teal`, `blue`, `green`, `amber`, `orange`, `red`) |
| `itemsPerPage` | `number` | `5` | Filas por página |
| `singleSelect` | `boolean` | `true` | Modo selección única |
| `expandable` | `boolean` | `false` | Filas expandibles |
| `withDel` | `boolean` | `false` | Botón de eliminar por fila |
| `withEdit` | `boolean` | `false` | Botón de editar por fila |
| `maxHeight` | `number` | `500` | Altura máxima en píxeles |
| `showSelect` | `boolean` | `false` | Mostrar columna de selección |
| `dataKey` | `string` | `'idl'` | Campo identificador único |
| `caption` | `string` | `''` | Texto del caption de la tabla |
| `expandTemplate` | `TemplateRef<unknown> \| null` | `null` | Template para fila expandida |
| `globalFilterFields` | `string[]` | `[]` | Campos para el filtro global |

### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `selectionChange` | `TableRow \| TableRow[]` | Emite cuando cambia la selección |
| `editItem` | `TableRow` | Emite al hacer clic en editar |
| `deleteItem` | `TableRow` | Emite al hacer clic en eliminar |

### Interface `TableColumn`

```typescript
interface TableColumn {
  field: string       // Nombre del campo en los datos
  header: string      // Texto del encabezado
  sortable?: boolean  // Columna ordenable
  align?: 'left' | 'center' | 'right'
  width?: string      // Ancho CSS (ej. '120px')
  hidden?: boolean    // Oculta la columna
}
```

### Uso

```typescript
import { Component, inject } from '@angular/core'
import { DynamicApiService, DynamicListItem, TableCheck, TableColumn, TableRow } from 'laboratorio'

@Component({
  standalone: true,
  imports: [TableCheck],
  template: `
    <lab-table-check
      [columns]="cols"
      [data]="items"
      color="blue"
      [singleSelect]="false"
      [withDel]="true"
      (selectionChange)="onSelect($event)"
      (deleteItem)="onDelete($event)"
    />
  `
})
export class ListaResultadosComponent {
  private api = inject(DynamicApiService)

  cols: TableColumn[] = [
    { field: 'nombre', header: 'Nombre', sortable: true },
    { field: 'fecha', header: 'Fecha', sortable: true, align: 'center', width: '120px' },
    { field: 'estado', header: 'Estado', align: 'center' },
  ]
  items: TableRow[] = []

  ngOnInit() {
    this.api.get('analitica', 'resultados').subscribe(res => {
      if (res.ok) {
        const key = Object.keys(res.data)[0]
        this.items = res.data[key].valores as DynamicListItem[]
      }
    })
  }

  onSelect(sel: TableRow | TableRow[]) { console.log('Seleccionado:', sel) }
  onDelete(item: TableRow) { console.log('Eliminar:', item) }
}
```

### Equivalencia Vue → Angular

| Vue (TableDataChecks) | Angular (lab-table-check) |
|-----------------------|---------------------------|
| `:headers` | `[columns]` |
| `:items` | `[data]` |
| `opColor` | `[color]` |
| `v-model` (value) | `(selectionChange)` |
| `@delete-item` | `(deleteItem)` |
| `singleSelect` | `[singleSelect]` |
| `show-select` | `[showSelect]` |
| `expand` | `[expandable]` |
| `withDel` | `[withDel]` |
| `itemsPerPage` | `[itemsPerPage]` |
| `maxHeight` | `[maxHeight]` |
| Slots `xpnd` | `[expandTemplate]` |

---

# LabCrud - Laboratorio

Componente CRUD transversal que integra `lab-table-check` y `lab-dynamic-form` en un flujo completo de **altas, bajas y modificaciones**. Equivalente Angular del `ComponentABC.vue` de Vue.

```
projects/laboratorio/src/lib/shared/components/crud/
├── index.ts                       ← barrel export
└── lab-crud.component.ts          ← CRUD orchestrator
```

## `<lab-crud>`

Orquestador de operaciones CRUD: lista datos en tabla y permite crear/editar registros vía popup con formulario dinámico. La eliminación no está disponible (el backend no expone DELETE).

### Inputs

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `modelo` | `string` | — | Nombre del modelo backend (requerido) |
| `dominio` | `string` | — | Dominio/namespace del modelo (requerido) |
| `tituloCentral` | `string` | `'Datos'` | Título de la tarjeta principal |
| `tituloPopup` | `string` | `'Datos seleccionados'` | Título del popup de edición |
| `lengthCols` | `number` | `3` | Columnas del grid en el formulario (3 = 4 campos/fila) |

### Outputs

*(ninguno — el componente maneja toda la persistencia internamente)*

### Uso

```typescript
import { Component } from '@angular/core'
import { LabCrud } from 'laboratorio'

@Component({
  standalone: true,
  imports: [LabCrud],
  template: `<lab-crud modelo="serviciosn" dominio="areas" />`
})
export class MiPaginaComponent {}
```

### Flujo de operación

1. Al montarse, llama a `DynamicApiService.get(dominio, modelo)` para obtener la estructura de campos y la lista de registros.
2. Construye las columnas de la tabla a partir del schema (`campos` → `TableColumn[]`).
3. **Nuevo registro**: carga una plantilla vacía (`idx = '-1'`) y abre el popup con `lab-dynamic-form`.
4. **Editar**: al pulsar el botón de editar de una fila, carga el registro individual (`?idx=`) y abre el popup con el formulario precargado.
5. **Guardar**: recupera valores del formulario vía `getFormValues()` y envía `POST /save` (crear/actualizar según `idx`).
6. **Eliminar**: muestra un toast de "no disponible" (el backend no expone DELETE).
7. Las notificaciones toast se muestran con PrimeNG `MessageService` + `<p-toast>`.

### Ejemplo completo

```typescript
import { Component } from '@angular/core'
import { LabCrud } from 'laboratorio'

@Component({
  standalone: true,
  imports: [LabCrud],
  template: `
    <lab-crud
      modelo="serviciosn"
      dominio="areas"
      tituloCentral="Gestión de Áreas"
      tituloPopup="Editar Área"
      [lengthCols]="6"
    />
  `
})
export class AreasPageComponent {}
```

### Equivalencia Vue → Angular

| Vue (ComponentABC) | Angular (lab-crud) |
|--------------------|--------------------|
| `:modelo` | `[modelo]` |
| `:dominio` | `[dominio]` |
| `:tituloCentral` | `[tituloCentral]` |
| `:tituloPopup` | `[tituloPopup]` |
| `:lengthCols` | `[lengthCols]` |
| `ContenedorCard` | `<p-card>` |
| `TableDataEdit` | `<lab-table-check>` |
| `FrmModelElementsBasics` | `<lab-dynamic-form>` |
| `PopupFullWide` | `<p-dialog>` |
| `Loading` | `<p-progressSpinner>` |
| `bVirtualService` | `DynamicApiService` |
| `MensajeriaUtils` | `MessageService` (vía `<p-toast>`) |
| `getDataModelN(modelo)` → lista | `DynamicApiService.get(dominio, modelo)` |
| `getDataModel({ idx, model })` → registro | `DynamicApiService.get(dominio, modelo, { idx })` |
| POST/crear | `DynamicApiService.save(dominio, modelo, body)` |
| PUT/editar | `DynamicApiService.save(dominio, modelo, { idx, ...body })` |
| DELETE/eliminar | no soportado (toast "no disponible") |

### Notas

- El componente es **autocontenido**: tiene su propio `<p-toast>` para notificaciones.
- Requiere que `LIS_API_BASE_URL` esté provisto (la app lo configura en `app.config.ts` con `environment.lisApi`).
- El servicio solo expone `get/save/cbox/agrupado` (no hay PUT/DELETE).
- Las URL de los endpoints siguen el patrón: `/{dominio}/{modelo}` (GET) y `/{dominio}/{modelo}/save` (POST).
- Origen Vue: `vuetifyGenerico/src/views/pr/ComponentABC.vue`

---

# LabCbox - Laboratorio

Componente de **combos dependientes en cascada**, migrado de `ComboDepency.vue` / `FrmModelCboxDependency.vue` (Vue + Vuetify). Resuelve los combos vía el endpoint `cbox` del backend dinámico.

```
projects/laboratorio/src/lib/shared/components/combo-dependency/
├── index.ts          ← barrel export
├── lab-cbox.ts       ← componente (selector `lab-cbox`)
├── lab-cbox.html
└── lab-cbox.scss
```

## `<lab-cbox>`

### Inputs

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `dominio` | `string` | — | Dominio/namespace (requerido) |
| `modelo` | `string` | — | Modelo de combos dependientes (requerido) |
| `datosIn` | `Record<string, unknown>` | `{}` | Selección inicial (pre-filtro) |
| `limite` | `number` | `100` | Máximo de campos visibles |
| `colsWidth` | `number` | `6` | Columnas del grid (1-12) |
| `disabled` | `boolean` | `false` | Deshabilita todos los combos |

### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `cboxChange` | `Record<string, unknown>` | Valores seleccionados aplanados (`{ campo: valor }`) tras cada resolución |

### Contrato (endpoint `cbox`)

- **Request** `POST {LIS_API_BASE_URL}dinamico/{dominio}/{modelo}/cbox` con body = `{ campo: valorSeleccionado, ... }` (plano, solo los campos con valor). Fuente: `DinamicoController.GetCbox` en `servicio-back` (`[FromBody] Dictionary<string, object> selectedValues`).
- **Response** `{ ok, data: { campos, valores }, message }`:
  - `campos` = `{ campo: [label, editable, requerido, tipo, ...] }` (índice `[6] === 'M'` → combo múltiple).
  - `valores` = `{ campo: { selected: {value,text} | [{value,text}], items: [{value,text}] } }`.
  - Opcional `dataTable` / `headers` (combos primal con tabla).
- El backend re-resuelve los `items` de cada combo según los `selectedValues` enviados y devuelve la selección corregida.

### Uso

```typescript
import { Component } from '@angular/core'
import { LabCbox } from 'laboratorio'

@Component({
  standalone: true,
  imports: [LabCbox],
  template: `<lab-cbox dominio="areas" modelo="mi_cbox" (cboxChange)="onCbox($event)" />`,
})
export class MiPaginaComponent {
  onCbox(valores: Record<string, unknown>): void {
    console.log(valores) // { cod_dpto: '01', eg: 'uuid', institucion_id: 'uuid' }
  }
}
```

### Equivalencia Vue → Angular

| Vue (`FrmModelCboxDependency`) | Angular (`lab-cbox`) |
|---|---|
| `v-model` (item) | `(cboxChange)` |
| `:model` | `[modelo]` |
| `:datos-in` | `[datosIn]` |
| `:limite` | `[limite]` |
| `:cols-width` | `[colsWidth]` |
| `:disabled` | `[disabled]` |
| `hereditaryFunction(...)` | `(cboxChange)` |
| `getCboxDepData({ modelo, data })` | `DynamicApiService.cbox(dominio, modelo, selectedValues)` |
| `v-combobox` (simple/múltiple) | `p-select` / `p-multiSelect` |

### Notas

- Es autocontenido (tiene su propio `<p-toast>` + `MessageService`).
- Cada cambio de un combo dispara `cbox` con todos los valores seleccionados y re-renderiza los `items` (patrón Reactivo, sin suscripciones manuales: eventos + `firstValueFrom`).
- Pendiente (paridad total con Vue): la lógica de "TODOS" (`value === '-1'`) para combos múltiples (`verifyOptionMultiple`) y el manejo de `dataTable`/`headers`.

---

# Apariencia visual (Fase 3)

Mejoras visuales aplicadas con **SCSS local y `:host ::ng-deep`**, sin tocar el tema global (`src/assets/theme/`). Estilos en `dynamic-field.scss` y `lab-cbox.scss`.

## `.boxnuevo` (grupos radio/checkbox)

`RH` / `RV` / `HH` / `HV` se envuelven en un contenedor gris redondeado (paridad con el `.boxnuevo` de Vue):

```scss
.boxnuevo {
  background-color: rgb(243, 243, 243);
  min-height: 70px;
  padding: 0.75rem;
  border-radius: 15px;
}
```

El título del grupo usa `.boxnuevo-title`.

## Avatar en combos (`C` y `lab-cbox`)

Los `p-select` muestran la selección con un avatar circular (inicial del texto) + etiqueta, vía el slot `#selectedItem`:

```html
<p-select ... optionLabel="label" optionValue="value">
  <ng-template #selectedItem let-option>
    <div class="combo-selected">
      <span class="combo-avatar">{{ option?.label?.slice(0, 1).toUpperCase() }}</span>
      <span class="combo-label">{{ option?.label }}</span>
    </div>
  </ng-template>
</p-select>
```

- En `dynamic-field` el option usa `label`; en `lab-cbox` usa `text`.
- Clases: `.combo-selected` (flex, gap), `.combo-avatar` (círculo `#eceff1`/`#37474f`), `.combo-label` (ellipsis).

## Densidad / foco / error

Overrides uniformes estilo "outlined" de Vuetify:

- Ancho `100%` y `min-height: 2.5rem` en `p-inputtext`, `p-textarea`, `p-select`, `p-multiselect`, `p-datepicker`, `p-autocomplete`.
- Borde `#cfd8dc` por defecto.
- Foco: borde índigo `#3949ab` + `box-shadow 0 0 0 1px`.
- Error: borde rojo `#ef4444` en `.ng-invalid.ng-touched`.
- Switch índigo y checkbox verde vía variables CSS (`--p-toggleswitch-checked-background`, `--p-checkbox-checked-background`).

## Archivos donde viven los estilos

| Archivo | Contenido |
|---|---|
| `components/dynamic-form/dynamic-field.scss` | `.boxnuevo`, `.combo-*`, `.chips-*`, `.file-preview`, `::ng-deep` de densidad/foco/error |
| `components/combo-dependency/lab-cbox.scss` | `.combo-*`, `::ng-deep` de `p-select`/`p-multiselect` |
