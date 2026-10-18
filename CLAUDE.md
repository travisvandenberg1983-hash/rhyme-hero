# Rhyme Hero

A comic-book-styled rhyming **skill coach**. Two halves:

- `web/` - React + Vite + TypeScript + Tailwind v4, installable PWA.
- `engine/` - Python 3.11 FastAPI service that does all the language work.

## Permanent rules

These rules apply to every change in this repo. Do not relax them, even if asked in passing; if a request conflicts with one, point out the conflict and ask.

### 1. Coach, never ghostwriter

The app is a rhyming SKILL coach. It must **never generate finished lines or verses** for the user.

- Allowed: single words, word banks, rhyme patterns (e.g. AABB, ABAB), stress markers, syllable counts, pauses/beat markers, and questions that prompt the user to think.
- Not allowed: complete lines, couplets, verses, bars, "example lines", autocomplete of a user's line, or rewriting the user's line for them - from the engine, from the UI, from seed data, placeholder copy or tests.
- Engine endpoints that return suggestions must pass lists through `engine/app/guardrails.py` (`single_words`) or an equivalent guard, and tests should assert the single-word contract.

### 2. Comic book superhero visual style

- Halftone dot backgrounds, thick black outlines, panel layouts, speech bubbles for hints, onomatopoeia bursts (POW!, ZAP!, KRAK!).
- Fonts: **Bangers** for display/headings, **Comic Neue** for body text.
- Primary palette: red `#e3262e`, blue `#1f4fd1`, yellow `#ffd400`, plus ink `#111` and paper `#fffdf5`. Tokens and utilities (`panel`, `halftone`, `speech-bubble`, `burst`) live in `web/src/index.css` - reuse them rather than inventing one-off styles.
- **No existing Marvel/DC (or other licensed) characters**, names, logos or likenesses. Original characters only.

### 3. Engine and UI stay separate

- The UI only talks to the engine through its HTTP API. All calls go through `web/src/api/engine.ts`; the base URL comes from `VITE_ENGINE_URL`.
- No shared code, imports or files between `web/` and `engine/`. No rhyme/phonetics logic in the UI.
- API routes are versioned under `/api/v1/`. Changing a response shape means updating both the Pydantic model and the TypeScript type.

## Commands

| Task | Where | Command |
| --- | --- | --- |
| Run engine | `engine/` | `uvicorn app.main:app --reload --port 8000` |
| Test engine | `engine/` | `pytest` |
| Run UI | `web/` | `npm run dev` |
| Type-check UI | `web/` | `npm run typecheck` |
| Build UI | `web/` | `npm run build` |

See `README.md` for first-time setup.
