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

**⚠️ NO es repo git** (no hay `.git/`). Cambios sin versionar → riesgo de pérdida. Los despliegues CI se definen en `.gitlab-ci.yml` (kaniko + downstream deploy a `devops/pipeline-library`), pero localmente no hay control de versiones.

## 2. Estado de migración por librería (inventario real)

| Lib | Estado | Contenido concreto |
|---|---|---|
| **auth** | ✅ | `services/auth.service.ts` (OAuth2), `config/{auth-config, auth-initializer, auth-module-config, storage-factory}`, `guards/{auth, aut-with-forced-login}.guard`, `interceptor/{auth, jwt}.interceptor`, `pages/{login, auth-callback}`, `models/{info, profile, user, user-claims}` |
| **shared** | ✅ | `pages/{pdf-viewer, plantilla-aviso}`, `guards/acces-guard.ts`, `resolvers/{manager, access}.resolver` (access es STUB), 10 models, `services/{notification, sweetalert, warning, menubar, local-storage, aesencrypt-decrypt}` + `services/erpCNS/{organigrama, ubicacion}` |
| **laboratorio** | 🔵 | `shared/` COMPLETO: `components/{dynamic-form, dynamic-field, table-check, lab-crud, tab-step}`, `services/dynamic-api.service.ts` (`get/save/cbox/agrupado`), `models/dynamic-api.models`, `utils/dynamic-form-schema.util`, `mensajes.service`, `laboratorio-logger.service`, `messages/laboratorio-messages.json`. Solo subdominio **`pr/`** con páginas (`servicios`, `cfg-areas`). **5 subdominios VACÍOS**: parametrizacion, configuracion, preanalitica, analitica, postanalitica (routing `[]`) |
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

Servido por `servicio-back` (proyecto hermano en `Transicion/`). Base: **`environment.lisApi = https://localhost:5001/v1/`** (backend .NET dinámico local).

- Endpoints del `DynamicApiService` (`projects/laboratorio/src/lib/shared/services/dynamic-api.service.ts`): `GET {dominio}/{modelo}` (grilla/form, `?idx=`), `GET {dominio}/{modelo}/new`, `POST save` (`/save`), `POST cbox` (combos en cascada), `POST agrupado` (wizard). **NO hay endpoints de DELETE/PUT** → `lab-crud.onDelete()` solo muestra toast ("backend aún no expone endpoint de eliminación").
- Contrato `{ ok, data, message }`.
- `lab-crud` usa input `dominio` + `modelo` (ej. `<lab-crud modelo="serviciosn" dominio="areas">`); `lab-tab-step` usa `modelGroup` + `swStepper`.
- `DynamicFieldComponent` resuelve `typeCode` → componente PrimeNG (`p-select`, `p-datepicker`, `p-inputNumber`, radios, checkboxes, toggle, autocomplete, multiselect, fileupload…). TypeCodes: TT,TN,TD,TM,TP,TA,TAR,F,FT,FC,C,RH,RV,HH,HV,SW,MS,MH,FA,FI,YT,H.
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

> ⚠️ No se ha verificado un build completo recientemente en este proyecto. `dist/` solo contiene la app (ninguna lib compilada individualmente). Si compilas con `ng build`, revisa el public-api de cada lib (ver §7 erratas).

## 6. Convenciones (reglas del proyecto)

- **Standalone + zoneless**: componentes standalone, `inject()`, `firstValueFrom` + async/await (no suscripciones manuales en forms).
- **Orden de miembros** en componentes (README §Convenciones): 1 propiedades públicas → 2 protected → 3 private/readonly → 4 constructor → 5 getters/setters → 6 métodos públicos (lifecycle hooks primero) → 7 protected → 8 private.
- **Exportación**: lo compartido se exporta en `public-api.ts` de cada lib (y en `index.ts` de su directorio). Lo no exportado = interno.
- **Rutas**: lazy `loadChildren` desde el `.routing.ts` de la lib raíz; cada módulo tiene su propio `*.routing.ts` que define `routes`.
- **PrimeNG 20** (nuevo API de components standalone), PrimeFlex para layout, `MessageService`/`MensajesService` para toasts.
- Styles: SCSS, tema CNS en `src/assets/theme/` (`layout-cns-nacional`).

## 7. Estado actual y pendientes (2026-08-14)

**Hecho:**
- [x] App shell funcional (Layout, menu, login, OAuth, zoneless, PrimeNG Aura)
- [x] auth y shared completas
- [x] Laboratorio: `shared/` de formularios dinámicos completo (dynamic-form, dynamic-field, table-check, lab-crud, tab-step, dynamic-api.service) + subdominio `pr/` con 2 páginas
- [x] cita-medica: 24 servicios + 8 models + 3 módulos con páginas reales
- [x] vigencia: 7 servicios + 3 models (sin UI)
- [x] usuario: perfil + tarjeta-asistencia

**Pendiente / atención (prioridad):**
- [ ] **Laboratorio**: implementar los 5 subdominios vacíos (parametrizacion, configuracion, preanalitica, analitica, postanalitica) usando el shared de dynamic forms (patrón del subdominio `pr/`)
- [ ] **Vigencia**: implementar los 5 módulos (consultorio, centro-medico, adscripcion, asegurado, inhabilitacion) — en `sistema-salud-oficial` ya están migrados, sirven de referencia
- [ ] **cita-medica**: implementar los 10 módulos sin rutas + resolver los 2 stubs (inhabilitacion-form, reservas-eliminadas-list)
- [ ] **farmacia / consulta-externa / internacion**: migración de negocio por hacer (skeleton)
- [ ] **TODO** único: `projects/auth/src/lib/services/auth.service.ts:159` → "Remember current URL"
- [ ] **Errata**: `cita-medica/.../inhabilitacion/inhabilitacion-list.ts:25` importa con ruta relativa profunda `../../../../../../vigencia/src/lib/models` (debería ser `import { ... } from 'vigencia'`)
- [ ] **Errata**: `usuario.service.ts` importa `Usuario` de `'usuario'` pero el model NO está exportado en el public-api de usuario
- [ ] **Errata**: `docs/laboratorio/dynamic-form.md` desactualizado (describe `post/put/remove` y `carpeta`; el código usa `get/save/cbox/agrupado` y `dominio`)
- [ ] **STUB**: `shared/resolvers/access.resolver.ts` devuelve `of(true)` sin lógica
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

- **2026-08-14 — Sesión 01 — Creación de AGENTS.md.** Se levantó el inventario real del proyecto (estructura, estado de migración de las 9 libs, contrato del backend dinámico, erratas y pendientes) y se creó este archivo.
  - Archivos tocados: `AGENTS.md`.
  - Comandos verificados: ninguno (solo lectura; build pendiente de validar en una sesión futura).
