# Portfolio UI Redesign + Full Repo Audit — Claude Code Prompt

**Skill to load first:** `/mnt/skills/public/frontend-design/SKILL.md` — read it before writing any code. Use it as your design constitution throughout this task.

---

## Role & Goal

You are doing two things for a full-stack portfolio (Next.js 16 + React 19 + Tailwind v4 + Express 5 + Mongoose 9):

1. **Redesign the UI** into something organic, unique, modern, and minimal — Awwards-caliber restraint, not flash.
2. **Audit the entire repo recursively and fix every bug, dead code path, and inconsistency you find** — frontend, backend, migration scripts, empty files, unused files, misconfigurations, everything.

Both deliverables happen in the same pass. The redesign is the headline; the audit is the foundation underneath it.

---

## Part 1 — Full Repo Audit (do this first)

Before touching design, walk the repo top-to-bottom and build a bug inventory. Report findings in chat **before fixing**, grouped by severity. Then fix them as part of the same work.

**Scope:** every file in the repo except `node_modules/`, `.next/`, `dist/`, and `seeds/`. That includes:
- `app/` (all pages, components, API routes)
- `server/` (controllers, models, `app.ts`, `migrate.ts`, `util.ts`)
- Config files: `tsconfig.json`, `tsconfig.server.json`, `next.config.ts`, `nodemon.json`, `postcss.config.mjs`, `package.json`, `.gitignore`
- Root-level strays: `util.tsx`, `util.js` (yes, both exist — that's a bug on its own)
- Empty or stub files (e.g. `server/controllers/userController.ts` is empty, `server/models/User.ts` has no `export default` and no model registration)

**Categories to check (non-exhaustive — find more):**

- **Correctness bugs:** invalid JSX nesting (`<a><button>` on `/resume`), `"use client"` on the root layout (breaks Next 16 metadata), duplicate `util.tsx` + `util.js` + `server/util.ts` (three copies of the same regex/enum — consolidate), typos in visible copy ("buiiilding" on home, verify all user-facing strings), `<img>` used instead of `next/image` for remote icons (performance + CLS), `key={Math.random()}` in `app/components/CRUD/List.tsx` (anti-pattern, breaks React reconciliation).
- **TypeScript hygiene:** `strict: false` in `tsconfig.json` — enable strict mode or at minimum `strictNullChecks` + `noImplicitAny`. Remove all `as any` casts in the controllers (several in `languages.ts` and `project.ts` `$in` / `$pull` / `$addToSet` calls — type them correctly with Mongoose's generics). Server `tsconfig.server.json` is missing strict mode entirely.
- **Dead code:** empty `userController.ts`, unregistered `User` model (schema defined but `mongoose.model(...)` never called, nothing exported), `List.tsx` component that appears unused, commented-out PASSWORD_REGEX validator, `Ideas.txt` file shipped in `app/` (move to `/docs` or delete).
- **Security & hygiene:** `.gitignore` is good but verify no `.env` has been committed historically (check `git log --all -- .env`). CORS is imported in `app.ts` but never registered as middleware. `cookie-parser` is imported but never used. `body-parser` is imported but Express 5 has `express.json()` built in — replace. No rate limiting, no `helmet`, no central error-handling middleware (an unhandled async throw in a controller will hang or crash — add a catch-all error middleware).
- **Mongoose correctness:** `ILanguage.projects` is typed `mongoose.Types.ObjectId[] | IProject[]` but in the frontend it's accessed as `(lang.projects as any[]).length` — tighten the type and kill the cast. `URL_REGEX` validator is applied to `qrCode` and `description` fields that default to `null`, which means validation runs on null and may throw — add `if (!value) return true;` guards or make validators conditional.
- **Build & config:** `nodemon.json` runs `tsc` on every change without incremental mode — add `--incremental` and a `.tsbuildinfo` path in `tsconfig.server.json`. Verify `next-env.d.ts` references aren't stale.
- **Dead environment variables:** `NEXT_CLIENT_API_URL` is used in proxy routes; `NEXT_PUBLIC_API_URL` is declared in `CLAUDE.md` — confirm whether the latter is actually consumed from the browser. If not, remove from docs.
- **Content / UX bugs:** "Remy Post" hero has triple-stacked paragraphs that are redundant and contain a typo. "Certifications" card says "Coming soon" — either remove or make conditional on real data. `/resume` iframe uses `#toolbar=0&navpanes=0` which is non-standard and browser-dependent — verify and add graceful fallback.
- **Accessibility:** icon-only buttons missing `aria-label` (audit every one). Images with `alt=""` — verify intent. Color contrast on `text-slate-300` / `text-slate-400` against white may fail WCAG AA.
- **Performance:** no `loading="lazy"` on icon images, no `sizes` attribute, entire language and project lists fetched on every page via `AppContext` — flag.

**Output format for the audit:**

```
## Audit Report

### Critical (breaks functionality or security)
1. <file>:<line> — <what> — <fix>
…

### Major (incorrect behavior, type safety, dead code)
…

### Minor (style, consistency, polish)
…

### Design-blocking (must fix before/during redesign)
…
```

Fix everything in Critical, Major, and Design-blocking. Fix Minor ones unless they balloon scope — in which case list them clearly for me to triage.

---

## Part 2 — UI Redesign

### Hard constraints

1. **Backend API shapes stay identical.** You can refactor controllers for type safety and audit fixes, but request/response contracts must not change. The frontend must continue consuming `/api/v1/languages` and `/api/v1/projects` the same way.
2. **Tailwind v4 only.** No `tailwind.config.js`. All theming in `app/globals.css` via `@theme { }`. PostCSS plugin stays `@tailwindcss/postcss`.
3. **Preserve routes:** `/`, `/aboutMe`, `/techStack`, `/techStack/[id]`, `/projects`, `/projects/[id]`, `/resume`.
4. **Preserve features:** filter controls on `/techStack` and `/projects`, proficiency dots, language↔project bidirectional linking, resume PDF iframe + download, mailto contact, GitHub/LinkedIn social links.
5. **Accessibility:** keyboard focus states, alt text, semantic landmarks (`<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`), aria-labels on icon-only buttons. WCAG AA contrast minimum.
6. **Responsive down to 375px.**
7. **No `localStorage` / `sessionStorage`.**
8. **`npm run dev` must work unchanged.** TypeScript compiles clean under strict mode.

### Aesthetic direction

**Monochrome, subtle, organic.** This is the through-line. The general UI — body copy, buttons, borders, icons (nav / footer / social), section labels, filter controls — lives entirely in the slate ramp. Warm off-white page background against slate-900 type. Hairline borders instead of heavy shadows. Generous whitespace. No accent color anywhere in chrome.

**The one exception is language brand color, and it only wakes on interaction.** The `colour` field on each Language document is real data and belongs to the language itself, not the design. Treatment:

- **At rest:** language icons render fully desaturated (`filter: grayscale(1)` or equivalent), or tinted with a slate wash. No color-hint borders, no dots, no accent strips. The UI looks uniformly monochrome until the user engages with it.
- **On hover, focus, or active route:** the icon transitions to full brand color over ~300ms, and any associated accent (a hairline rule, a small dot, a left-edge indicator — your call based on the layout) appears with it. When the user moves away, it returns to grayscale.
- **On the detail page `/techStack/[id]`:** treat the current language as the active subject — its icon renders in full color at rest because it *is* the focus. All sibling / related languages on the same page stay monochrome until hovered.
- **Language badges inside project cards / lists:** follow the same rule — grayscale at rest, color on hover.

This gives the portfolio a quiet monochrome signature with color reserved as a reward for attention.

### Typography

Replace Instrument Serif + DM Sans. Pick what you think is best given the aesthetic — but avoid the overused / AI-cliché defaults: **Inter, Roboto, Arial, system-ui, Space Grotesk, Poppins, Montserrat, DM Sans, Instrument Serif.** Free to use Google Fonts, Fontshare, or self-hosted. One display, one body, optionally one mono for metadata and section numbers. Commit to the pairing and use it confidently.

### Motion — subtle and relevant

- One orchestrated page-load reveal per page with staggered `animation-delay`. Refine the existing `fade-up` pattern; don't scatter micro-interactions.
- Hover rewards: hairline rules that draw in, arrows that slide, monochrome icons that saturate to their brand color, labels that shift. Nothing bouncy.
- Respect `prefers-reduced-motion: reduce` everywhere — disable transforms and 3D, keep opacity fades only. Three.js scene must pause or render a static fallback.

### Three.js signature element

Three.js is explicitly wanted. Treat it as a design decision, not a checklist item — you decide where it earns its place and what form it takes, based on the aesthetic direction you commit to. It must reinforce the monochrome-organic feel and look like it belongs to this specific portfolio and nowhere else. Propose your approach in the design plan (Step 2) and justify the placement.

**Technical requirements (non-negotiable):**
- Vanilla Three.js (latest stable from npm), not `react-three-fiber`. Pin the version in `package.json`.
- Lazy-load via dynamic import. Page is fully usable without it; scene fades in once loaded.
- Dispose geometries, materials, textures, and the renderer on unmount. No leaks across route changes.
- Target 60fps on a mid-range laptop. `requestAnimationFrame`, pause when tab is hidden (`document.hidden`), stop the loop when canvas is off-screen (`IntersectionObserver`).
- Monochrome-first palette: the scene renders in the slate ramp at rest. Any color shift is subtle and tied to a meaningful interaction.
- Mobile: either a simpler scene or a static pre-rendered fallback image below 768px — your call. Don't ship a laggy scene to phones.
- Accessibility: `prefers-reduced-motion` disables animation or replaces with a static frame. Canvas gets `aria-hidden="true"` since it's decorative.
- Performance budget: Three.js + scene code ≤ 150KB gzipped. Go over → simplify.

### Spatial composition & depth

- Lean harder into the existing `xl:grid-cols-[1fr_3fr]` asymmetric pattern. Sticky sidebar, free-scrolling content column.
- Editorial index lists (01—06) instead of card grids for projects and featured work. The current card grid is the most generic part of the existing design — kill it.
- Hairline rules as the primary visual separator. Shadows reserved for hover-lift on interactive elements only.
- Warm off-white background with an optional 3-6% opacity SVG grain overlay for depth — test it; drop if it adds noise without benefit.
- Oversized section numbers or labels set in mono type in the margin where space allows.

### Per-page direction

**`/` (home)** — Authored hero, not templated. One strong sentence, not three. Featured projects as an editorial index list (large serif names, short descriptions, hairline rules between entries). Top 8 tech stack icons with the grayscale-to-color hover treatment. Quiet contact line. Three.js signature element likely lives here in the hero's negative space if that's where you decide it belongs.

**`/aboutMe`** — Reads like a short essay. 2-3 tight paragraphs of real bio prose at top (rewrite the current typo-laden copy). Proficiency groups as a clean two-column list, not pill soup. Education and Certifications as margin notes — if Certifications has no real data, remove the card rather than shipping "Coming soon."

**`/techStack` (index)** — Filter bar as a sidebar table of contents (vertical list, counts right-aligned, hairline separators). Icon grid with the grayscale-to-color hover pattern. Proficiency dots visible on hover or on the detail page, not always.

**`/techStack/[id]`** — Definition-page treatment. Large serif language name, icon at scale in full color (this is the active subject). One paragraph of description with room to breathe. Related technologies as inline text links, not pills. Associated projects rendered as the same editorial index list used on home.

**`/projects` (index)** — **No card grid.** Editorial list: large serif project name, short description on second line or right-aligned, language badges as small mono tags using the grayscale-to-color hover pattern. Thin hairline between entries. Filter bar matches `/techStack`'s sidebar TOC style.

**`/projects/[id]`** — Keep the two-column split but enlarge the project name, let the description breathe, move "Built with" into a sidebar list with hover-color icons. Hairline-outline buttons for GitHub and Live Site, not filled slabs.

**`/resume`** — Minimal chrome around the PDF. Page label, one sentence, two quiet buttons, then the iframe in a thin-bordered frame. Fix the invalid `<a><button>` nesting identified in the audit.

**`Nav`** — Text-only on desktop with a tiny active underline (not the current pill backgrounds). Icon fallback on mobile. Monogram "RP" in the serif, used confidently.

**`Footer`** — Tighten. Hairline rules. Same index-style language as the rest of the redesign.

**`layout.tsx`** — Remove `"use client"`. Move `AppProvider` into a new `app/providers.tsx` client component. Use the Next.js `metadata` export for title/description instead of raw `<title>` in `<head>`. Keep the favicon SVG.

---

## Working method

### Step 1 — Audit report
Produce the full audit report (format shown above). **Stop and wait for go-ahead** before fixing anything.

### Step 2 — Design plan
Once the audit is approved, produce a design plan covering:
- Font pairing (display + body + optional mono), with import source.
- Monochrome palette: exact background, surface, border, primary text, muted text hex values.
- Where the Three.js scene lives, what it is conceptually, the technical approach (geometry, lighting, interaction, fallback).
- File-by-file checklist of redesign changes.
- Dependencies added or removed with sizes.

**Stop and wait for go-ahead** before writing redesign code.

### Step 3 — Implementation
Implement in this order, pausing for review between phases:

**Phase A — Foundations & audit fixes**
1. Apply audit fixes across the repo.
2. Consolidate `util.tsx` + `util.js` + `server/util.ts` into a single shared source with clear module boundaries.
3. Enable TypeScript strict mode on both configs and resolve resulting errors.
4. `app/globals.css` — new theme tokens, fonts, base styles.
5. `app/layout.tsx` + new `app/providers.tsx` client wrapper with proper Next.js metadata.

**Phase B — Shared components**
`Nav`, `Footer`, `PageHeader`, `SectionLabel`, `Language`, `LanguageBadge`, `Project`, `BackLink`, `LoadingSpinner`, `NotFound`.

**Phase C — Pages**
In order: `/`, `/projects`, `/projects/[id]`, `/techStack`, `/techStack/[id]`, `/aboutMe`, `/resume`.

**Phase D — Three.js signature**
Last. Lazy-loaded, performance-tested, disposed correctly, reduced-motion-safe.

At each phase boundary, summarize changes in 3-5 bullets and wait for feedback.

### Step 4 — Verification checklist
Before declaring done, verify each item and report results:

- [ ] `npm run dev` starts both server and client cleanly
- [ ] Both TypeScript projects compile under strict mode with zero errors
- [ ] Every route renders with live data from the Express backend
- [ ] Every audit Critical and Major item is resolved; Minor items triaged
- [ ] "buiiilding" typo fixed; all visible copy proofread
- [ ] `<a><button>` invalid nesting on `/resume` fixed
- [ ] `"use client"` moved off root layout; Next.js `metadata` export in use
- [ ] `util.tsx` / `util.js` / `server/util.ts` consolidated
- [ ] Empty `userController.ts` removed or implemented; `User` model registered or removed
- [ ] `List.tsx` either wired up or deleted
- [ ] `Ideas.txt` moved out of `app/` or deleted
- [ ] `cookie-parser`, `body-parser`, `cors` usage rationalized
- [ ] Central Express error-handling middleware in place
- [ ] No `as any` casts remain in controllers
- [ ] No `key={Math.random()}` patterns remain
- [ ] `prefers-reduced-motion: reduce` disables all motion including Three.js
- [ ] Three.js: disposes on unmount, pauses when hidden, under 150KB gzipped, 60fps desktop, mobile fallback
- [ ] Language icons grayscale at rest, saturate to brand color on hover / focus / active
- [ ] No `localStorage` / `sessionStorage` usage
- [ ] Keyboard tab order logical on every page; focus rings visible
- [ ] WCAG AA contrast passes on all text
- [ ] Lighthouse on `/`: Performance ≥ 90, Accessibility ≥ 95 desktop
- [ ] Lighthouse on `/`: Performance ≥ 80 mobile

---

## What "done" looks like

A portfolio where a senior designer says: "Every choice is intentional." A codebase where a senior engineer says: "No dead code, no casts, strict types, disciplined Three.js moment." Monochrome restraint with color reserved for the data that deserves it. Nothing by accident. Default to removing.

Begin with the audit report. Do not write any code until I've reviewed it.
