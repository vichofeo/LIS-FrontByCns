# AGENTS.md — Memoria persistente de `sistema-salud`

> Este archivo se carga automáticamente al inicio de cada sesión de opencode en este proyecto.
> Su propósito es que cualquier sesión nueva recupere al instante: qué es el proyecto, qué hay hecho, qué falta y cómo moverse en él.

## 1. Qué es

Monorepo **Angular 20** del **Sistema de Salud CNS** (Caja Nacional de Salud), parte de la migración **Vue → Angular** (`Transicion/`). La app principal (`src/`) consume **9 librerías de dominio** en `projects/`. Es **el workspace donde se está migrando el módulo LABORATORIO** (formularios dinámicos server-driven).

```
src/                                ← App principal (shell): Layout, header/menu/footer, Login, OAuth2/OIDC
src/app/main/                       ← components/, models/, pages/layout/, services/ (menu, event-bus, versiones)
src/environments/                   ← environment.ts (dev) / environment.prod.ts (con placeholders de CI)
projects/auth/                      ← ✅ COMPLETA — OAuth2/OIDC, guards, interceptors, login, auth-callback
projects/shared/                    ← ✅ AVANZADA — pdf-viewer, plantilla-aviso, guards/resolvers, models, services (incl. erpCNS)
projects/laboratorio/               ← 🔵 MIGRACIÓN ACTIVA — shared de formularios dinámicos terminado; solo subdominio `pr` con páginas
projects/cita-medica/               ← 🟡 PARCIAL — 24 servicios + 8 models reales; 3 páginas reales, 10 módulos sin rutas
projects/vigencia/                  ← 🟡 PARCIAL — 7 servicios + 3 models reales; 5 módulos con routing VACÍO
projects/usuario/                   ← 🟡 PARCIAL — página perfil + tarjeta-asistencia + 5 servicios RRHH
projects/farmacia/                  ← 🔴 SKELETON puro (solo routing vacío + stub "works!")
projects/consulta-externa/          ← 🔴 SKELETON puro
projects/internacion/               ← 🔴 SKELETON puro
docs/laboratorio/                   ← dynamic-form.md + skills/ (specs de migración)
```

Stack: Angular `^20.3` · TypeScript `~5.9` · PrimeNG `^20.4` + Aura · PrimeFlex 4 · FontAwesome 7 · angular-oauth2-oidc 20 · SweetAlert2 · Quill · pdfmake · **zoneless** (`provideZonelessChangeDetection`) · standalone components · `@angular/build` (app) + `ng-packagr` (libs).

**⚠️ Repo git recién inicializado** (2 commits: "primer pussh", "version prueba"). El trabajo de esta sesión quedó **sin commitear**. Los despliegues CI se definen en `.gitlab-ci.yml` (kaniko + downstream deploy a `devops/pipeline-library`).

## 2. Estado de migración por librería (inventario real)

| Lib | Estado | Contenido concreto |
|---|---|---|
| **auth** | ✅ | `services/auth.service.ts` (OAuth2), `config/{auth-config, auth-initializer, auth-module-config, storage-factory}`, `guards/{auth, aut-with-forced-login}.guard`, `interceptor/{auth, jwt}.interceptor`, `pages/{login, auth-callback}`, `models/{info, profile, user, user-claims}` |
| **shared** | ✅ | `pages/{pdf-viewer, plantilla-aviso}`, `guards/acces-guard.ts`, `resolvers/{manager, access}.resolver` (access es STUB), 10 models, `services/{notification, sweetalert, warning, menubar, local-storage, aesencrypt-decrypt}` + `services/erpCNS/{organigrama, ubicacion}` |
| **laboratorio** | 🔵 | `shared/` COMPLETO (componentes en `.ts`+`.html`+`.scss`, clases sin sufijo `Component`): `components/{dynamic-form, dynamic-field, table-check, crud/lab-crud, tabstep/tab-step}`, `services/dynamic-api.service.ts` (`get/save/cbox/agrupado`), `models/dynamic-api.models`, `utils/dynamic-form-schema.util`, `laboratorio-config.ts` (token `LIS_API_BASE_URL`), `mensajes.service`, `laboratorio-logger.service`, `messages/laboratorio-messages.ts`. Solo subdominio **`pr/`** con páginas (`servicios`, `cfg-areas`). **5 subdominios VACÍOS**: parametrizacion, configuracion, preanalitica, analitica, postanalitica (routing `[]`) |
| **cita-medica** | 🟡 | 24 services HTTP reales, 8 models. Módulos REALES: `reporte/seguimiento` (SeguimientoMedicoList con PDF), `consultorio-usuario` (list+form), `inhabilitacion` (solo list). **STUBS**: `inhabilitacion-form`, `reporte/reservas-eliminadas-list`. **10 módulos con routing `[]`**: horario, horario-en-linea, consultorio, reserva, atencion-reserva, atencion, panel-reserva, panel-rehabilitacion, no-asegurado, kardex |
| **vigencia** | 🟡 | 7 services reales (`adscripcion`, `adscripcion-temporal`, `asegurado`, `centro-medico`, `consultorio`, `parametricas`, `vigencia`), 3 models. **5 módulos con routing `[]`**: consultorio, centro-medico, adscripcion, asegurado, inhabilitacion. Sin pages/components |
| **usuario** | 🟡 | `pages/perfil`, `components/tarjeta-asistencia`, 5 services RRHH (rrhh-empleado, rrhh-marcaciones, rrhh-persona, rrhh-tarjeta, usuario), 4 models |
| **farmacia** | 🔴 | Solo `farmacia.routing.ts` (`[{}]`) + stub |
| **consulta-externa** | 🔴 | Solo `consulta-externa.routing.ts` (`[{}]`) + stub |
| **internacion** | 🔴 | Solo `internacion.routing.ts` (`[{}]`) + stub |

### Rutas efectivamente resolubles hoy
- `/login`, `/auth-callback`
- `/admin/usuario/perfil`
- `/admin/laboratorio/pr/servicios`, `/admin/laboratorio/pr/cfg-areas`
- `/admin/citaMedica/reporte/seguimiento`, `/admin/citaMedica/consultorio-usuario`, `/admin/citaMedica/inhabilitacion`
- `/admin/shared/aviso/:codigo` (404)

## 3. Contrato backend del laboratorio (motor CRUD dinámico)

Servido por `servicio-back` (proyecto hermano en `Transicion/`). Base: token **`LIS_API_BASE_URL`** inyectado en el servicio (provisto desde `environment.lisApi = https://localhost:5001/v1/` en `src/app/app.config.ts`). Backend .NET dinámico local.

- Endpoints del `DynamicApiService` (`projects/laboratorio/src/lib/shared/services/dynamic-api.service.ts`): `GET {dominio}/{modelo}` (grilla/form, `?idx=`), `POST save` (`/save`), `POST cbox` (combos en cascada), `POST agrupado` (wizard). **NO hay endpoints de DELETE/PUT** → `lab-crud.onDelete()` solo muestra toast ("backend aún no expone endpoint de eliminación").
- Contrato `{ ok, data, message }`.
- `lab-crud` usa input `dominio` + `modelo` (ej. `<lab-crud modelo="serviciosn" dominio="areas">`); `lab-tab-step` usa `modelGroup` + `swStepper`.
- `DynamicField` resuelve `typeCode` → componente PrimeNG (`p-select`, `p-datepicker`, `p-inputNumber`, radios, checkboxes, toggle, autocomplete, multiselect, fileupload…). TypeCodes: TT,TN,TD,TM,TP,TA,TAR,F,FT,FC,C,RH,RV,HH,HV,SW,MS,MH,FA,FI,YT,H.
- Detalle completo: `docs/laboratorio/dynamic-form.md`.

## 4. Configuración local

- `src/environments/environment.ts` apunta a **dev**: `api-desarrollo.cns.gob.bo`, issuer `auth-desarrollo.cns.gob.bo`, clientId `test_dev`. `environment.lisApi` = `https://localhost:5001/v1/` (backend dinámico local, hay que tener `servicio-back` corriendo en 5001).
- `environment.prod.ts` usa placeholders (`API_BASE_URL`, `SALUD_BASE_URL`, `AUTH_BASE_URL`, `AUTH_CLIENT_ID`, `AUTH_SCOPE`, `APP_VERSION_PLACEHOLDER`) que rellena la CI.
- Sin secretos locales que configurar (todo dev vía URLs).

## 5. Comandos clave

```powershell
# Servidor de desarrollo (http://localhost:4200)
npm start

# Build producción / desarrollo
npm run build
ng build --configuration development

# Tests (Karma + Jasmine)
npm test

# Lint / formato
npm run lint
npm run lint:fix
npm run format

# Build de una librería
ng build cita-medica --configuration development
```

> ⚠️ Build verificado en la sesión 02: **la app (`ng build`) y `ng build laboratorio` compilan OK** (también `farmacia` y `consulta-externa`). Las demás libs (`auth`, `shared`, `usuario`, `cita-medica`, `vigencia`) NO compilan individualmente con ng-packagr (ver §7).

## 6. Convenciones (reglas del proyecto)

- **Standalone + zoneless**: componentes standalone, `inject()`, `firstValueFrom` + async/await (no suscripciones manuales en forms).
- **Orden de miembros** en componentes (README §Convenciones): 1 propiedades públicas → 2 protected → 3 private/readonly → 4 constructor → 5 getters/setters → 6 métodos públicos (lifecycle hooks primero) → 7 protected → 8 private.
- **Exportación**: lo compartido se exporta en `public-api.ts` de cada lib (y en `index.ts` de su directorio). Lo no exportado = interno.
- **Rutas**: lazy `loadChildren` desde el `.routing.ts` de la lib raíz; cada módulo tiene su propio `*.routing.ts` que define `routes`.
- **PrimeNG 20** (nuevo API de components standalone), PrimeFlex para layout, `MessageService`/`MensajesService` para toasts.
- Styles: SCSS, tema CNS en `src/assets/theme/` (`layout-cns-nacional`).

## 7. Estado actual y pendientes (2026-08-16)

**Hecho:**
- [x] App shell funcional (Layout, menu, login, OAuth, zoneless, PrimeNG Aura)
- [x] auth y shared completas
- [x] Laboratorio: `shared/` de formularios dinámicos completo (dynamic-form, dynamic-field, table-check, lab-crud, tab-step, dynamic-api.service) + subdominio `pr/` con 2 páginas
- [x] cita-medica: 24 servicios + 8 models + 3 módulos con páginas reales
- [x] vigencia: 7 servicios + 3 models (sin UI)
- [x] usuario: perfil + tarjeta-asistencia
- [x] **Build de `laboratorio` y de la app verificado** — estaba roto por `import { environment } from '@env/environment'` dentro de la lib (ng-packagr crasheaba). Fix: token `LIS_API_BASE_URL` inyectado en `DynamicApiService` + proveído en `app.config.ts`
- [x] **Lint de laboratorio en 0 errores** (122 → 0): member-ordering, `no-explicit-any`→`unknown`/`Record`/`TableRow`, `prefer-inject`, `no-output-native` (`close`→`closed`), `no-empty-lifecycle`, `no-unused-vars`, `label-has-associated-control`
- [x] **Laboratorio alineado al patrón de las demás libs**: componentes en `.ts`+`.html`+`.scss` (`templateUrl`/`styleUrl`), clases/archivos sin sufijo `Component` (`LabCrud`, `DynamicForm`, `DynamicField`, `TableCheck`, `TabStep`, `Servicios`, `CfgAreas`)
- [x] `docs/laboratorio/dynamic-form.md` y `projects/laboratorio/README.md` reescritos y alineados con el código real
- [x] **Fase 0 + Fase 1 del `dynamic-form`** (paridad Vue→Angular, todo dentro de `projects/laboratorio`): (F0) recuperados los índices del schema `[5]=reservado`→`forcePlain`, `[6]=M|número`→`multiple`/`rows`, `[7]`→`sinInicial` (`DynamicFieldConfig`, tupla `DynamicFormCampos` y `toDynamicFormSchema`). (F1) validaciones (regex email en `TM`, "al menos una opción" en `HH`/`HV` requeridos), `extractSimpleValue` soporta `selected` array, fechas `F`/`FT`/`FC` con `minDate`/`maxDate`, `TD` con `min`/`max`, `TA`/`TAR` con filas dinámicas, `SW` con `{label}: {valor}`, `HH`/`HV` múltiple + "Mostrar más/menos", colores switch/checkbox vía CSS vars locales
- [x] **Fase 2 del `dynamic-form`** (todo dentro de `projects/laboratorio`): `MH` → editor de chips de texto libre (`<p-chip>` + input, separador coma, el control guarda string `a,b,c` — PrimeNG 20 ya no trae `p-chips`); `FA`/`FI` → `<p-fileUpload mode="basic" [customUpload]>` con `onSelect`→FileReader→base64 (`data:`) + preview (`p-image`/`img`) y botón "Quitar", estado `previewUrl` como `signal()` (zoneless-safe).
- [x] **Combos en cascada (`cbox`)** (todo dentro de `projects/laboratorio`): nuevo componente standalone `<lab-cbox>` (`shared/components/combo-dependency/lab-cbox.ts`) espejo del `ComboDepency`/`FrmModelCboxDependency` de Vue. Contrato verificado en `servicio-back` (`DinamicoController.GetCbox`: `POST .../cbox` con body `Dictionary<string,object> selectedValues` plano; response `{ok, data:{campos,valores}}`). Nuevos tipos `DynamicCboxField/Data/Response` y `DynamicApiService.cbox` retorna `DynamicCboxResponse`. Renderiza `p-select` (o `p-multiSelect` si `campos[6]=='M'`), recarga `cbox` en cada cambio, emite `cboxChange` con los valores aplanados.
- [x] **Fase 3 (visual)** (todo dentro de `projects/laboratorio`, con `:host ::ng-deep` local, sin tocar el tema global `src/assets/theme`): `.boxnuevo` gris redondeado para `RH`/`RV`/`HH`/`HV` (recupera el de Vue), combo con avatar (slot `#selectedItem` en `p-select`, en `dynamic-field` y `lab-cbox`), densidad/borde/foco uniformes (`min-height`, `border-color` azul-gris, `box-shadow` indigo en foco, error rojo en `ng-invalid.ng-touched`).

**Pendiente / atención (prioridad):**
- [ ] **`lab-cbox` paridad total con Vue**: falta la lógica de "TODOS" (`value === '-1'`) de `verifyOptionMultiple` para combos múltiples, y el soporte de `dataTable`/`headers` (combos primal con tabla) que `DynamicApiService.cbox` ya devuelve.
- [ ] **Laboratorio**: implementar los 5 subdominios vacíos (parametrizacion, configuracion, preanalitica, analitica, postanalitica) usando el shared de dynamic forms (patrón del subdominio `pr/`)
- [ ] **Vigencia**: implementar los 5 módulos (consultorio, centro-medico, adscripcion, asegurado, inhabilitacion) — en `sistema-salud-oficial` ya están migrados, sirven de referencia
- [ ] **cita-medica**: implementar los 10 módulos sin rutas + resolver los 2 stubs (inhabilitacion-form, reservas-eliminadas-list)
- [ ] **farmacia / consulta-externa / internacion**: migración de negocio por hacer (skeleton)
- [ ] **Build de las demás libs roto** (mismo bug de `@env/environment` que tenía laboratorio): `auth`, `shared`, `usuario`, `cita-medica`, `vigencia` fallan en `ng build` con `Cannot destructure property 'pos' of 'file.referencedFiles[index]'`. `cita-medica` y `vigencia` además tienen self-import circular (`import { X } from 'vigencia'` dentro de `vigencia`). Fix: aplicar el mismo patrón de InjectionToken que laboratorio. (Solo `farmacia` y `consulta-externa` compilan; no importan `@env`.)
- [ ] **`ng build laboratorio` falla HOY (preexistente, sesión 03)**: `Cannot destructure property 'pos' of 'file.referencedFiles[index]'` — crash interno de **TypeScript 5.9.3** en `typescript.js:126740` (`getReferencedFileLocation`), no un error de tipos. Verificado: ocurre **igual con los cambios de Fase 0/1 REVERTIDOS**; `tsc --noEmit -p projects/laboratorio/tsconfig.lib.json` ✅ y `eslint` sobre dynamic-form ✅; `ng build farmacia` ✅ (toolchain OK). Hipótesis: incompatibilidad **TS 5.9.3 (instalado) vs Angular 20.3 (soporta ≤5.8)** → el fix es bajar TS a `~5.8` en el `package.json` raíz (FUERA de `projects/laboratorio`). Esto pone en duda la hipótesis de sesión 02 de que el error venía de `@env/environment` (podría ser el mismo crash de TS en todas las libs).
- [ ] **TODO** único: `projects/auth/src/lib/services/auth.service.ts:159` → "Remember current URL"
- [ ] **Errata**: `cita-medica/.../inhabilitacion/inhabilitacion-list.ts:25` importa con ruta relativa profunda `../../../../../../vigencia/src/lib/models` (debería ser `import { ... } from 'vigencia'`)
- [ ] **Errata**: `usuario.service.ts` importa `Usuario` de `'usuario'` pero el model NO está exportado en el public-api de usuario
- [ ] **STUB**: `shared/resolvers/access.resolver.ts` devuelve `of(true)` sin lógica
- [ ] **Docs**: `docs/laboratorio/skills/SKILL-TabStep.md` y `SKILL.md` aún referencian nombres viejos (`LabTabStepComponent`, `DynamicFormComponent`, `TabStepComponent`) — specs históricas, opcional actualizar
- [ ] **Docs** `docs/laboratorio/skills/SKILL.md`: spec de migración del módulo Vue **acrehab** → `laboratorio/src/lib/acrehab/` (NO implementado aún)

## 8. Proyectos hermanos y referencia

- **`sistema-salud-oficial`** (Transicion/): mismo monorepo/shell, pero con **vigencia ~95% migrada, cita-medica con capa de datos migrada** y el patrón `components/models/modules/reports/services` con index.ts. Referencia de código ya migrado para esto proyecto.
- **`servicio-back`** (Transicion/): backend .NET 10 con el **motor CRUD dinámico** que consume `environment.lisApi` (ver AGENTS.md de servicio-back, §10).
- Skills de migración: `migrate-vue2angular` (vuetifyGenerico → Angular), `migrate-acrehab` (módulo acrehab), `crear-agents-md` (este archivo). Especs raíz: `Transicion/SKILL-MIGRACION.md`, `Transicion/SKILL-DINAMICO-V2.md`.
- Reglas institucionales: `Transicion/reglas-locales/` (doc-angular.md, doc_api_rest.md, doc_reglas_codificacion.md, etc.).

## 9. REGLA OBLIGATORIA: auto-actualización al cerrar la sesión

**Cuando se termine el trabajo de la sesión** (o el usuario lo indique con "actualiza AGENTS.md" / "cerramos"), el agente DEBE:

1. Mover a la lista "Hecho" de §7 los pendientes resueltos.
2. Agregar al **inicio** de la bitácora de §10 una entrada nueva con formato:
   ```
   ### YYYY-MM-DD — Título corto de lo realizado
   - Hicimos: <cambios de código concretos>
   - Archivos tocados: <rutas principales>
   - Dónde quedamos: <próximo paso exacto / pendiente siguiente>
   - Comandos verificados: <build/lint/test con resultado>
   ```
3. Si quedó algún cambio sin commit, reflejarlo explícitamente en §7 (Pendiente).
4. No borrar entradas anteriores de la bitácora (historial acumulativo, la más reciente arriba).

## 10. Bitácora de sesiones (historial acumulativo)

<!-- La entrada más reciente va ARRIBA. El agente agrega aquí al cerrar cada sesión. -->

- **2026-08-16 — Sesión 06 — Dynamic-form: Fase 3 (visual, scoped).**
  - Hicimos: recuperar la "vistosidad" de Vuetify con SCSS local (sin tocar el tema global `src/assets/theme`, respetando la restricción de solo `projects/laboratorio`). (1) `.boxnuevo` (fondo `rgb(243,243,243)`, borde redondeado 15px, padding) envuelve los grupos `RH`/`RV`/`HH`/`HV` con título `.boxnuevo-title`. (2) Combo con **avatar** (inicial del texto) en `p-select` vía slot `#selectedItem let-option` (contexto `$implicit` = opción seleccionada), en `dynamic-field` (optionLabel `label`) y `lab-cbox` (optionLabel `text`). (3) Densidad/foco/error uniformes con `:host ::ng-deep`: ancho 100%, `min-height 2.5rem`, borde `#cfd8dc`, foco indigo `#3949ab` + `box-shadow`, error rojo en `.ng-invalid.ng-touched`. Clases nuevas `.combo-selected/.combo-avatar/.combo-label`.
  - Archivos tocados: `projects/laboratorio/src/lib/shared/components/dynamic-form/dynamic-field.{html,scss}`, `projects/laboratorio/src/lib/shared/components/combo-dependency/lab-cbox.{html,scss}`, `docs/laboratorio/dynamic-form.md` (nueva sección "Apariencia visual (Fase 3)"), `AGENTS.md`.
  - Dónde quedamos: Fase 3 completa y limpia (`tsc --noEmit` ✅, `eslint` ✅ 0 errores; `.scss` no los lintea eslint). Fases 0-3 del `dynamic-form` terminadas y documentadas en `dynamic-form.md`. Pendiente general: build roto por TS 5.9.3, "TODOS" (`-1`) en `lab-cbox`, `dataTable`/`headers`, y los 5 subdominios vacíos.
  - Comandos verificados: `tsc --noEmit -p projects/laboratorio/tsconfig.lib.json` ✅, `eslint` (dynamic-field/lab-cbox .html + .ts) ✅ 0 errores.

- **2026-08-16 — Sesión 05 — Combos en cascada: componente `lab-cbox` (`cbox`).**
  - Hicimos: implementamos la cascada de combos dependientes como un componente dedicado `<lab-cbox>` (`shared/components/combo-dependency/lab-cbox.ts` + `.html`/`.scss`/`index.ts`), espejo del `ComboDepency`/`FrmModelCboxDependency` de Vue (no se tocó `dynamic-form`, que solo renderiza combos estáticos). Se verificó el contrato real en `servicio-back` (`DinamicoController.GetCbox` → `POST .../cbox` con `[FromBody] Dictionary<string,object> selectedValues` plano; `GetDynamicComboHandler` devuelve `{ok, data:{valores, campos, dataTable?, headers?}}`). Nuevos tipos `DynamicCboxField`/`DynamicCboxData`/`DynamicCboxResponse` en `dynamic-api.models.ts` y `DynamicApiService.cbox` ahora retorna `DynamicCboxResponse`. `LabCbox` renderiza `p-select`/`p-multiSelect` (según `campos[6]=='M'`), carga inicial con `datosIn`, recarga `cbox` en cada `onChange` (eventos + `firstValueFrom`, sin suscripciones manuales), reconstruye el `FormGroup` con la selección corregida y emite `cboxChange` con los valores aplanados. Se exportó desde `shared/index.ts`.
  - Archivos tocados: `projects/laboratorio/src/lib/shared/components/combo-dependency/*` (nuevo), `projects/laboratorio/src/lib/shared/models/dynamic-api.models.ts`, `projects/laboratorio/src/lib/shared/services/dynamic-api.service.ts`, `projects/laboratorio/src/lib/shared/index.ts`, `docs/laboratorio/dynamic-form.md`, `AGENTS.md`.
  - Dónde quedamos: `lab-cbox` listo y limpio (`tsc --noEmit` ✅, `eslint` ✅). Pendiente de paridad total: lógica "TODOS" (`-1`) en múltiples y `dataTable`/`headers`. Siguiente: **Fase 3 (visual)** con SCSS local.
  - Comandos verificados: `tsc --noEmit -p projects/laboratorio/tsconfig.lib.json` ✅, `eslint` (lab-cbox .ts/.html + models + service) ✅ 0 errores. (`ng build laboratorio` sigue roto por el crash preexistente de TS 5.9.3.)

- **2026-08-16 — Sesión 04 — Dynamic-form: Fase 2 (MH chips + FA/FI upload).**
  - Hicimos: (1) `MH` → editor de chips de texto libre con `<p-chip [removable]>` + `<input>` (separador coma, `addChip`/`removeChip`); el control de formulario guarda string `a,b,c` igual que el Vue (`TextChips`). Hallazgo: **PrimeNG 20 ya no trae `p-chips`** (solo `primeng/chip`, el chip estático), por eso se construyó el editor a mano. (2) `FA`/`FI` → `<p-fileUpload mode="basic" [customUpload]>` con `(onSelect)` → FileReader → base64 (`data:`), preview con `<img>` y botón "Quitar"; estado `previewUrl` como `signal()` (zoneless-safe) inicializado en `ngOnInit` desde el valor del control. (3) Se quitó `MultiSelectModule` (sin uso) y se agregó `ChipModule`. Verificado alineado con la arquitectura (standalone, zoneless, signals para estado async, `@for` con `track $index`).
  - Archivos tocados: `projects/laboratorio/src/lib/shared/components/dynamic-form/{dynamic-field.ts,dynamic-field.html,dynamic-field.scss}`, `docs/laboratorio/dynamic-form.md`, `AGENTS.md`.
  - Dónde quedamos: MH + FA/FI listos y limpios (`tsc --noEmit` ✅, `eslint` ✅). **`C` (cascada) queda pendiente**: `dependency` es `boolean` (no trae campo padre) y `cbox()` no está cableado → requiere muestra real del backend. Siguiente: **Fase 3 (visual)** con SCSS local.
  - Comandos verificados: `tsc --noEmit -p projects/laboratorio/tsconfig.lib.json` ✅, `eslint` (dynamic-field/dynamic-form .ts + .html) ✅ 0 errores. (`ng build laboratorio` sigue roto por el crash preexistente de TS 5.9.3.)

- **2026-08-16 — Sesión 03 — Dynamic-form: Fase 0 (índices de schema) + Fase 1 (paridad de campos).**
  - Hicimos: (F0) ampliar `DynamicFieldConfig` (`multiple`, `rows`, `sinInicial`) y la tupla `DynamicFormCampos` a 8 posiciones, y mapear `[5]/[6]/[7]` en `toDynamicFormSchema` (`[6]` dual: `'M'`→`multiple`, número→`rows`). (F1) `buildValidators`: regex email para `TM`, regla "al menos una opción" (valida arrays) para `HH`/`HV` requeridos, e init del control como array cuando `multiple`; `extractSimpleValue` ahora extrae `selected` array de `{value,text}`; en `dynamic-field.ts` getters `minDate`/`maxDate` (F=max hoy/min 1930, FT=min −30d, FC=min 1930), `switchValue`, estado `limit/tope` + `showMore/showLess`; en `dynamic-field.html` `F/FT/FC` con `[minDate]/[maxDate]`, `TD` con `[min]/[max]`, `TA/TAR` con `[rows]`, `SW` con label `{label}: {valor}`, `HV` con "Mostrar más/menos"; en `dynamic-field.scss` colores switch/checkbox vía CSS vars locales. Todo dentro de `projects/laboratorio`.
  - Archivos tocados: `projects/laboratorio/src/lib/shared/components/dynamic-form/{dynamic-form.models.ts,dynamic-form.ts,dynamic-field.ts,dynamic-field.html,dynamic-field.scss}`, `projects/laboratorio/src/lib/shared/models/dynamic-api.models.ts`, `projects/laboratorio/src/lib/shared/utils/dynamic-form-schema.util.ts`, `docs/laboratorio/dynamic-form.md`, `AGENTS.md`.
  - Dónde quedamos: código Fase 0+1 completo y limpio (tsc + eslint ✅). **`ng build laboratorio` sigue roto por un crash preexistente de TS 5.9.3** (no por estos cambios) — pendiente decidir bajar TS en el `package.json` raíz. Próximo paso de paridad: **Fase 2** (`MH`→`p-chips`, `FA/FI` upload real, `C` cascada) y **Fase 3** (visual, con SCSS local).
  - Comandos verificados: `tsc --noEmit -p projects/laboratorio/tsconfig.lib.json` ✅, `eslint` (dynamic-form .ts/.html) ✅ 0 errores, `ng build laboratorio` ❌ (crash TS preexistente, reproducido con cambios revertidos), `ng build farmacia` ✅.

- **2026-08-15 — Sesión 02 — Laboratorio: build, lint y alineación arquitectónica.**
  - Hicimos: (1) desbloquear el build de `laboratorio` — root cause: `import { environment } from '@env/environment'` dentro de la lib hacía crashear ng-packagr; fix con token `LIS_API_BASE_URL` inyectado en `DynamicApiService` y provisto en `src/app/app.config.ts` (también `laboratorio-messages.json` → `.ts`). (2) dejar lint en 0 (122→0): member-ordering, `no-explicit-any`→`unknown`/`Record`/`TableRow`, `prefer-inject`, `no-output-native` (`close`→`closed`), `no-empty-lifecycle`, `no-unused-vars`, `label-has-associated-control`. (3) reescribir `docs/laboratorio/dynamic-form.md` y `projects/laboratorio/README.md` (contrato real `get/save/cbox/agrupado` + `dominio`). (4) alinear laboratorio al patrón de las demás libs: componentes split en `.ts`+`.html`+`.scss` y clases/archivos sin sufijo `Component`.
  - Archivos tocados: `projects/laboratorio/src/lib/**` (7 componentes renombrados + sidecars html/scss, `laboratorio-config.ts`, `dynamic-api.service.ts`, `mensajes.service.ts`, barrels, `pr.routing.ts`), `src/app/app.config.ts`, `projects/laboratorio/README.md`, `docs/laboratorio/dynamic-form.md`.
  - Dónde quedamos: laboratorio verde (build + lint). Próximo paso: aplicar el mismo fix de `@env/environment` (InjectionToken) a `auth`/`shared`/`usuario`/`cita-medica`/`vigencia` para desbloquear sus builds, y luego implementar los 5 subdominios vacíos de laboratorio.
  - Comandos verificados: `ng build laboratorio --configuration development` ✅, `ng build` (app) ✅ (solo warnings preexistentes), `eslint projects/laboratorio/**/*.{ts,html}` ✅ 0 errores.

- **2026-08-14 — Sesión 01 — Creación de AGENTS.md.** Se levantó el inventario real del proyecto (estructura, estado de migración de las 9 libs, contrato del backend dinámico, erratas y pendientes) y se creó este archivo.
  - Archivos tocados: `AGENTS.md`.
  - Comandos verificados: ninguno (solo lectura; build pendiente de validar en una sesión futura).
