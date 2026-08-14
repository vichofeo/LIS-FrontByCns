---
name: migrate-tabstep
description: Migrates the Vue pr module's TabStep pattern (CfgAreas.vue → TabComponent.vue) to the Angular laboratorio subproject. Covers the generic TabComponent (tabs + stepper dual mode over grouped dynamic models), the 'grupe'/'areas_group' agrupado backend contract, the DynamicApiService alignment needed (agrupado/save/cbox), and the LabTabStepComponent wrapper.
---

# Migrate Vue TabComponent (CfgAreas) → Angular laboratorio

Migrate `vuetifyGenerico/src/views/pr/CfgAreas.vue` and its core `TabComponent.vue` to a generic `LabTabStepComponent` inside `projects/laboratorio`, reusing `lab-dynamic-form`.

## Source of truth

- Vue view (thin stub): `vuetifyGenerico/src/views/pr/CfgAreas.vue` — only renders `<TabComponent modelGroup="grupe" />`
- Vue core component: `vuetifyGenerico/src/views/pr/components/TabComponent.vue` — the whole logic (tabs + stepper dual mode)
- Vue sibling view (already migrated as lab-crud): `vuetifyGenerico/src/views/pr/Servicios.vue` + `components/ComponentABC.vue`
- Vue service: `vuetifyGenerico/src/services/bvirtual/bVirtualService.js`
- Vue utils (filter): `vuetifyGenerico/src/components/utils/utils.js` → `filterDataSimplexByModelParam`
- **Backend contract (.NET):** `servicio-back/apps/ServicioNombreModulo.Api/Controllers/DinamicoController.cs` (route `v1/dinamico/{dominio}/{modelo}`) + grouped metadata `servicio-back/src/Infrastructure/DynamicQuery/metadata/areas/parameters_agrupado.json`
- Existing laboratorio docs: `docs/laboratorio/dynamic-form.md` (dynamic-form, table-check, lab-crud)
- Existing Angular shared: `projects/laboratorio/src/lib/shared/` — `services/dynamic-api.service.ts`, `components/dynamic-form/`, `components/crud/`

## The Vue component (TabComponent.vue)

A generic dual-mode wizard over **grouped dynamic models**:

1. `initial()`: `POST /agrupado` with `{ modelo: modelGroup }` → `dataTab = [{ model, label, icon }, ...]`
2. For each `dataTab[].model`: `getDataModelNew(model)` (no idx) or `getDataModel({ idx, model })` (with idxSelected) → `dataFrm[modelKey] = { campos, valores, linked }`
3. Render:
   - `swStepper=false` → `v-tabs` with one `v-tab-item` per model, each containing `FrmModelElements` + Cancelar/Guardar buttons
   - `swStepper=true` → `v-stepper`; `nextStep` advances `e1`; last step calls `saveDataSteppers()` which saves ALL models sequentially
4. Save per model: `saveData(model)` → body `{ ...filterDataSimplexByModelParam(dataFrm[model]), idx }` → `POST /save`
5. `handleClose()` emits `close`; `handleFunction` prop = parent refresh callback

Props: `modelGroup` (String, default `'grupe'`), `idxSelected` (String|null), `swStepper` (Boolean, default false), `handleFunction` (Function).

## Backend contract (the real target)

`DinamicoController` in `servicio-back` (matches `lisApi = https://localhost:5001/v1/` → `/v1/dinamico/...`):

| Endpoint | Verbo | Purpose |
|---|---|---|
| `GET {dominio}/{modelo}` | GET | form (no idx = new) or edit (`?idx=`) |
| `GET {dominio}/{modelo}/new` | GET | alias of new |
| `POST {dominio}/{modelo}/save` | POST | insert/update (`{ idx?, ...data }`) |
| `POST {dominio}/{modelo}/cbox` | POST | dependent combos |
| `POST {dominio}/{modelo}/agrupado` | POST | returns `[{ model, label, icon }, ...]` |

Grouped metadata lives in `parameters_agrupado.json` keyed by group name, e.g.:

```json
{ "areas_group": [
  { "model": "areas", "label": "Areas", "icon": "mdi-folder-outline" },
  { "model": "servicios", "label": "Servicios", "icon": "mdi-cog-outline" }
]}
```

> The Vue view passes `modelGroup="grupe"` but .NET defines `areas_group`. The group key must exist in the .NET metadata for the request to succeed.

## Critical: DynamicApiService is MISALIGNED with the .NET backend

Current `dynamic-api.service.ts` only has `get/post/put/remove` hitting `{base}/dinamico/{dominio}/{modelo}` (+ `/idx` for delete). The .NET backend does NOT expose bare POST/PUT/DELETE — it uses `/save`, `/cbox`, `/agrupado`.

**Required changes (Fase 0):**

```typescript
agrupado(dominio: string, modelo: string): Observable<DynamicGroup[]> {
  return this.http.post<...>(`${this.baseUrl}/${dominio}/${modelo}/agrupado`, { modelo })
}

save(dominio: string, modelo: string, body: unknown): Observable<DynamicResponse> {
  return this.http.post<DynamicResponse>(`${this.baseUrl}/${dominio}/${modelo}/save`, body)
}

cbox(dominio: string, modelo: string, selectedValues: Record<string, unknown>): Observable<DynamicResponse> {
  return this.http.post<DynamicResponse>(`${this.baseUrl}/${dominio}/${modelo}/cbox`, selectedValues)
}
```

Also decide the fate of `put`/`remove`: the .NET `DinamicoController` has no PUT or DELETE (deletion is not supported by the module per `dinamico.md`). Verify whether `lab-crud` delete/edit still works against the real backend; if not, they must be routed through the same controller pattern the backend actually exposes.

## New component: LabTabStepComponent

Location: `projects/laboratorio/src/lib/shared/components/tabstep/` (barrel `index.ts`, `tabstep.models.ts`, `tab-step.component.ts`). Standalone, `lab-` selector, `@Input({ required: true })`.

```typescript
@Component({
  selector: 'lab-tab-step',
  standalone: true,
  imports: [CardModule, ButtonModule, ProgressSpinnerModule, TabsModule, StepsModule, DynamicFormComponent],
  // ...
})
export class TabStepComponent implements OnInit {
  @Input({ required: true }) modelGroup!: string
  @Input() idxSelected: string | null = null
  @Input() swStepper = false
  @Output() saved = new EventEmitter<unknown>()
  @Output() close = new EventEmitter<void>()

  protected tabs = signal<TabStepGroupItem[]>([])       // [{model,label,icon}]
  protected schemas = signal<Record<string, DynamicFormSchema>>({})
  protected loading = signal(false)
  protected activeIndex = signal(0)
  protected stepIndex = signal(0)                        // stepper e1
}
```

### Templates

**Mode tabs** (`!swStepper`): use PrimeNG 20 `TabsModule`:

```html
<p-tabs [(value)]="activeIndex">
  <p-tablist>
    @for (tab of tabs(); track tab.model; let i = $index) {
      <p-tab [value]="i"><i [class]="tab.icon"></i> {{ tab.label }}</p-tab>
    }
  </p-tablist>
  <p-tabpanels>
    @for (tab of tabs(); track tab.model; let i = $index) {
      <p-tabpanel [value]="i">
        @if (schemas()[tab.model]) {
          <lab-dynamic-form [schema]="schemas()[tab.model]!" [lengthCols]="6" />
        } @else {
          <p-progressSpinner />
        }
        <div class="flex justify-content-end gap-2 mt-3">
          <p-button label="Cancelar" severity="secondary" (onClick)="cancel()" />
          <p-button label="Guardar" (onClick)="saveModel(tab.model)" />
        </div>
      </p-tabpanel>
    }
  </p-tabpanels>
</p-tabs>
```

**Mode stepper** (`swStepper`): use `StepsModule` (`p-steps`) with `[(activeIndex)]`, or PrimeNG `StepperModule` (`p-stepper` + `p-step-list`/`p-step`/`p-step-panels`/`p-step-panel`). Both exist in PrimeNG 20.4 (verified in node_modules). The "Continuar"/"Guardar" button logic replicates `nextStep(currentStep)`: last step calls `saveDataSteppers()`.

```html
<p-steps [model]="stepsModel()" [(activeIndex)]="stepIndex" [readonly]="false" />
```

### Logic (replicate TabComponent.vue)

```typescript
async initial(): Promise<void> {
  this.loading.set(true)
  try {
    const res = await firstValueFrom(this.api.agrupado(this.dominio, this.modelGroup))
    if (res.ok) {
      this.tabs.set(res.data as TabStepGroupItem[])
      for (const tab of this.tabs()) {
        let entity
        if (this.idxSelected) {
          entity = await firstValueFrom(this.api.get(this.dominio, tab.model, { idx: this.idxSelected }))
        } else {
          entity = await firstValueFrom(this.api.get(this.dominio, tab.model)) // no idx = new
        }
        // build DynamicFormSchema per model (same mapping as lab-crud.buildFormSchema)
        this.schemas.update(s => ({ ...s, [tab.model]: this.toSchema(entity) }))
      }
    }
  } catch {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar formularios', life: 8000 })
  }
  this.loading.set(false)
}

async saveModel(model: string): Promise<void> {
  const values = this.dynamicForms[model]?.getFormValues() ?? {}
  const body = { idx: this.idxSelected, ...values['datos'] }
  const res = await firstValueFrom(this.api.save(this.dominio, model, body))
  if (res.ok) { this.toast.success(...); this.saved.emit(res.data) }
}

async saveDataSteppers(): Promise<void> {
  for (const tab of this.tabs()) {
    const res = await firstValueFrom(this.api.save(this.dominio, tab.model, bodyFor(tab.model)))
    if (!res.ok) { this.toast.warn(...); return }
  }
  this.saved.emit()
}
```

Notes:
- Use `@ViewChild`/template refs per dynamic form, or map `getFormValues()` per model via a `Map<string, DynamicFormComponent>`.
- `handleFunction` (Vue) → `@Output() saved` event (Angular).
- Use `MessageService` (already available via `MessageService` inject + `<p-toast>`), or `MensajesService` for code-based messages.
- Icons: Vue uses mdi strings (`mdi-folder-outline`); map to PrimeIcons (`pi pi-folder`) or keep raw class.

## Vue → Angular mapping table

| Vue | Angular laboratorio |
|---|---|
| `CfgAreas.vue` (stub) | `pr/pages/cfg-areas-page.component.ts` → `<lab-tab-step modelGroup="areas_group" />` |
| `TabComponent.vue` | **NEW** `LabTabStepComponent` |
| `v-tabs` / `v-tabs-items` / `v-tab-item` | `p-tabs` + `p-tablist` + `p-tab` + `p-tabpanels` + `p-tabpanel` (TabsModule) |
| `v-stepper` / `v-stepper-step` | `p-steps` / `p-stepper` (StepsModule / StepperModule) |
| `FrmModelElements` | `lab-dynamic-form` |
| `LoadingCircle` | `p-progressSpinner` |
| `MensajeriaUtils` | `MessageService` / `MensajesService` |
| `getGroupedModels({ modelo })` | `DynamicApiService.agrupado(dominio, modelo)` |
| `getDataModelNew` / `getDataModel({idx,model})` | `DynamicApiService.get(dominio, modelo)` / `get(dominio, modelo, { idx })` |
| `saveData({ model, data })` | `DynamicApiService.save(dominio, model, body)` |
| `filterDataSimplexByModelParam` | `lab-dynamic-form.getFormValues()` + `extractSimpleValue` |
| `handleFunction` (prop Function) | `@Output() saved` |
| `$emit('close')` | `@Output() close` |
| `tab.icon` (mdi) | PrimeIcons or raw class |

## Gap checklist

1. **`DynamicApiService` alignment** (Fase 0, blocker): add `agrupado()`, `save()` (`/save`), `cbox()`; resolve `put`/`remove` vs backend (no PUT/DELETE in .NET DinamicoController).
2. **Group name**: Vue `'grupe'` vs .NET `'areas_group'` — must match `parameters_agrupado.json`.
3. **`bVirtualService.js` Vue is broken**: `saveData`/`saveDataModel`/`delDataModel` referenced by TabComponent/ComponentABC are NOT exported in the current service file — do NOT replicate the Vue save shape; use the `.NET` `/save` contract.
4. **`p-tabs` uses `ModelSignal value`**: use `[(value)]` two-way binding.
5. **DynamicFormSchema build per model**: reuse `lab-crud.buildFormSchema` mapping (campos tuple → `DynamicFieldConfig`, wrap in section `{ label, linked, model, campos, valores }`). Consider extracting it to a shared util `toDynamicFormSchema(entity, model)` to avoid duplication.

## Execution phases

1. **Fase 0**: Align `DynamicApiService` with .NET contract (`agrupado`, `save`, `cbox`).
2. **Fase 1**: Create `LabTabStepComponent` (tabs + stepper modes) + barrel + models.
3. **Fase 2**: Page `cfg-areas` in `pr/pages/` + route in `pr.routing.ts` (`path: 'cfg-areas'`).
4. **Fase 3** (optional): verify `servicios-page` (`lab-crud`) works with the new `save()`.

## Verification

- Build: `ng build laboratorio` must succeed with zero warnings.
- New component standalone, explicit `imports`, `@Input({ required: true })`, no comments unless requested.
- Follow existing laboratorio conventions: `inject()`, `firstValueFrom` + `async/await` + try/catch, `MessageService` toasts, PrimeFlex utility classes, modern control flow `@for/@if`.
