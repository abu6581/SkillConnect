# SkillConnect — Smart Service Marketplace

A responsive HTML, CSS and JavaScript mini-project for CSE-2340 MP3–MP4.

## Features
- Skill categories: mason, electrician, plumber, carpenter, painter and cleaner.
- Search profiles by name or skill; filter by category; sort by demo rating.
- Worker cards and profile dialog dynamically rendered from an external API.
- Save/favourite profiles using `localStorage`; saved profiles remain after refresh.
- API loading, error and empty states; responsive layout.

## Run locally
Open `index.html` in a browser. If needed, use VS Code **Live Server**:
1. Open this folder in VS Code.
2. Install the “Live Server” extension.
3. Right-click `index.html` → **Open with Live Server**.

Internet is required for the API and remote photos.

## API
`https://dummyjson.com/users?limit=24`

## Important demo limitation
DummyJSON returns sample users, not real local tradespeople. The app assigns sample skill categories and illustrative experience/ratings to those profiles only to demonstrate API-driven DOM rendering. Do not treat the names, phone numbers, ratings or skill assignments as verified workers. A real marketplace needs worker registration, identity/skill verification, consent, a backend database, secure authentication and a real booking/contact workflow.

## MP3–MP4 checklist
- [x] DOM manipulation and dynamic rendering
- [x] `addEventListener()`, arrays, objects, `filter()`, `forEach()`, `sort()`
- [x] External API with `fetch()`, `async/await`
- [x] Loading, error and empty states
- [x] Local Storage persistence
