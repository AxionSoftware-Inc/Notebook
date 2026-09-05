"use client";

import React from "react";

import { AxActionLink, AxBadge, AxButton, AxPanel } from "@/components/axion";
import { getEcosystemHref } from "@/lib/ecosystem/apps";
import { createLocalScientificReference, getLocalScientificObject, listLocalScientificObjects } from "@/lib/ecosystem/local-object-store";
import { addNotebookObjectLink, listNotebookObjectLinks } from "@/lib/ecosystem/notebook-object-links";
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
  const [linkedIds, setLinkedIds] = React.useState<Set<string>>(new Set());
  const [open, setOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [linkingId, setLinkingId] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    const activeProjectId = resolveActiveProjectId();
    setProjectId(activeProjectId);
    setProjectTitle(getLocalProjectTitle(activeProjectId));
    if (!activeProjectId) {
      setObjects([]);
      setLinkedIds(new Set());
      return;
    }
    try {
      const items = await listLocalScientificObjects(activeProjectId);
      setObjects(items);
      setLinkedIds(new Set(listNotebookObjectLinks(activeProjectId).map((link) => link.objectId)));
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
    <section className="ax-work-subnav text-[var(--ax-text)]">
      <div className="ax-work-subnav-inner">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-11 w-full items-center justify-between gap-4 text-left outline-none focus-visible:shadow-[var(--ax-focus-ring)]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--ax-accent)]">Project</span>
            <span className="truncate text-[11px] font-semibold text-[var(--ax-text)]">{projectTitle || "Active project"}</span>
            <AxBadge className="hidden sm:inline-flex">{mathObjects.length} Math results</AxBadge>
          </div>
          <span className="shrink-0 text-[10px] font-semibold text-[var(--ax-text-soft)]">{open ? "Hide" : "Insert result"}</span>
        </button>

        {open ? (
          <div className="grid gap-2 border-t border-[var(--ax-work-line)] py-4 md:grid-cols-2 xl:grid-cols-3">
            {mathObjects.length ? mathObjects.map((object) => {
              const linked = linkedIds.has(object.id);
              return (
                <AxPanel key={object.id} className="flex items-center justify-between gap-3 rounded-[var(--ax-work-panel-radius)] px-4 py-3 shadow-none">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-[var(--ax-text)]">{object.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-[var(--ax-text-faint)]">
                      <span>{object.domain || object.kind}</span>
                      {linked ? <span className="text-[var(--ax-accent)]">Live in notebook</span> : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <AxButton
                      variant={linked ? "quiet" : "primary"}
                      size="sm"
                      disabled={linked || linkingId === object.id}
                      onClick={async () => {
                        setLinkingId(object.id);
                        try {
                          const reference = { projectId, objectId: object.id, mode: "live" as const };
                          await createLocalScientificReference({ projectId, reference, role: "notebook-block" });
                          addNotebookObjectLink(reference);
                          setLinkedIds((current) => new Set([...current, object.id]));
                        } finally {
                          setLinkingId(null);
                        }
                      }}
                    >
                      {linked ? "Inserted" : linkingId === object.id ? "Inserting" : "Insert"}
                    </AxButton>
                    <AxButton
                      size="sm"
                      variant="quiet"
                      onClick={async () => {
                        const hydrated = await getLocalScientificObject(object.id);
                        await navigator.clipboard.writeText(resultText(hydrated || object));
                        setCopiedId(object.id);
                      }}
                    >
                      {copiedId === object.id ? "Copied" : "Copy"}
                    </AxButton>
                  </div>
                </AxPanel>
              );
            }) : (
              <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[var(--ax-work-line)] py-4 md:col-span-2 xl:col-span-3">
                <p className="text-xs leading-5 text-[var(--ax-text-soft)]">No saved Math results yet. Solve something in Laboratory and press Save.</p>
                <AxActionLink href={getEcosystemHref("math", "notebook", projectId)} size="sm">Open Mathematics</AxActionLink>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
