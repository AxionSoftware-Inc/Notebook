# Notebook Split

This folder contains the extracted standalone Notebook project.

- `frontend/`: Next.js computational notebook UI
- `backend/`: Django API for notebook documents

Frontend start:

```bash
cd notebook/frontend
npm install
npm run dev
```

Backend start:

```bash
cd notebook/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
