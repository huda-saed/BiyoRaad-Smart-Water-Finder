# BiyoRaad - Smart Water Finder (Frontend) - Somaliland

BiyoRaad is built for **Somaliland**. All sample water sources are in Somaliland (Hargeisa, Berbera, Burao, Borama, Gabiley, Erigavo, Las Anod, Sheikh, Odweyne, Zeila) across the regions Maroodi Jeex, Sahil, Togdheer, Awdal, Sanaag and Sool. The office is in Hargeisa.

Static frontend: HTML5, CSS3, JavaScript, Bootstrap 5, Leaflet.js + OpenStreetMap, Chart.js.
No backend, no database. All data is sample data in `assets/js/data.js`.

## Run
1. Unzip the folder.
2. Open `index.html` in a browser (or run `python -m http.server 8000` inside the folder and visit http://localhost:8000).
3. An internet connection is needed: Bootstrap, icons, fonts, Leaflet, Chart.js and map tiles load from CDNs.

## Demo accounts
On `login.html`, use **Open as community member** or **Open as administrator**.
(Typing any email containing "admin" also logs in as admin.) Login state, language and edits are kept in `localStorage`.

## Pages (15)
index, about, register, login, dashboard, sources, map, source-details (?id=), report, my-reports, profile, admin, manage-sources, manage-reports, contact.

## Structure
```
index.html, *.html     pages (shared shell: #nav, #side, #foot)
assets/css/style.css   theme (blue/teal variables at top)
assets/js/data.js      sample sources and reports
assets/js/i18n.js      English / Somali dictionary (generated; edit keys freely)
assets/js/core.js      navbar, sidebar, footer, toast, demo auth, form handling
assets/js/pages.js     one function per page (data-page attribute on <body>)
```

## Maps and OpenStreetMap labels
Maps open centred on Hargeisa (`SL_CENTER`, `SL_ZOOM` in `data.js`). Tiles, place names and borders are drawn by OpenStreetMap and are **not controlled by this project**, so labels such as country names may differ from local naming. The map page shows a short note about this.

## Sample data
Edit `assets/js/data.js` (sources, reports, `SL_REGIONS`, `SL_STATS`). Sample records only; coordinates are approximate town locations. Bump `DATA_VERSION` after changing sample data so browsers drop older saved copies from `localStorage`.

## Language
EN / SO switch in the navbar; choice is saved. Add text with `data-i18n="key"` and a key in `i18n.js`.

## Django integration notes
- Move HTML into `templates/`, extend one `base.html` (navbar/footer markup is in `core.js`; copy into the template) and move `assets/` to `static/`.
- Replace `getSources()` / `getReports()` in `core.js` with `fetch('/api/...')` calls, and replace the `FORMS` handlers in `pages.js` with real form POSTs.
- Replace the localStorage demo login (`br_role`) with Django sessions.
