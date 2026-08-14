---
name: migrate-acrehab
description: Migrates the Vue acrehab (acreditación/habilitación/evaluación) module to the Angular laboratorio subproject. Covers the AcreHabView dynamic router dispatcher, its 5 modules (DashEvals, Evaluacion, RPac, AcreHab, CnfFrmsEvals), the ComboDependency dependent-combo primitive, the ~15 eval/ABC components, and the 26-endpoint acrehabService API map.
---

# Migrate Vue AcreHab → Angular laboratorio

Migrate `vuetifyGenerico/src/views/acrehab/` + `vuetifyGenerico/src/components/acrehab/` to Angular inside `projects/laboratorio`, reusing the existing shared infrastructure (`lab-dynamic-form`, `lab-table-check`, `lab-crud`, `DynamicApiService`).

## Source of truth

- Vue root: `vuetifyGenerico/src/views/acrehab/AcreHabView.vue` (router dispatcher) and `modules/*.vue`
- Vue components: `vuetifyGenerico/src/views/acrehab/components/*.vue` (ABCAcreHab, ABCRenovacion, FrmByModelGroup, FrmConfig)
- Vue generic components: `vuetifyGenerico/src/components/acrehab/*.vue` (ComboDependency, Eval*, graphRadar)
- Vue form primitives: `vuetifyGenerico/src/components/inputs/FrmModelCboxDependency.vue`, `FrmModelElements.vue`, `FrmModelElementsBasics.vue`, `AllBasics.vue`
- Vue service: `vuetifyGenerico/src/services/acrehab/acrehabService.js`
- Vue routes: `vuetifyGenerico/src/router/routes/ucass.js` (`/ucass/acrehab/:idx`), `observatorio.js` (`/observatorio/acrehab/:idx`), `emergencia/eme_camas`
- Existing laboratorio docs: `docs/laboratorio/dynamic-form.md`
- Existing laboratorio shared: `projects/laboratorio/src/lib/shared/` (dynamic-form, table, crud, dynamic-api.service.ts)
- Backend base URL: `src/environments/environment.ts` (`lisApi`) — `DynamicApiService` builds `${lisApi}dinamico/{dominio}/{modelo}`

## Target structure

```
projects/laboratorio/src/lib/acrehab/
├── acrehab.routing.ts               ← route '/acrehab/:idx' + '/:idx' dispatcher
├── acrehab-view.component.ts        ← AcreHabView (param → @switch module)
├── acrehab.models.ts                ← interfaces
├── services/acrehab-api.service.ts  ← 26-endpoint acrehabService equivalent
├── pages/
│   ├── dash-evals.component.ts      ← DashEvals (dashboard + charts)
│   ├── evaluacion.component.ts      ← Evaluacion (5-tab workflow)
│   ├── rpac.component.ts            ← RPac (PAC expiration report)
│   ├── acrehab-tabs.component.ts    ← AcreHab (CRUD / Renovación / Seguimiento)
│   └── cnf-frms-evals.component.ts  ← CnfFrmsEvals (instrument config tree)
└── components/
    ├── combo-dependency.component.ts     ← ComboDependency + FrmModelCboxDependency
    ├── frm-by-model-group.component.ts   ← FrmByModelGroup (p-steps multi-model)
    ├── abc-acrehab.component.ts          ← ABCAcreHab (grouped CRUD, multipart)
    ├── abc-renovacion.component.ts       ← ABCRenovacion (p-tree)
    ├── frm-config.component.ts           ← FrmConfig
    ├── eval-new-edit.component.ts        ← EvalNewEdit (tree of evaluators)
    ├── eval-resumen.component.ts         ← EvalResumenOptimizer (radar + table)
    ├── eval-procesar.component.ts        ← EvalProcesarOptimizer (tabs + checkboxes)
    ├── eval-procesar-rama.component.ts   ← EvalProcesarRama
    ├── eval-view.component.ts            ← EvalViewOptimizer (tabs + PDF)
    ├── eval-view-rama.component.ts       ← EvalViewRama (PDF)
    ├── eval-pac.component.ts             ← EvalPAC (stepper)
    └── graph-radar.component.ts          ← graphRadar (Chart.js Radar)
```

## Dispatcher (AcreHabView.vue → acrehab-view)

`AcreHabView` receives `idx` route param and lazy-loads a module:

| `idx` | Module | Component |
|---|---|---|
| `dashboard` | `DashEvals.vue` | `dash-evals` |
| `evaluacionn` | `Evaluacion.vue` | `evaluacion` |
| `repo_pac` | `RPac.vue` | `rpac` |
| `acreditacionn` / `habilitacionn` / `repo_acrehab` | `AcreHab.vue` | `acrehab-tabs` |
| `frm_cnf_content` | `CnfFrmsEvals.vue` | `cnf-frms-evals` |
| default | AcreHab | `acrehab-tabs` |

Angular pattern: route with param `:idx`, in component use `@switch (idx)` over the 5 pages (or `loadChildren` lazy routes per idx). Use `this.route.snapshot.paramMap.get('idx')` and re-load on param change.

## Vue → Angular component mapping

### Reuse existing (already migrated)
| Vue | Angular laboratorio |
|---|---|
| `FrmModelElements` / `FrmModelElementsBasics` / `AllBasics` | `lab-dynamic-form` + `lab-dynamic-field` (see `docs/laboratorio/dynamic-form.md`) |
| `TableDataChecks` | `lab-table-check` (`showSelect`/`withDel` control edit/delete buttons) |
| `TableData` (simple, no edit) | `lab-table-check` with `showSelect=false, withDel=false` |
| `ComponentABC` | `lab-crud` |
| `PopupFullWide` / `PopupWide` | `p-dialog` (full-screen / wide) |
| `ContenedorCard` | `p-card` |
| `Loading` / `LoadingCircle` | `p-progressSpinner` |
| `MensajeriaUtils` | `MessageService` (PrimeNG) |
| `BtnInsert` / `BtnEdit` / `BtnGeneric` | `p-button` |
| `ContenedorAlert` | `<div>` styled with PrimeFlex classes |

### PrimeNG primitives for missing Vuetify widgets
| Vuetify | PrimeNG |
|---|---|
| `v-treeview` | `p-tree` (`[value]`, `selectionMode`, expanded keys) |
| `v-stepper` | `p-steps` |
| `v-tabs` | `p-tabs` + `p-tablist` + `p-tab` (PrimeNG 20) |
| `v-combobox` | `p-select` (`[multiple]`) / `p-multiSelect` |
| `v-file-input` | `p-fileUpload` |
| `v-simple-table` | `p-table` |
| `v-dialog` | `p-dialog` |

### New components (no existing equivalent)
- `combo-dependency` — cascading server-side combos. Replicates `FrmModelCboxDependency` mixin: a select whose options come from `POST /acrehab/cbox` with a `cbox` payload (dominio/modelo/param values), and whose selection propagates to dependent params. Used across ALL modules — build first (Fase 2).
- `frm-by-model-group` — `p-steps` wizard rendering a sequence of model groups (`getGroupedModels` payload), each rendered with `lab-dynamic-form`; saves via `POST /acrehab/agrupado` + `model/data/save`.
- `graph-radar` — Chart.js Radar wrapper (`src`=labels, `series`=datasets), used by `eval-resumen`.
- `lab-chart` — generic Chart.js wrapper for bar/pie/line used by `dash-evals`.
- `abc-acrehab` — grouped CRUD: table of group models (`getGroupedModels`), `getDataModelNew`/`getDataModel` per model, multi-model save via `model/data/save`, and multipart `registerAcreHab`.
- `abc-renovacion` — `p-tree` built from `POST /acrehab/treeData`; leaf operations via `getDataModelN`; PDF via `getFreeFileb64`.

## API service map (acrehabService.js → AcrehabApiService)

All under `${lisApi}acrehab`. Method naming follows the Vue service:

| Vue method | HTTP | Angular method |
|---|---|---|
| `getCboxDepData` | POST `/acrehab/cbox` | `getCboxDepData(cbox)` |
| `getGroupedModels` | POST `/acrehab/agrupado` | `getGroupedModels(model)` |
| `getDataModel` | GET `/acrehab/{idx}/{model}` | `getDataModel(idx, model)` |
| `getDataModelNew` | GET `/acrehab/{model}/new` | `getDataModelNew(model)` |
| `getDataModelN` | GET `/acrehab/{model}` | `getDataModelN(model)` |
| `saveDataByModel` | POST `/acrehab/save` | `saveDataByModel(payload)` |
| `getTreeData` | POST `/acrehab/treeData` | `getTreeData(payload)` |
| `getDataEval` | GET `/acrehab/eval/get/{param}` | `getDataEval(param)` |
| `getDataEvalView` | GET `/acrehab/eval/getView/{param}` | `getDataEvalView(param)` |
| `getDataRoots` | GET `/acrehab/eval/getRaices/{param}` | `getDataRoots(param)` |
| `getDataAllTree` | GET `/acrehab/eval/{p1}/geTreeData/{p2}` | `getDataAllTree(p1, p2)` |
| `getDataFrmSimplex` | GET `/acrehab/eval/{p1}/get/{p2}` | `getDataFrmSimplex(p1, p2)` |
| `getDataFrmSimplexView` | GET `/acrehab/eval/{p1}/getView/{p2}` | `getDataFrmSimplexView(p1, p2)` |
| `getDataMonCalculate` | GET `/acrehab/eval/{p1}/getMon/{p2}/{p3}` | `getDataMonCalculate(p1, p2, p3)` |
| `getDataMonInitial` | GET `/acrehab/eval/getMonBasic/{p}` | `getDataMonInitial(p)` |
| `getDataEvaluacionView` | GET `/acrehab/eval/{p1}/getEvalTree/{p2}` | `getDataEvaluacionView(p1, p2)` |
| `saveDataFrmSimplex` | POST `/acrehab/eval/save` | `saveDataFrmSimplex(payload)` |
| `getFrmView` | GET `/acrehab/frm/getFrm/{p}` | `getFrmView(p)` |
| `getFrmCreateEdit` | GET `/acrehab/frm/getFrmCnf/{p}` | `getFrmCreateEdit(p)` |
| `getFrmParametros` | GET `/acrehab/frm/getFrmCnf/{p1}/{p2}` | `getFrmParametros(p1, p2)` |
| `saveFrmParametros` | POST `/acrehab/frm/save` | `saveFrmParametros(payload)` |
| `saveEndFrm` | POST `/acrehab/frm/saveEnd` | `saveEndFrm(payload)` |
| `savePAC` | POST `/acrehab/eval/pac/save` | `savePAC(payload)` |
| `getPAC` | GET `/acrehab/eval/pac/{p}/get` | `getPAC(p)` |
| `saveTPAC` | POST `/acrehab/eval/tpac/save` | `saveTPAC(payload)` |
| `reportTPAC` | POST `/acrehab/eval/tpac/report` | `reportTPAC(payload)` |
| `registerAcreHab` | POST `/acrehab/register/save` | `registerAcreHab(payload: FormData)` |
| `getFreeFileb64` | PUT `/bvirtual/{param}/getb64` | `getFreeFileb64(param)` — used for PDF viewer |

Multipart: `registerAcreHab` sends `FormData` with `uploaded_file`, `modelo`, and flattened field values. Angular `HttpClient` posts `FormData` natively; build via a `toFormData()` util.

## Filtering util (formDataFilter)

Many Vue components call `filterDataSimplexByModelParam(modelo, filtrado, params)` before save/get. Create `shared/utils/form-data-filter.util.ts`:

- Flattens each field to `field.value` when the field object carries `value`/`selected` (extract `selected.value` from combo objects, falling back to raw value).
- Ignores combo placeholders / empty values.
- Returns a plain object safe for `POST`/`GET` payloads.

Replicates Vue `formDataFilter` behavior used by `FrmModelElements`-style components.

## Gap checklist (verify before each phase)

1. **Charts**: `chart.js` must be installed (single lib covers bar/pie/line/radar). NO chart lib currently in `package.json`. Write thin wrapper components (`lab-chart`, `graph-radar`) — chart.js works with zoneless via manual `chart.update()`.
2. **`DynamicResponse`**: add `role?: { primal?: boolean }` (used by `evaluacion` to show/hide "Nueva Evaluacion"). Check `dynamic-api.service.ts` model.
3. **`lab-table-check` column templates**: `ABCAcreHab`/`Evaluacion` need per-column `TemplateRef` (badges, PDF links, segmented view) and an expandable slot (`xpnd`) with a nested `p-table`. Extend `TableColumn` with optional `template?: TemplateRef<unknown>`; existing `expandTemplate` input already supports nested tables.
4. **PDF viewer**: render `getFreeFileb64` base64 in `<iframe>`/`<object>` via `DomSanitizer` blob URL.
5. **`sweetalert2`** is already in package.json for confirmations (used across laboratorio) — do NOT install new confirm lib.
6. **Forms**: `lab-dynamic-form` handles `frm` payloads with `cols`/`rows` layout; group models arrive as arrays of frm objects — render per model and persist with `model/data/save`.

## Execution phases

- **Fase 0 — Prereqs**: install `chart.js`; add `form-data-filter.util.ts`; extend `DynamicResponse` with `role`; add column templates to `lab-table-check`.
- **Fase 1 — Base**: `acrehab.models.ts`, `acrehab-api.service.ts`, `acrehab.routing.ts`, `acrehab-view.component.ts` (dispatcher).
- **Fase 2 — Primitive**: `combo-dependency.component.ts` (blocks everything else).
- **Fase 3**: `dash-evals` + `lab-chart`.
- **Fase 4**: `evaluacion` + eval components (`eval-new-edit`, `eval-resumen`, `eval-procesar`, `eval-view`, `eval-pac`).
- **Fase 5**: `rpac`.
- **Fase 6**: `acrehab-tabs` + `abc-acrehab` + `abc-renovacion`.
- **Fase 7**: `cnf-frms-evals` + `frm-config`.

## Verification

- Build: `ng build laboratorio` (or `ng build` at repo root) must succeed with zero warnings.
- Every new component: standalone, `imports` explicit, no private Angular features, no comments unless requested.
- Follow existing laboratorio conventions: `@Input({ required: true })`, `MessageService` for toasts, PrimeFlex utility classes in templates, `sweetalert2` for confirms.
