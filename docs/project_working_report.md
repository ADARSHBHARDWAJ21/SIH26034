# LM-CompliScan AI 2.0 — How the Project Works

**Problem ID:** SIH26034  
**Ministry:** Ministry of Consumer Affairs, Food & Public Distribution  
**What it is:** A software tool that reads a packaged product label (photo, webcam, or sample) and checks whether the label follows India’s **Legal Metrology (Packaged Commodities) Rules, 2011**.

This report is written for a non-technical reader. Technical names are explained in everyday language.

---

## 1. The problem in one sentence

Every packed item sold in India (chips, milk, soap, electronics, and so on) must print certain facts on the pack: who made it, how much is inside, MRP with “incl. of all taxes”, month/year of packing, customer-care email, country of origin, and so on. Officers cannot check millions of packs by hand. This app tries to **photograph the label, read the text, and flag missing or illegal wording**.

---

## 2. What the product is called and who uses it

The app is named **LM-CompliScan AI 2.0**. It is a **website** (React) plus a small **server** (Node.js / Express).

There are three kinds of users:

| Who | What they get |
| :--- | :--- |
| **Guest** | Can try the scanner without logging in |
| **Official Inspector** | Full scanning, penalty estimates, batch audits, analytics, official-style PDF notice |
| **Consumer** | Same scanning, but reports are framed as a consumer verification certificate |

Demo logins (seeded in the database): inspector `inspector@metrology.gov.in` / `admin123`, consumer `consumer@gmail.com` / `user123`.

---

## 3. The big picture: two halves of the system

Think of a **front shop** and a **back office**.

```
YOU (browser)
    │
    ├── Front shop (React + Vite)
    │     Upload photo / camera / sample / e-com URL
    │     Clean the image → Read the text (OCR) → Apply legal rules
    │     Show score, boxes on the photo, violations, PDF
    │
    └── Back office (Express on port 5000)
          Save login users
          Save each inspection so Batch + Analytics can show history
```

- **Front end** does the hard work of “seeing” the label. OCR runs **in the browser** (Tesseract.js). The photo does not have to be sent to a cloud AI service for reading.
- **Back end** mainly **stores** users and scan results in a JSON file (`server/data/metrology_database.json`).

Run both together with `npm run dev:all` (Vite UI + API server).

---

## 4. Folder structure (the “map” of the project)

```
project/
├── src/                         ← everything the user sees
│   ├── App.jsx                  ← main screen + 4 tabs
│   ├── main.jsx                 ← starts React
│   ├── index.css                ← look and feel (glass theme, day/night)
│   ├── engine/                  ← the “brain”
│   │   ├── imagePreprocessing.js
│   │   ├── ocrProcessor.js
│   │   ├── metrologyRulesEngine.js
│   │   ├── reportGenerator.js
│   │   ├── sampleData.js
│   │   ├── apiService.js
│   │   └── authService.js
│   └── components/              ← screens and buttons
│       ├── Navbar.jsx
│       ├── Auth/
│       ├── Scanner/
│       ├── Inspection/
│       ├── Batch/
│       ├── Analytics/
│       └── Rulebook/
├── server/
│   ├── index.js                 ← REST API
│   ├── db.js                    ← read/write JSON database
│   └── data/metrology_database.json
└── docs/                        ← this report and other write-ups
```

**How to read this:** `components` = screens. `engine` = logic. `server` = memory and login.

---

## 5. The four main screens (tabs)

The top navigation has **4 tabs**. That is the whole app from a user’s view.

1. **Packaging Scanner** — inspect one pack (this is the main workflow).
2. **Batch Inspector** — list of many past scans (warehouse-style).
3. **Audit Analytics** — charts and risk-style summaries from saved scans.
4. **Rules & Penalties** — searchable handbook of Rule 6, font-size helper, Section 36 fines.

Extra UI around those tabs:

- Day / night theme (saved in the browser).
- Login / signup modal (Official vs Consumer).
- Webcam modal.
- E-commerce URL modal.

---

## 6. How a scan actually works (step by step)

This is the heart of the project. Imagine an officer taking a photo of a chips packet.

### Step 1 — Choose an input (4 ways)

| Input | What happens |
| :--- | :--- |
| **Benchmark sample** | Ready-made demo products (already analysed). Fast for demos. No OCR wait. |
| **Upload image** | Drag-and-drop or pick a file of a real label. |
| **Live camera** | Webcam snapshot, then same pipeline as upload. |
| **E-commerce link** | If the URL is a direct image (`.jpg`, `.png`, etc.), that image is scanned. If it is a product page URL, the demo currently falls back to a sample image (it does not scrape Amazon/Blinkit). |

### Step 2 — Clean the photo (`imagePreprocessing.js`)

Real photos are often dark, shiny, or small. Before reading text, the app:

1. Loads the picture onto a hidden HTML canvas (like an invisible drawing board).
2. Enlarges small images (toward ~1200 px) or shrinks huge ones (cap ~1800 px) so OCR works better.
3. Turns colour into **grey** using a standard formula: more weight on green than red/blue (how human eyes see brightness).
4. Boosts **contrast** so letters stand out from the pack background.
5. Hands a cleaned PNG to the OCR engine.

This is not “AI” in the ChatGPT sense. It is pixel maths so the text-reader has an easier job.

### Step 3 — Read the letters (`ocrProcessor.js` + Tesseract.js)

**OCR** means Optical Character Recognition: software that looks at pixels and guesses English letters.

- A Tesseract worker is started with the **English** language pack.
- It returns: the full text, each line, and a **box** (x, y, width, height) around each line.
- Those boxes are converted to **percentages** of the image, so they still sit on the photo if the window is resized.
- Each line is labelled as MRP, Net Quantity, Manufacturer, etc., using simple keyword checks.

If Tesseract finds no line boxes, the app draws fallback boxes stacked down the photo from the raw text lines.

### Step 4 — Apply the law (`metrologyRulesEngine.js`)

This module does **not** use a large language model. It uses **pattern matching** (regular expressions) and checklists.

It looks for 8 declaration groups:

| Rule | What the pack must show | Typical fail |
| :--- | :--- | :--- |
| 6(1)(a) | Maker / packer / importer + address | No address; weak PIN |
| 6(1)(b) | Common name of the product | Nothing that looks like a name |
| 6(1)(c) | Net quantity in legal units | `gms`, `ltr`, `pcs` instead of `g`, `L`, `N` |
| 6(1)(d) | Month and year of manufacture/packing | No date |
| 6(1)(e) | MRP + “incl. of all taxes” + ₹ / Rs | Price without tax wording |
| 6(1)(f) | Consumer care, **email required** | Phone only, no email |
| 6(1)(g) | Country of origin | Not found |
| 6(11) | Unit sale price (₹ per g / ml / piece) | Missing (usually a warning, not a hard fail) |

Scoring starts at **100**. Points are subtracted for each miss (critical misses cost more). Then a status is assigned:

- **COMPLIANT** — no serious violations and score ≥ 70  
- **PARTIALLY_COMPLIANT** — some issues, but not a critical fail  
- **NON_COMPLIANT** — a critical violation **or** score below 70  

Penalty text is attached from **Section 36** of the Legal Metrology Act, 2009 (first offence up to ₹25,000 per violation; repeat up to ₹50,000 or jail wording). The app **estimates**; it does not issue a court order.

### Step 5 — Show results on screen

- **Score card** — big status and percentage.
- **Bounding box viewer** — coloured rectangles on the photo; click a box to see why it failed.
- **Declaration grid** — tick / cross for each mandatory field.
- **Violation list** — rule number, severity, legal reference, fine estimate.

### Step 6 — Remember the inspection

The browser calls `POST /api/scans`. The server writes the record into the JSON database. That is why Batch Inspector and Analytics can show history after a refresh.

### Step 7 — Optional PDF

`reportGenerator.js` (jsPDF) builds a one-page-style **Official Packaged Commodity Compliance Report** with inspection ID, date, score, violations, and penalty notes. Rupee signs are converted to `Rs.` so PDF fonts do not break.

---

## 7. How the “engine” is made (the technical core, in plain words)

The engine is a **pipeline of four small programs**, not one mysterious AI box.

```
Photo  →  Cleaner  →  Text reader  →  Rules checker  →  Score + PDF + Database
```

| Piece | Library / method | Job |
| :--- | :--- | :--- |
| Image cleaner | HTML5 Canvas, pixel loop | Grey + contrast |
| Text reader | **Tesseract.js** | English OCR + line boxes |
| Rules checker | Custom JavaScript parsers | Match Rule 6 / Section 36 |
| PDF | **jsPDF** | Downloadable notice |
| Storage | Express + JSON file | Users and scans |
| UI | React 18, Vite, Tailwind-style CSS | Screens |

**Important honesty for a normal reader:**  
“AI 2.0” in the product name mainly means **computer vision OCR + rule automation**. The legal engine is a **ruleset**, like a checklist a junior inspector would follow, encoded as search patterns. It can miss badly printed labels or unusual layouts. Benchmark samples skip live OCR so demos stay reliable.

---

## 8. Feature inventory (what you can actually do)

Rough count of **user-facing features: about 16**. System pieces underneath: about 6 more.

### A. Inspection inputs (4)

1. Ready-made benchmark packs  
2. File upload / drag-and-drop  
3. Webcam capture  
4. Image URL / e-commerce URL (limited)

### B. Inspection results (5)

5. Compliance score and status  
6. Interactive boxes on the label photo  
7. Mandatory-declaration matrix (pass/fail per field)  
8. Violation + warning list with rule citations  
9. Section 36 penalty wording

### C. Extra modules (4)

10. Batch inspection table (history, bulk save)  
11. Analytics dashboard (trends from stored scans)  
12. Rulebook search + **font-height calculator** (Rules 7/8 by pack face area in cm²)  
13. Official / consumer PDF download

### D. Account and chrome (3)

14. Login / register with Official vs Consumer role  
15. Day / night theme  
16. Guest mode without login

### E. Platform (not buttons, but part of “how many parts”)

- REST API: register, login, list/create/delete scans, batch create  
- File-backed database with seed users and sample audits  
- CORS + large JSON body limit (50 MB) so images can be stored as data URLs if needed

---

## 9. How the legal engine decides “illegal units”

A very common real-world cheat is writing **150 gms** instead of **150 g**.

The checker keeps two lists:

- **Allowed:** `g`, `kg`, `ml`, `l`/`L`, `N`, `U`, plus `cm`, `m`  
- **Not allowed:** `gms`, `gm`, `grm`, `kilo`, `ltr`, `ltrs`, `doz`, `pcs`, `milli-litres`

If the number is found but the unit is on the illegal list, Rule **6(1)(c)** is marked **CRITICAL**.

Similar pattern checks exist for tax clause, email, PIN code, “Made in / Country of Origin”, and unit sale price.

---

## 10. Backend and database (the memory)

`server/db.js` does **not** currently use SQLite in the running path, even though `sqlite3` is listed in package.json. Live storage is a **JSON file** that is written atomically (write a full copy of users + scans).

API sketch:

| Method | Path | Meaning |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Create account (or log in if email exists) |
| POST | `/api/auth/login` | Sign in; can auto-create a new user |
| GET | `/api/auth/me` | Current user from a mock token |
| GET | `/api/scans` | All saved inspections |
| POST | `/api/scans` | Save one inspection |
| POST | `/api/scans/batch` | Save many at once |
| DELETE | `/api/scans/:id` | Remove one record |

Tokens are **demo tokens** (`mock-jwt-token-…`), not full production JWT security. Passwords in the seed file are stored in a demo-friendly way. Treat this as a **hackathon prototype**, not a live government production system.

---

## 11. Typical demo walk-through

1. Open the app, log in as Inspector.  
2. Click the sample **Crispy Crunch Potato Chips 150g**.  
3. Score is typically **62% NON-COMPLIANT** because of `gms`, missing tax clause, missing care email.  
4. Click the red box on “150 gms” to see the rule explanation.  
5. Download the PDF notice.  
6. Open **Batch Inspector** to see records stored by the API.

---

## 12. What this system is good at vs what it is not

**Good at**

- Teaching and demonstrating Rule 6 checks quickly  
- Turning a reasonably clear English label photo into a structured pass/fail  
- Showing officers *where* on the pack a problem sits  
- Keeping a simple history of inspections  

**Not (yet) a full legal verdict**

- OCR can misread shiny or Hindi-only packs (engine is English Tesseract)  
- E-commerce “inspect this Amazon page” does not fully scrape listings  
- Auth and database are prototype-grade  
- Penalties are **estimates** from statute wording, not case-specific compounding orders  

---

## 13. One-page summary you can remember

**LM-CompliScan AI 2.0** is a Smart India Hackathon prototype for **SIH26034**. A user gives a pack photo. The browser **cleans** the image, **reads** English text with Tesseract, then a **rules engine** ticks the eight main Legal Metrology declarations. The screen shows a score, boxes on the photo, and a fine estimate. A Node server **saves** the result. There are **4 main tabs** and about **16 user features**. The “engine” is a **four-stage pipeline** (clean → OCR → rules → report), not a black-box generative AI.

---

*Document generated from the project source (`src/engine`, `src/App.jsx`, `server/`, and existing architecture notes).*
