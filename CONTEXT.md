# AirNavFlow: project context for AI assistants

Read this file first, every session. It replaces the memory of earlier AI sessions
(Claude, 2026-10 to 2026-11). User-facing docs are in `README.md` (Thai).

## 1. Project
- **Goal:** flight-planning app usable on any device, anywhere, also offline (PWA).
- **Owner:** SPD (GitHub `Spidersqdn`). Writes Thai; reply in Thai.
- **Live app:** https://spidersqdn.github.io/AirNavFlow/
- **Not for navigation:** planning only; AIP/NOTAM official sources win.

## 2. Repositories
| Repo | Role |
|---|---|
| `Spidersqdn/AirNavFlow` | The app (this repo). GitHub Pages via Actions. |
| `Spidersqdn/DataBase` | Big/shared data on Pages, same origin `spidersqdn.github.io` (no CORS issue). One folder per project. |
| `Spidersqdn/FLIGHT`, `PAWITTOJOBs/FLIGHT` | Old names/forks. Do not use. |

### AirNavFlow layout
```
index.html            whole app in ONE file (~1.1 MB: JS, CSS, libs, embedded AIP data)
airnavflow.html       redirect stub to ./ (old URL)
sw.js                 service worker; bump APP_CACHE (fp-app-vNNN) on EVERY index.html change
manifest.webmanifest, icons/
data/*.txt            editable data, pipe-separated "a | b | c", "#" = comment
notam/                NOTAMyyMMMdd.txt + latest.txt (written by automation)
map/                  empty fallback; real pmtiles live in DataBase
tools/                notam-gmail.gs (Apps Script) + AUTOMATION-TH.md
.github/workflows/    build-map-and-deploy.yml, cowork-sync.yml, notam-import.yml
.github/scripts/      notam_import.py
```

### DataBase layout (served at https://spidersqdn.github.io/DataBase/<folder>/)
- `AirNavFlow/`: `thailand.pmtiles` (~260 MB OSM z13) + `elevation.pmtiles` (~117 MB) built by
  workflow (not in git); `ENROUTE.pdf` -> `enroute.pmtiles` (tools/enroute_tiles.py, z5-10);
  `charts/` aerodrome PDFs -> `charts/index.json` (tools/charts_index.py + chart_georef.py).
- `CoWork/`: data shared by AirNavFlow + FalCon2CP: `AD.txt`, `RWY.txt`, `สนามบิน ทบ.txt`,
  `AP.txt`, `places.json` (tools/places_index.py), `AIP/` (eAIP pages as text per AIRAC).
- `FalCon2CP/`: reserved for SPD's other app FalCon2CP (no repo yet).
- New project = new folder + add its name to the `for d in ...` line of the workflow.

## 3. Data rules
- **Master copies of AD.txt, RWY.txt, สนามบิน ทบ.txt are in DataBase/CoWork. Edit there only.**
  AirNavFlow `cowork-sync.yml` copies them to `data/` every 6 h (backup). App load order:
  CoWork -> offline cache -> `data/`.
- AirNavFlow-only data in `data/`: `มทบ.txt`, `CSAR.txt`, `ผบ.ฝูง.txt`.
- AIP data embedded as JS constants in index.html: `AIRSPACES_DB`, `VTBD_*_REPORTING_POINTS`,
  `NOTAM_DB`. Enroute AMDT 09/26, airspace 01 OCT 2026. Source https://aip.caat.or.th/ (public).
- Charts: SPD rule: imported user chart files are NOT stored in the app; read from the picked
  file (Chrome keeps a File System Access handle in IndexedDB; Safari re-picks each session).
  Only georef/opacity/page go in localStorage `fp-charts-v1`.
- Offline place search: index used only when offline AND map downloaded. Online search =
  ICAO -> Nominatim; index only as backup.
- Copyright caution: repos are public (charts, AIP).

## 4. Deploy and automation (all GitHub Actions, no AI needed)
| Workflow | Repo | When | Does |
|---|---|---|---|
| build-map-and-deploy | AirNavFlow | push to main / manual | deploy Pages |
| build-map-and-deploy | DataBase | push, 2nd of month, manual | build pmtiles, indexes, deploy |
| cowork-sync | AirNavFlow | every 6 h | copy CoWork files to data/, redeploy |
| notam-import | AirNavFlow | push to notam/inbox/**, daily 01:00 UTC | convert NOTAM, keep 3 days |
| aip-watch | DataBase | Mon 07:00 + 11:00 UTC | new AIRAC -> CoWork/AIP/ + Issue |

- Pages Source = "GitHub Actions" in both repos.
- A push made with `GITHUB_TOKEN` does not trigger other workflows: call `gh workflow run` after.
- NOTAM path: Google Apps Script (`tools/notam-gmail.gs`, hourly) reads Gmail from
  `rtafbaseopr@gmail.com` (.docx attachment) -> commits `notam/inbox/<id>.json` -> notam-import
  writes `notam/NOTAMyyMMMdd.txt` + `latest.txt`; app auto-loads into layer "Imported NOTAM".
- AEROTHAI NOTAM site needs login: never use or ask for credentials.
- Hosting: GitHub Pages is enough. Pages deploy times out on ~380 MB artifacts, Release assets
  fail CORS: that is why big files are in DataBase.

## 5. How SPD works (standing rules)
- Answers short, token-efficient. Label uncertain content [Inference] / [Speculation] / [Unverified].
- Any .md file under 200 lines (split into a new file if longer).
- Workflow: small PR per change from a branch, SPD merges. Bump `APP_CACHE` in sw.js each time.
- SPD sometimes types English on a Thai keyboard (e.g. "ทำพเำ" = "Merge").
- "Main menu" = the left side panel, not popups.
- Button labels are exact; keep SPD's wording (mix of English caps + Thai).
- Share buttons: `navigator.share({files})` only, no title/text (iOS sends text separately).
- Never commit secrets; tokens live in GitHub/Apps Script settings only.

## 6. App features (where things are)
- **Map:** Leaflet + Protomaps vector (MAP_MAXZOOM 13) from DataBase pmtiles, satellite online.
  Contour (ft) drawn client-side from elevation.pmtiles: 500 ft z10-11, 200 ft z12, 100 ft z13+.
- **Map tap** (On MAP): point + popup Add ROUTE / Add Off-ROUTE W.Pt / CANCEL. Long-press: Lat/Long,
  Radial/DME, elevation, Add buttons, 📋 COPY. Off-route add buttons always named "Add Off-ROUTE W.Pt".
- **Left panel tabs** AIRPORT / LAT/LONG / RADIAL/DME: Add ROUTE | BACK TRACK | Add Off-ROUTE W.Pt.
  BACK TRACK reverses the route in place (press again restores).
- **Lat/Long input:** digits only, LAT 6 = DDMMmm, LONG 7 = DDDMMmm, no N/E; old format accepted.
- **Main/alternate route:** row เส้นทางหลัก | ⇄ | เส้นทางสำรอง | ✕. Globals `pts` (active), `otherPts`,
  `routeActive`; storage `fp-route-v1` {alt, active}. Waypoint `remark` field (Landmark column).
- **Button grid 3x3:** BACK | CLEAR ROUTE | RULER / MINI MAP | MSN CARD | WINDY / SLIDE | EXPORT | IMPORT.
- **MINI MAP:** A4 map (contour, 201 Sqn emblem, waypoint boxes, nearby ADs, profile, DIST/FT),
  editable title, table view + editor (undo, align), PDF / PPT (pptx, TH SarabunPSK) / แชร์.
  Style: main route black line, alt blue dashed; route Wpts green triangles; off-route light blue
  #4da3ff; leg label "180°<XX.X NM>360°"; table heading rows main green / alt blue / off-route 2F80ED.
  ย้ายกล่อง mode moves + resizes boxes. Prefs in `fp-mm-*` keys.
- **MSN CARD:** PNG Pilot Mission Data Card, ELEV column, FUEL default 2200, IAS/FUEL card-only.
- **SLIDE:** 16:9 MISSION OVERVIEW on satellite, TH SarabunPSK, editable fields, PNG + PPT.
- **WINDY:** DEPARTURE | MidWay | DESTINATION.
- **EXPORT/IMPORT:** KMZ / KML / GPX / CSV; export 1 All / 2 within 20 NM / 3 FalCon2CP.
- **MAP box** (yellow): IMPORT MAP (user .pmtiles/PDF/image overlay, opacity inside frame only),
  built-in "ENROUTE (AIP)", checkbox "HIDE ENROUTE Charts / MAPs".
- **CHART box** (orange): 📄 IMPORT CHART, built-in "ชาร์ตในแอพ" from DataBase, georef 2-3 points,
  auto georef from index.json, PDF pages, "HIDE CHARTs", 🗑 RESET.
- **NAVIGATION TRACKING** panel (yellow) above profile: TRACK (Wake Lock) | PPOS | ROUTE | RESET |
  EXPORT; DISTANCE NM, GROUND SPEED KT, FLIGHT TIME, ALTITUDE. PWA stops when backgrounded.
- **Layers:** มทบ., VFR BKK A/C & Helicopter Wpt, RTAF POC (CSAR + ผบ.ฝูง), สนามบิน ทบ., airspace,
  reporting points, Imported NOTAM, rain radar. NOTAM list in side panel hidden by default.
- **Startup defaults:** HIDE CHARTs + HIDE ENROUTE ticked, OFF-ROUTE Wpt layer off.
- **Hide-menu bar:** ◀/▶ left edge (landscape) or ▼/▲ bottom (portrait), remembered.

## 7. Parked / future
- Native app (Capacitor android/ios in this repo, Android APK via Actions, iOS via SPD's Mac):
  parked until SPD says go (planned Dec 2026).
- FalCon2CP will read DataBase/CoWork too.

## 8. Checklist for a code change
1. Branch from `main`, edit `index.html` (search by button label / function name).
2. Bump `APP_CACHE` in `sw.js`.
3. Test in a browser (phone width too: SPD uses iPhone/iPad).
4. Open a small PR with a Thai summary; SPD merges; Pages redeploys in ~2 min.
