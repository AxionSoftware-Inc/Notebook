# Notebook Platform

`Notebook` is a structured computational notebook product with typed blocks, snapshot history, queued execution jobs, and a production-ready Next.js + Django stack.

## Product shape

- `public read / authenticated write`
- typed notebook blocks instead of one generic cell model
- autosave snapshots plus named checkpoints
- queued execution jobs with persisted history
- Docker VPS deployment path for private beta

## Architecture

### Frontend

- `app/`: route shell only
- `features/notebook/core/`: session state, runtime, plugin contracts, types
- `features/notebook/ui/`: notebook workspace UI
- `lib/`: API/auth adapters and pure helpers
- `widgets/`: app shell and navbar

### Backend

- `backend/notebook/models.py`: documents, snapshots, execution records, execution jobs, imports
- `backend/notebook/views.py`: ownership-aware CRUD, restore, execute, capability discovery
- `backend/notebook/management/commands/process_execution_jobs.py`: background worker loop
- `backend/project/settings.py`: production-safe defaults, PostgreSQL/Redis wiring, upload limits

## Local development

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
backend/.venv/bin/python backend/manage.py migrate
backend/.venv/bin/python backend/manage.py runserver
```

Optional local worker:

```bash
backend/.venv/bin/python backend/manage.py process_execution_jobs --poll-interval 1.5
```

## Authentication

- JWT login: `POST /api/token/`
- token refresh: `POST /api/token/refresh/`
- current session: `GET /api/notebook/auth/session/`
- dev demo bootstrap: `POST /api/notebook/auth/bootstrap-demo/` when `DJANGO_DEBUG=True`

Anonymous users can read only notebooks marked `public_read`. Write, execute, checkpoint, and restore operations require authentication and ownership.

## Execution model

- lightweight previews stay local in the browser
- compute submissions create queued `NotebookExecutionJob` records
- the worker processes jobs and writes `NotebookExecutionRecord` history
- stale blocks never auto-run downstream execution

## Production deployment

Production stack files included:

- [Dockerfile](/Users/macbookpro/Documents/Notebook/Dockerfile)
- [backend/Dockerfile](/Users/macbookpro/Documents/Notebook/backend/Dockerfile)
- [docker-compose.prod.yml](/Users/macbookpro/Documents/Notebook/docker-compose.prod.yml)
- [ops/nginx.conf](/Users/macbookpro/Documents/Notebook/ops/nginx.conf)
- [docs/deployment-vps.md](/Users/macbookpro/Documents/Notebook/docs/deployment-vps.md)

Services:

- Next.js standalone app
- Django + Gunicorn API
- PostgreSQL
- Redis
- execution worker
- nginx reverse proxy

## CI

GitHub Actions runs:

- frontend lint
- frontend test
- frontend build
- backend migrate/check/test

Workflow file: [.github/workflows/ci.yml](/Users/macbookpro/Documents/Notebook/.github/workflows/ci.yml)

## Extension rules

- add new product logic under `features/notebook`
- add new block kinds through the typed plugin registry
- keep route files thin
- keep backend API contracts stable for plugin consumers
- prefer new services/endpoints over adding more switch logic into the workspace
