# Agritrust Frontend — Prioritized Implementation Plan

**App:** `agri_frontend/agro_frontend` (Next.js 16)  
**Backend:** `agri_backend` — base URL `NEXT_PUBLIC_BACKEND_API_BASE` (must end with `/api`)  
**Last updated:** 2026-05-20

This plan closes the gap between the **three-portal UI shell** (farmer / admin / public verify) and the **backend APIs** already implemented (or stubbed). Work is ordered by impact and dependency.

---

## Current state (baseline)

| Area | Today |
|------|--------|
| **Reads** | `GET /farms`, `GET /farms/:id`, `GET /blockchain/status`, `GET /proof/verify` |
| **Auth** | Client mock OTP + `localStorage` user |
| **Writes** | Farmer “Add farm” → `localStorage` only; admin approvals → mock/local |
| **AI / monitoring** | Hardcoded mapper (`healthScore: 70`); mocks on insights |
| **Lab** | `/lab` exercises most endpoints without JWT |

**Critical fix:** Unify on the **registry API** so list, detail, insights, proof, and admin analytics show the same farms.

---

## Principles

1. **One source of truth** — `GET /api/farms` for all farm lists; remove `farms-store.ts` from product flows after migration.
2. **Auth on every protected call** — `Authorization: Bearer <access_token>` via shared `apiRequest`.
3. **Reuse lab payloads** — `/lab` already has correct request shapes; extract into `src/lib/*-api.ts` modules.
4. **Progressive enhancement** — Map polygon editor and camera QR can follow after API wiring.
5. **Backend gaps** — Call out when the API needs a small extension (e.g. farmer notification inbox).

---

## Phase 0 — Foundation (do first)

**Goal:** Authenticated API client and token lifecycle. Unblocks Phases 1–4.

| # | Task | Backend | Frontend changes | Done when |
|---|------|---------|------------------|-----------|
| 0.1 | **Auth API module** | `POST /auth/otp/request`, `POST /auth/otp/verify`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me` | Add `src/lib/auth-api.ts`; store `access_token`, `refresh_token`, `user` in `sessionStorage` (or httpOnly cookie later) | Login calls backend; dev uses `DEMO_OTP` from backend `.env` |
| 0.2 | **Attach JWT to requests** | — | Extend `src/lib/api.ts`: `getAccessToken()`, inject `Authorization`, on 401 try `refresh` once then retry | Protected routes return 200 with token |
| 0.3 | **Replace mock auth context** | — | Refactor `src/context/auth-context.tsx`: `sendOtp` → request; `verifyOtp` → verify; `logout` → logout + clear tokens; `updateProfile` → optional `PATCH` user when backend adds it | Farmer login at `/farmer/login` uses phone OTP only |
| 0.4 | **Admin login** | Same OTP; role from `ADMIN_PHONES` | `/admin/login`: phone OTP (not email mock); document agronomist = admin phone or future role API | Admin session has `role: admin` when phone in `ADMIN_PHONES` |
| 0.5 | **Staff route guard** | `requireAuth` on protected routes | Pass token from shells; show 403 toast on role mismatch | Admin pages that call protected APIs work |

**Env (backend):** `DEMO_OTP=123456`, `ADMIN_PHONES=<your-admin-digits>`  
**Env (frontend):** `NEXT_PUBLIC_BACKEND_API_BASE=http://127.0.0.1:5000/api`

**Files:** `api.ts`, `auth-context.tsx`, `farmer/login/page.tsx`, `admin/login/page.tsx`

---

## Phase 1 — Farm registry (highest product impact)

**Goal:** Farmer registration and admin updates use the same backend registry as list/detail.

| # | Task | Backend | Frontend changes | Done when |
|---|------|---------|------------------|-----------|
| 1.1 | **Wire Add farm → register** | `POST /farms/register` | Replace `upsertFarm` in `farms/new/page.tsx` with `registerFarm()` in `src/lib/farms-api.ts` | New farm appears on `/farmer/farms` after refresh |
| 1.2 | **Align form fields** | Body: `farmer_name`, `aadhaar_id`, `land_survey_number`, `crop_type`, `land_area_acres`, `gps` | Add Aadhaar + farmer name; crop dropdown: `wheat|rice|cotton|maize|sugarcane` (lowercase) | 400 errors show backend `message` |
| 1.3 | **GeoJSON polygon** | `POST /farms/geojson/validate` (auth) | Convert boundary JSON → GeoJSON Feature; validate before submit; show errors | Invalid polygon blocked client-side |
| 1.4 | **Duplicate check** | `POST /farms/duplicate-check` (auth) | On blur of survey + aadhaar, warn if duplicate | User sees duplicate report |
| 1.5 | **Remove localStorage farms from UX** | — | Deprecate `farms-store.ts` for product; keep only for offline demo flag if needed | README + empty states no longer mention split model |
| 1.6 | **Admin farm approval** | `PATCH /farms/:farmId` (admin/agronomist) | `admin/farms/page.tsx`: list `GET /farms` filtered `pending_review`; approve/reject → PATCH status fields | Approvals persist in backend |
| 1.7 | **Server QR** | `GET /farms/:farmId/qr` | `proof/qr-image.tsx`: prefer backend `data_url`; fallback to external API | QR encodes backend payload |

**Register example (from lab):**

```json
{
  "farmer_name": "Ramesh Kumar",
  "aadhaar_id": "111122223333",
  "land_survey_number": "SURVEY-1001",
  "crop_type": "rice",
  "land_area_acres": 3.4,
  "gps": { "latitude": 17.3852, "longitude": 78.4869 }
}
```

**Files:** `farms-api.ts`, `farms/new/page.tsx`, `admin/(app)/farms/page.tsx`, `components/proof/qr-image.tsx`

---

## Phase 2 — Crop monitoring & AI insights

**Goal:** Live health score, yield, weather-derived metrics, and risk alerts from monitoring pipeline.

| # | Task | Backend | Frontend changes | Done when |
|---|------|---------|------------------|-----------|
| 2.1 | **Monitoring API module** | See table below | `src/lib/monitoring-api.ts` | Module matches lab + README |
| 2.2 | **Insights dashboard** | `GET /monitoring/:farmId/ai/latest`, `GET /monitoring/:farmId/data/latest` | `farmer/insights/page.tsx`: replace `mockHealthTrend` / hardcoded scores with API; handle 404 (“run pipeline”) | Health/yield match backend after ingest |
| 2.3 | **Stop fake mapper defaults** | — | `mapApiFarmToPlatform`: use `ai/latest` when loaded, else omit score | Farm cards don’t show fake `70` |
| 2.4 | **“Refresh insights” action** | `ingest/*` → `normalize` → `ai/run` | Button on insights (farmer) or admin AI page: run sequence for selected farm (or link to simplified wizard) | One click produces new `ai_output` |
| 2.5 | **Risk / anomaly alerts** | `ai_output.anomaly_flag`, `health_score` | Derive alert cards on insights + farmer notifications (Phase 3) | Anomaly shows when `health_score < 45` |
| 2.6 | **Weather block** | `GET .../data/latest` → `rainfall`, `temperature` | Weather card on insights | No mock weather series |

**Monitoring endpoints**

| Method | Path | Use in UI |
|--------|------|-----------|
| POST | `/monitoring/:farmId/ingest/iot` | Admin/dev trigger or cron simulation |
| POST | `/monitoring/:farmId/ingest/satellite` | Same |
| POST | `/monitoring/:farmId/ingest/weather` | Same |
| POST | `/monitoring/:farmId/normalize` | After all three ingests |
| POST | `/monitoring/:farmId/ai/run` | After normalize |
| GET | `/monitoring/:farmId/data/latest` | Insights weather/NDVI chart |
| GET | `/monitoring/:farmId/ai/latest` | Health score, yield, growth stage, confidence |

**Optional:** `POST /ingestion/jobs` for satellite/weather/manual_image (auth) — use if you want job status UI on admin AI page.

**Files:** `monitoring-api.ts`, `insights/page.tsx`, `farms-api.ts`, `admin/(app)/ai/page.tsx`

---

## Phase 3 — Verification, proof, certificates

**Goal:** End-to-end proof generation and verification aligned with PoA + proof MVP.

| # | Task | Backend | Frontend changes | Done when |
|---|------|---------|------------------|-----------|
| 3.1 | **PoA API** | `POST /poa/:farmId/generate`, `GET /poa/:farmId/latest` | `src/lib/poa-api.ts`; farmer proof page: “Generate proof” button | Latest proof hash shown |
| 3.2 | **Proof history** | `GET /poa/:farmId/latest` + farm `metadata_hash` | Replace `mockProofHistory` with real events (farm list + latest poa) | History table is real |
| 3.3 | **Proof verify (farmer + admin)** | `GET /proof/verify?farm_id=&hash=` | Already partial — ensure uses farm id + full hash from farm DTO | Mismatch/success from API |
| 3.4 | **Proof documents (auth)** | `POST /proof/documents`, `POST /proof/documents/:hash/anchor` | Admin verification: optional “Create & anchor document” | Anchor tx visible |
| 3.5 | **Certificate** | Farm + proof fields | `farm-certificate.tsx`: bind to API farm + `poa/latest` | Print reflects on-chain hash |
| 3.6 | **Blockchain status** | `GET /blockchain/status` | Keep; show on farmer proof + admin verification | Already wired |

**Files:** `poa-api.ts`, `farmer/(app)/proof/page.tsx`, `admin/(app)/verification/page.tsx`, `verification/*`

---

## Phase 4 — Public verification portal

**Goal:** Public flows call backend, not client heuristics.

| # | Task | Backend | Frontend changes | Done when |
|---|------|---------|------------------|-----------|
| 4.1 | **Hash verify** | `GET /proof/verify?farm_id=&hash=` | `/verify/page.tsx`: parse farm id + hash from payload; call API | “bad” demo removed |
| 4.2 | **Traceability scan** | `GET /traceability/scan/:token` | `/verify/scan`: on token submit, call scan API; render verification JSON | Paste + scan API works |
| 4.3 | **Provenance page** | `GET /farms/:id` + scan payload | `/verify/p/[proofId]`: enrich with traceability when token in query | Origin + batch when tagged |
| 4.4 | **Camera QR** | — | Add `html5-qrcode` or `@zxing/browser`; HTTPS note on scan page | Mobile opens camera → navigates to provenance |
| 4.5 | **Product tagging (farmer)** | `POST /traceability/:farmId/products/tag` | Optional section on proof page or post-harvest wizard | Marketplace QR links to scan API |

**Files:** `verify/page.tsx`, `verify/scan/page.tsx`, `verify/p/[proofId]/page.tsx`, `traceability-api.ts`

---

## Phase 5 — Notifications

**Goal:** Replace mock inbox with real or derived alerts.

| # | Task | Backend | Frontend changes | Done when |
|---|------|---------|------------------|-----------|
| 5.1 | **Inbox strategy** | Today: `POST /notifications/send`, `GET /notifications/outbox` (admin only) | **Option A:** Backend adds `GET /notifications/me` for farmer. **Option B:** Build inbox from `ai/latest` anomaly + audit `user_activity` for verify events | Farmer `/notifications` shows real items |
| 5.2 | **Weather / crop alerts** | Derived from monitoring + AI | Map `anomaly_flag`, rainfall thresholds to notification types | Types match spec |
| 5.3 | **Read state** | Local or backend | `localStorage` read ids until backend supports read | Mark-as-read persists in session |

**Backend follow-up (if Option A):** `GET /notifications?user_id=` or inbox filtered by JWT subject.

**Files:** `notifications/page.tsx`, `mock-data.ts` (remove notification mocks), new `notifications-api.ts`

---

## Phase 6 — Admin dashboard (full spec)

| # | Task | Backend | Frontend changes | Done when |
|---|------|---------|------------------|-----------|
| 6.1 | **Audit logs** | `GET /audit/logs?type=&limit=` (admin, auth) | `admin/verification/page.tsx`: replace `mockAudit` | Live audit table |
| 6.2 | **AI monitoring** | `GET /monitoring/:farmId/ai/latest` per farm + ingestion jobs | `admin/ai/page.tsx`: list farms with latest AI; failed = no batch or low confidence | Failed jobs + confidence review |
| 6.3 | **Farmer KYC** | No dedicated KYC API yet | Keep mock **or** map to `auth/me` + farm `aadhaar_id` until KYC module exists | Documented as backend gap |
| 6.4 | **Users / roles** | JWT roles only | Show users from audit + env; roles page = static matrix + `ADMIN_PHONES` doc | Clear “MVP RBAC” label |
| 6.5 | **Analytics** | `GET /farms` + `ai/latest` per farm | Remove hardcoded “3 states”; compute crop mix; avg health from AI | Heatmap still Phase 7 |
| 6.6 | **Notification outbox** | `GET /notifications/outbox` | Admin-only page or tab under verification | Admin sees sent jobs |

**Files:** `admin/(app)/*`, `audit-api.ts`, `notifications-api.ts`

---

## Phase 7 — Maps, geo-fencing, documents

**Goal:** Spec-complete farm registration UX (after API wiring).

| # | Task | Backend | Frontend changes | Done when |
|---|------|---------|------------------|-----------|
| 7.1 | **Map polygon editor** | `geojson/validate` | Add Leaflet or MapLibre; draw polygon → GeoJSON Feature | Visual draw + validate |
| 7.2 | **Geo-fencing** | Validate polygon + optional backend fence rules | Client: point-in-polygon for GPS capture vs boundary | Warn if GPS outside polygon |
| 7.3 | **Document upload** | `POST /files/upload/init` → `complete` (base64 MVP) | Land docs + crop images on add-farm; store `assetId` on farm metadata when backend links files | Filenames replaced by downloadable assets |
| 7.4 | **Land survey form** | Already on register | Full survey fields section on `farms/new` | Matches registry fields |

**Dependency:** Phase 0 (auth) required for file upload routes.

**New deps:** `leaflet`, `react-leaflet` (or `maplibre-gl`)

---

## Phase 8 — Polish & cleanup

| # | Task | Notes |
|---|------|-------|
| 8.1 | **Shrink `/lab`** | Keep for devs; link from README only |
| 8.2 | **Remove dead code** | Unused `components/sections/*`, reduce `mock-data.ts` to seeds/tests |
| 8.3 | **Error boundaries** | API error component; offline banner |
| 8.4 | **E2E smoke** | Playwright: login → register → list → verify proof |
| 8.5 | **Insurance / credit** | Out of core spec unless product asks — keep in lab or add “Finance” later |

---

## Suggested file layout (new modules)

```
src/lib/
  api.ts              # + Authorization, refresh
  auth-api.ts         # Phase 0
  farms-api.ts        # + register, validate, duplicate, patch, qr
  monitoring-api.ts   # Phase 2
  poa-api.ts          # Phase 3
  proof-api.ts        # verify, documents
  traceability-api.ts # Phase 4
  files-api.ts        # Phase 7
  audit-api.ts        # Phase 6
  notifications-api.ts
src/hooks/
  use-auth-session.ts
  use-farm-ai.ts      # farmId → ai/latest + data/latest
```

---

## API ↔ spec matrix (target end state)

### A. Farmer web app

| Spec module | Phase | Backend route(s) |
|-------------|-------|------------------|
| Mobile OTP login | 0 | `/auth/otp/*` |
| Farmer profile | 0 | `/auth/me` (+ future profile PATCH) |
| Session management | 0 | refresh + logout |
| GPS capture | 1 | register `gps` |
| Geo-fencing / polygon | 1, 7 | `/farms/geojson/validate`, register polygon |
| Document upload | 7 | `/files/*` |
| Land survey form | 1 | register fields |
| Crop health dashboard | 2 | `/monitoring/.../ai/latest`, `data/latest` |
| AI health score | 2 | `ai_output.health_score` |
| Yield prediction | 2 | `ai_output.predicted_yield` |
| Weather insights | 2 | normalized batch |
| Risk alerts | 2, 5 | `anomaly_flag` |
| QR generation | 1, 3 | `/farms/:id/qr`, traceability tag |
| Blockchain proof viewer | 3 | `/blockchain/status`, `/proof/verify` |
| Certificate download | 3 | print + PoA data |
| Notifications | 5 | inbox strategy |

### B. Admin dashboard

| Spec module | Phase | Backend route(s) |
|-------------|-------|------------------|
| Farmer management | 1, 6 | farms + future KYC |
| Role management | 0, 6 | JWT roles, `ADMIN_PHONES` |
| Approval workflows | 1 | `PATCH /farms/:id` |
| AI monitoring | 2, 6 | monitoring + ingestion jobs |
| Analytics | 2, 6 | farms + ai/latest |
| Risk heatmaps | 7+ | **needs geo aggregates** — not in API yet |
| Verification dashboard | 3, 6 | proof, blockchain, audit |

### C. Public verification portal

| Spec module | Phase | Backend route(s) |
|-------------|-------|------------------|
| QR proof verification | 4 | `/traceability/scan/:token`, `/proof/verify` |
| Public traceability | 4 | scan + `/farms/:id` |
| Crop origin / status | 4 | farm DTO + scan payload |

---

## Backend gaps to track (frontend blocked or partial)

| Gap | Impact | Suggestion |
|-----|--------|------------|
| No farmer notification inbox | Phase 5 | Add `GET /notifications/inbox` scoped to JWT user |
| No email admin OTP | Admin login | Use phone OTP + `ADMIN_PHONES` |
| No dedicated KYC API | Admin farmers page | New module or use farm `aadhaar_id` + file assets |
| No district/state on farm DTO | Analytics heatmap | Add `state`, `district` on register; aggregate endpoint |
| Risk heatmap data | Admin analytics | `GET /analytics/risk-map` or client cluster by GPS |
| Agronomist vs admin | Roles page | Extend auth roles in backend |

---

## Effort estimate (rough)

| Phase | Focus | Estimate |
|-------|--------|----------|
| 0 | Auth + API client | 1–2 days |
| 1 | Farm registry | 2–3 days |
| 2 | Monitoring / insights | 2–3 days |
| 3 | Proof / PoA | 1–2 days |
| 4 | Public verify + QR scan | 2–3 days |
| 5 | Notifications | 1–2 days (+ backend if Option A) |
| 6 | Admin completion | 2 days |
| 7 | Maps + files | 3–5 days |
| 8 | Cleanup / E2E | 1–2 days |

**Total (Phases 0–6, production MVP):** ~2–3 weeks  
**With maps + camera QR (0–7):** ~3–4 weeks

---

## Recommended sprint order

```
Sprint 1: Phase 0 + Phase 1        → login + register + single registry
Sprint 2: Phase 2 + Phase 3        → live insights + proof
Sprint 3: Phase 4 + Phase 5 + 6  → public verify + notifications + admin audit
Sprint 4: Phase 7 + 8            → maps, uploads, QR camera, cleanup
```

---

## Quick start (dev)

1. Backend: `cd agri_backend && DEMO_OTP=123456 ADMIN_PHONES=9999999999 npm run dev`
2. Frontend: `cd agri_frontend/agro_frontend && cp .env.example .env.local`
3. Implement Phase 0.1–0.3, then 1.1–1.2
4. Validate: login → register farm → see farm on `/farmer/farms` → open `/verify/p/<id>`

---

## References

- Backend route index: `agri_backend/README.md`
- Frontend baseline audit: conversation / prior module checklist
- Lab request shapes: `src/app/lab/page.tsx`
