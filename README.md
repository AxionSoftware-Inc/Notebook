# Notebook Platform

Standalone computational notebook product with a Django API and a Next.js workspace.

## Architecture

- `app/` route layer only
- `features/` product features and domain UI
- `widgets/` cross-page layout pieces
- `components/` shared reusable UI
- `lib/` client data access and utility logic
- `backend/` Django API and persistence

## Current Frontend Boundaries

- `app/layout.tsx`: shell, fonts, theme provider, top navigation
- `app/page.tsx`: route entry for the notebook workspace
- `features/notebook/ui/computational-notebook.tsx`: main notebook workspace
- `widgets/layout/site-navbar.tsx`: global top navbar and theme toggle
- `components/`: shared UI pieces used by multiple features

## Backend

The backend runs locally with SQLite by default and can switch to PostgreSQL by setting `DB_ENGINE`.

## Run

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
backend/.venv/bin/python backend/manage.py migrate
backend/.venv/bin/python backend/manage.py runserver
```

## Extension Rules

- Put new screens in `app/`
- Put new product domains in `features/<domain>/`
- Put app-wide layout pieces in `widgets/`
- Put shared visual primitives in `components/`
- Put API wrappers and pure helpers in `lib/`
- Keep backend models, serializers, and endpoints inside `backend/`
