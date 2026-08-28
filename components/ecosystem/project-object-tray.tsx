"use client";

import React from "react";

import { listLocalScientificObjects } from "@/lib/ecosystem/local-object-store";
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
  const [insertedId, setInsertedId] = React.useState<string | null>(null);

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
    <section className="border-b border-black/[0.06] bg-white px-4 py-2.5 text-[#171717] dark:border-white/[0.08] dark:bg-[#0d0d0d] dark:text-white sm:px-6">
      <div className="mx-auto max-w-[1680px]">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">Project results</div>
            <div className="mt-0.5 truncate text-xs font-semibold">{projectTitle || "Active project"} · {mathObjects.length} available</div>
          </div>
          <span className="text-[11px] font-semibold text-black/45 dark:text-white/45">{open ? "Hide" : "Open"}</span>
        </button>

        {open ? (
          <div className="mt-3 grid gap-2 border-t border-black/[0.06] pt-3 dark:border-white/[0.08] md:grid-cols-2 xl:grid-cols-3">
            {mathObjects.length ? mathObjects.map((object) => (
              <article key={object.id} className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.07] bg-[#fafafa] px-3 py-3 dark:border-white/[0.09] dark:bg-white/[0.03]">
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold">{object.title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-black/40 dark:text-white/40">{object.domain || object.kind}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("axion:insert-scientific-object", {
                      detail: { object, text: resultText(object) },
                    }));
                    setInsertedId(object.id);
                  }}
                  className="shrink-0 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-[11px] font-bold dark:border-white/[0.12] dark:bg-white/[0.06]"
                >
                  {insertedId === object.id ? "Inserted" : "Insert"}
                </button>
              </article>
            )) : (
              <p className="text-xs leading-5 text-black/45 dark:text-white/45">No saved Math results yet. Solve something in Laboratory and press Save.</p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
