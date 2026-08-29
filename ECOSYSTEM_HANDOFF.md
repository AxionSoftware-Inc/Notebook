# Ecosystem Handoff — Notebook

Active development branch: `main`
Pre-ecosystem baseline: `freeze/pre-ecosystem-main-2026-08-29`

## Role

Notebook is the ecosystem's **research memory and reasoning instrument**. Its job is to preserve hypotheses, observations, findings, questions, decisions and context around scientific results.

## Current milestone: no infrastructure expansion

Do not expand the Django/PostgreSQL/Redis/worker stack during this milestone. The current product target is a lightweight local workflow:

```text
Project
  → Math saves result locally
  → Notebook shows Project results
  → user can bring the result into reasoning
```

A compact Project Results tray is now the first integration seam. It reads the shared local Scientific Object store. Native typed-block insertion can be added after the Notebook block model is cleaned up; do not introduce a large reference engine just to satisfy this milestone.

## Strong existing assets

- typed block/plugin architecture under `features/notebook`;
- snapshot/checkpoint concepts;
- local runtime abstractions;
- existing math/result integrity helpers.

These are worth preserving. The product should not be reduced to a generic text editor.

## Backend migration boundary

The current Django backend with PostgreSQL/Redis/queued execution is legacy execution infrastructure for ecosystem-v1. Keep it only while existing consumers need it; do not build new features on top of it.

Longer-term direction, only when needed:

```text
current server execution
      ↓
local-first runtime
JupyterLite / Pyodide / Web Workers where useful
      ↓
optional Platform Core for sync/share metadata
```

## Notebook object model

Eventually Notebook blocks may reference Scientific Objects instead of copying outputs. That model should be introduced only when the current block architecture is ready for it.

Useful semantic roles include text, hypothesis, observation, question, finding, decision, calculation, simulation, dataset and visualization.

`.ipynb` interoperability is encouraged; Axion metadata should be additive, not destructive.

## Near-term implementation order

1. Keep active Project context stable across routes.
2. Show local Project results reliably.
3. Keep the current copy/use flow simple and functional.
4. Refactor Notebook block/session state before adding native Scientific Object blocks.
5. Add local computation only when a real notebook workflow requires it.
6. Do not remove the legacy backend until no current consumer needs it.

## Design rule

Notebook must feel quieter than a programming IDE. Reasoning is primary, compute is available when invoked, and linked evidence remains visible without turning the page into a dashboard of cards.
