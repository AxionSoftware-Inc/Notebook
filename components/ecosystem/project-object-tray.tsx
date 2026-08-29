"use client";

import React from "react";

import { AxActionLink, AxBadge, AxButton, AxPanel } from "@/components/axion";
import { getEcosystemHref } from "@/lib/ecosystem/apps";
import { getLocalScientificObject, listLocalScientificObjects } from "@/lib/ecosystem/local-object-store";
import { getLocalProjectTitle, resolveActiveProjectId } from "@/lib/ecosystem/project-context";
import type { ScientificObject } from "@/lib/ecosystem/contracts";

function resultText(object: ScientificObject) {
  const payload = object.revision?.payload;
  if (!payload || typeof payload !== "object") return object.title;
  const data = payload as Record<string, unknown>;
  if (typeof data.report_markdown === "string" && data.report_markdown.trim()) return data.report_markdown;
  if (typeof data.summary === "string" && data.summary.trim()) return data.summary;
  return object.title;
}

export function ProjectObjectTray() {
  const [projectId, setProjectId] = React.useState<string | null>(null);
  const [projectTitle, setProjectTitle] = React.useState<string | null>(null);
  const [objects, setObjects] = React.useState<ScientificObject[]>([]);
  const [open, setOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    const activeProjectId = resolveActiveProjectId();
    setProjectId(activeProjectId);
    setProjectTitle(getLocalProjectTitle(activeProjectId));
    if (!activeProjectId) {
      setObjects([]);
      return;
    }
    try {
      setObjects(await listLocalScientificObjects(activeProjectId));
    } catch {
      setObjects([]);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  if (!projectId) return null;

  const mathObjects = objects.filter((object) => object.sourceApp === "math");

  return (
    <section className="border-b border-[var(--ax-line)] bg-[var(--ax-surface-soft)] text-[var(--ax-text)]">
      <div className="mx-auto max-w-[var(--ax-content-max)] px-4 sm:px-6">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-9 w-full items-center justify-between gap-4 text-left outline-none focus-visible:shadow-[var(--ax-focus-ring)]">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ax-accent)]">Project</span>
            <span className="truncate text-[11px] font-semibold text-[var(--ax-text)]">{projectTitle || "Active project"}</span>
            <AxBadge className="hidden sm:inline-flex">{mathObjects.length} results</AxBadge>
          </div>
          <span className="shrink-0 text-[10px] font-semibold text-[var(--ax-text-soft)]">{open ? "Hide results" : "Show results"}</span>
        </button>

        {open ? (
          <div className="grid gap-2 border-t border-[var(--ax-line)] py-3 md:grid-cols-2 xl:grid-cols-3">
            {mathObjects.length ? mathObjects.map((object) => (
              <AxPanel key={object.id} className="flex items-center justify-between gap-3 px-3 py-3">
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-[var(--ax-text)]">{object.title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--ax-text-faint)]">{object.domain || object.kind}</div>
                </div>
                <AxButton
                  size="sm"
                  onClick={async () => {
                    const hydrated = await getLocalScientificObject(object.id);
                    await navigator.clipboard.writeText(resultText(hydrated || object));
                    setCopiedId(object.id);
                  }}
                >
                  {copiedId === object.id ? "Copied" : "Copy result"}
                </AxButton>
              </AxPanel>
            )) : (
              <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[var(--ax-line)] py-4 md:col-span-2 xl:col-span-3">
                <p className="text-xs leading-5 text-[var(--ax-text-soft)]">No saved Math results yet. Solve something in Laboratory and press Save.</p>
                <AxActionLink href={getEcosystemHref("math", "notebook", projectId)} size="sm">Open Math</AxActionLink>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
