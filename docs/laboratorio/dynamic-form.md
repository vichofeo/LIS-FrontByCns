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
  valores: Record<string, any>;                 // Valores actuales
}

interface DynamicFieldConfig {
  label: string;                           // [0] Etiqueta del campo
  editable: boolean;                       // [1] true=editable, false=solo lectura
  required: boolean;                       // [2] true=requerido
  typeCode: FieldTypeCode;                 // [3] Código de tipo de campo
  maxLength?: number;                      // [4] Longitud máxima (texto)
  forcePlain?: boolean;                    // [5] Forzar texto plano (opcional)
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

> **Nota:** El proyecto también define `DynamicFormCampos` como tupla `[string, boolean, boolean, string, number?]` en `dynamic-api.models.ts`. Si el backend envía el schema en formato tupla (`[typeCode, required, editable, label, maxLength?]`), usa ese tipo directamente. Si envía el formato objeto (como arriba), usa `DynamicFieldConfig`.

## Type Codes Soportados

| Código | Tipo | Componente PrimeNG | Comportamiento |
|--------|------|-------------------|----------------|
| `TT` | Texto | `<input pInputText>` | Texto plano de una línea |
| `TN` | Numérico entero | `<p-inputNumber>` | Solo enteros, `minFractionDigits=0` |
| `TD` | Decimal | `<p-inputNumber>` | Decimales, `minFractionDigits=2` |
| `TM` | Email | `<input pInputText type="email">` | Validación de email nativa |
| `TP` | Texto plano (solo lectura) | `<input pInputText readonly>` | Idéntico a `forcePlain=true` |
| `TA` / `TAR` | TextArea | `<textarea pTextarea>` | Texto multilínea, 3 filas |
| `C` | ComboBox | `<p-select>` | Dropdown con búsqueda, items desde `valores[field].items` |
| `F` | Fecha | `<p-datepicker>` | Calendario, formato dd/mm/yy |
| `FT` | Fecha (mañana) | `<p-datepicker>` | Mismo componente, semántica de negocio |
| `FC` | Fecha sin límite | `<p-datepicker>` | Mismo componente, semántica de negocio |
| `RH` | Radio Horizontal | `<p-radioButton>` | Radios en fila (`flex flex-wrap`) |
| `RV` | Radio Vertical | `<p-radioButton>` | Radios en columna (`flex flex-column`) |
| `HH` | Checkbox Horizontal | `<p-checkbox>` | Checkboxes en fila |
| `HV` | Checkbox Vertical | `<p-checkbox>` | Checkboxes en columna |
| `SW` | Switch | `<p-toggleswitch>` | On/off binario |
| `MS` | AutoSuggest | `<p-autoComplete>` | Búsqueda con sugerencias filtradas |
| `MH` | MultiSelect | `<p-multiSelect>` | Selección múltiple tipo chips |
| `FA` | Archivo | `<p-fileUpload>` | Subida de archivos genérica |
| `FI` | Imagen | `<p-fileUpload accept="image/*">` | Subida de imágenes |
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
| `getFormValues()` | `Record<string, any>` | Devuelve valores planos de todos los grupos |

### `<lab-dynamic-field>`

Renderiza un campo individual según su `typeCode`. No se usa directamente en páginas, solo desde `lab-dynamic-form`.

**Inputs:**

| Input | Tipo | Descripción |
|-------|------|-------------|
| `formGroup` | `FormGroup` | FormGroup padre del campo |
| `fieldName` | `string` | Nombre del campo (key en `campos`) |
| `config` | `DynamicFieldConfig` | Configuración del campo |
| `valores` | `Record<string, any>` | Valores actuales (para resolver combos y items) |
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

```typescript
import { Component, OnInit, inject, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { DynamicFormComponent, DynamicFormSchema, DynamicApiService } from 'laboratorio'
import { MensajesService } from 'laboratorio'

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [ReactiveFormsModule, DynamicFormComponent],
  template: `
    <div class="p-3">
      <lab-dynamic-form
        #form
        [schema]="schema()"
        [lengthCols]="3"
      />
      <div class="flex justify-content-end gap-2 mt-3">
        <button pButton label="Guardar" (click)="guardar()"></button>
        <button pButton label="Cancelar" severity="secondary" (click)="cancelar()"></button>
      </div>
    </div>
  `
})
export class MisDatosComponent implements OnInit {
  private api = inject(DynamicApiService)
  private msj = inject(MensajesService)

  readonly schema = signal<DynamicFormSchema | null>(null)

  ngOnInit(): void {
    this.cargarFormulario()
  }

  private cargarFormulario(): void {
    this.api.get('parametrizacion', 'mi_modelo').subscribe({
      next: (res) => {
        if (res.ok) {
          this.schema.set(res.data as unknown as DynamicFormSchema)
        }
      },
      error: () => this.msj.showError('error_carga'),
    })
  }

  guardar(): void {
    const current = this.schema()
    if (!current) return
    const valores = this.extraerValores(current)

    this.api.post('parametrizacion', 'mi_modelo', { valores }).subscribe({
      next: () => this.msj.showSuccess('guardado_exito'),
      error: () => this.msj.showError('error_guardado'),
    })
  }

  cancelar(): void {
    this.cargarFormulario()
  }

  private extraerValores(schema: DynamicFormSchema): Record<string, any> {
    const result: Record<string, any> = {}
    for (const [sectionKey, section] of Object.entries(schema)) {
      const sectionValores: Record<string, any> = {}
      for (const [fieldName, value] of Object.entries(section.valores)) {
        sectionValores[fieldName] = this.extraerValor(value)
      }
      result[sectionKey] = sectionValores
    }
    return result
  }

  private extraerValor(value: any): any {
    if (value === null || value === undefined) return value
    if (typeof value !== 'object') return value
    if (value.selected?.value !== undefined) return value.selected.value
    if (Array.isArray(value)) return value.map(v => this.extraerValor(v))
    return value
  }
}
```

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

El servicio `DynamicApiService` ya existe en `projects/laboratorio/src/lib/shared/services/dynamic-api.service.ts`:

```typescript
class DynamicApiService {
  // GET /api/lab/dinamico/consultas/{carpeta}/{modelo}
  get(carpeta: string, modelo: string, params?): Observable<DynamicResponse>

  // POST /api/lab/dinamico/{carpeta}/{modelo}
  post(carpeta: string, modelo: string, body): Observable<DynamicResponse>
}
```

El `DynamicResponse` tiene esta forma:

```typescript
interface DynamicResponse {
  ok: boolean
  data: Record<string, DynamicEntityData>  ← contiene campos + valores
  message: string
}
```

Cast directo a `DynamicFormSchema` porque la estructura es equivalente:
```typescript
const schema = res.data as unknown as DynamicFormSchema
```

## Notas Técnicas

1. **Zoneless Change Detection:** El proyecto usa `provideZonelessChangeDetection()`. Los componentes `DynamicFieldComponent` y `DynamicFormComponent` usan `FormGroup` + `formControlName` (ReactiveForms), que funciona correctamente con zoneless porque los eventos DOM gatillan change detection automáticamente.

2. **Standalone Components:** Ambos componentes son standalone (`standalone: true`) y declaran sus imports directamente. No requieren NgModule.

3. **Valores combos/selectores:** Los items para `typeCode: 'C'`, `'RH'`, `'RV'`, `'HH'`, `'HV'`, `'MS'`, `'MH'` se resuelven desde `valores[fieldName].items`. Si el valor del combo está seleccionado, se encuentra en `valores[fieldName].selected`.

4. **Campos ocultos (`H`) y `YT`:** No se renderizan visualmente. `H` se renderiza como input oculto (span 12 columnas, `display:none`). `YT` se omite completamente.

5. **Validaciones:** Se aplican `Validators.required` y `Validators.maxLength` automáticamente según `DynamicFieldConfig.required` y `DynamicFieldConfig.maxLength`.

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
| `data` | `any[]` | `[]` | Datos de la tabla |
| `color` | `string` | `'teal'` | Color del encabezado (`teal`, `blue`, `green`, `amber`, `orange`, `red`) |
| `itemsPerPage` | `number` | `5` | Filas por página |
| `singleSelect` | `boolean` | `true` | Modo selección única |
| `expandable` | `boolean` | `false` | Filas expandibles |
| `withDel` | `boolean` | `false` | Botón de eliminar por fila |
| `maxHeight` | `number` | `500` | Altura máxima en píxeles |
| `showSelect` | `boolean` | `true` | Mostrar columna de selección |
| `dataKey` | `string` | `'idl'` | Campo identificador único |
| `expandTemplate` | `TemplateRef<any>` | `null` | Template para fila expandida |

### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `selectionChange` | `any \| any[]` | Emite cuando cambia la selección |
| `deleteItem` | `any` | Emite cuando se hace clic en eliminar |

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
import { Component } from '@angular/core'
import { TableCheckComponent, TableColumn } from 'laboratorio'
import { DynamicApiService } from 'laboratorio'

@Component({
  standalone: true,
  imports: [TableCheckComponent],
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
  items: any[] = []

  ngOnInit() {
    this.api.get('analitica', 'resultados').subscribe(res => {
      if (res.ok) this.items = res.data as any[]
    })
  }

  onSelect(sel: any) { console.log('Seleccionado:', sel) }
  onDelete(item: any) { console.log('Eliminar:', item) }
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

Orquestador de operaciones CRUD: lista datos en tabla, permite crear/editar registros vía popup con formulario dinámico, y eliminar con confirmación.

### Inputs

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `modelo` | `string` | — | Nombre del modelo backend (requerido) |
| `carpeta` | `string` | — | Carpeta/namespace del modelo (requerido) |
| `tituloCentral` | `string` | `'Datos'` | Título de la tarjeta principal |
| `tituloPopup` | `string` | `'Datos seleccionados'` | Título del popup de edición |
| `lengthCols` | `number` | `3` | Columnas del grid en el formulario (3 = 4 campos/fila) |

### Outputs

*(ninguno — el componente maneja toda la persistencia internamente)*

### Uso

```typescript
import { Component } from '@angular/core'
import { LabCrudComponent } from 'laboratorio'

@Component({
  standalone: true,
  imports: [LabCrudComponent],
  template: `<lab-crud modelo="serviciosn" carpeta="areas" />`
})
export class MiPaginaComponent {}
```

### Flujo de operación

1. Al montarse, llama a `DynamicApiService.get(carpeta, modelo)` para obtener la estructura de campos y la lista de registros.
2. Construye las columnas de la tabla a partir del schema (`campos` → `TableColumn[]`).
3. **Nuevo registro**: carga una plantilla vacía (`idx = '-1'`) y abre el popup con `lab-dynamic-form`.
4. **Editar**: al seleccionar una fila (radio button), carga el registro individual y abre el popup con el formulario precargado.
5. **Guardar**: recupera valores del formulario vía `getFormValues()` y envía POST (crear) o PUT (actualizar).
6. **Eliminar**: confirma con `window.confirm()`, luego envía DELETE y refresca la tabla.
7. Las notificaciones toast se muestran con PrimeNG `MessageService` + `<p-toast>`.

### Ejemplo completo

```typescript
import { Component } from '@angular/core'
import { LabCrudComponent } from 'laboratorio'

@Component({
  standalone: true,
  imports: [LabCrudComponent],
  template: `
    <lab-crud
      modelo="serviciosn"
      carpeta="areas"
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
| `:carpeta` | `[carpeta]` |
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
| `getDataModelN(modelo)` → lista | `DynamicApiService.get(carpeta, modelo)` |
| `getDataModel({ idx, model })` → registro | `DynamicApiService.get(carpeta, modelo, { idx, model })` |
| POST/crear | `DynamicApiService.post(carpeta, modelo, body)` |
| PUT/editar | `DynamicApiService.put(carpeta, modelo, body)` |
| DELETE/eliminar | `DynamicApiService.remove(carpeta, modelo, idx)` |

### Notas

- El componente es **autocontenido**: tiene su propio `<p-toast>` para notificaciones.
- Requiere que `DynamicApiService` esté configurado con la URL base correcta en `environment.laboratorioApi`.
- Los métodos `put` y `remove` se agregaron al servicio durante esta migración.
- Las URL de los endpoints siguen el patrón: `/dinamico/consultas/{carpeta}/{modelo}` (GET), `/dinamico/{carpeta}/{modelo}` (POST/PUT), `/dinamico/{carpeta}/{modelo}/{idx}` (DELETE).
- Origen Vue: `vuetifyGenerico/src/views/pr/ComponentABC.vue`
