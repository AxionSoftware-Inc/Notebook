# Ecosystem Handoff — Notebook

Branch: `ecosystem-v1-foundation-2026-08-28`
Base: `main` at `17e88346fe554af1f1d6d539527add7553b4d561`

## Role

Notebook is the ecosystem's **research memory and reasoning instrument**. Its job is to preserve hypotheses, observations, findings, questions, decisions and context around scientific objects.

## Strong existing assets

- typed block/plugin architecture under `features/notebook`;
- snapshot/checkpoint concepts;
- local runtime abstractions;
- existing math/result integrity helpers.

These are worth preserving. The product should not be reduced to a generic text editor.

## Backend migration boundary

The current Django backend with PostgreSQL/Redis/queued execution is now **legacy execution infrastructure** for ecosystem-v1. Do not expand it with new server-compute features.

Migration direction:

```text
current server execution
      ↓
local-first runtime
JupyterLite / Pyodide / Web Workers where useful
      ↓
Platform Core only for project/object/sync/share metadata
```

The existing backend remains until persistence/auth consumers have a replacement. Do not delete it prematurely.

## Notebook object model

Notebook blocks should be able to reference Scientific Objects instead of copying their output.

Semantic blocks should eventually include:

- text;
- hypothesis;
- observation;
- question;
- finding;
- decision;
- calculation reference;
- simulation reference;
- dataset reference;
- visualization/scene reference.

`.ipynb` interoperability is encouraged; XXY/Axion metadata should be additive, not destructive.

## First integration pipeline

```text
Open Project
  → create/open notebook
  → insert Project object reference
  → add observation/finding
  → save notebook object/revision
  → Writer can consume both evidence and finding
```

## Near-term implementation order

1. Add shared Project context and Platform Core adapter.
2. Stop treating backend execution as the default product path.
3. Map existing typed blocks to semantic research block roles.
4. Add `Insert from Project` for scientific object references.
5. Add local execution adapter for computational blocks.
6. Preserve/import/export `.ipynb` where it reduces switching cost.
7. Remove Redis/worker deployment requirement once no consumer needs it.

## Design rule

Notebook must feel quieter than a programming IDE. Reasoning is primary, compute is available when invoked, and linked evidence remains visible without turning the page into a dashboard of cards.
