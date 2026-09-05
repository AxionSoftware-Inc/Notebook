"use client";

import React from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Link2, X } from "lucide-react";

import { getEcosystemRouteHref } from "@/lib/ecosystem/apps";
import { getLocalScientificObject } from "@/lib/ecosystem/local-object-store";
import {
  listNotebookObjectLinks,
  NOTEBOOK_OBJECT_LINKS_CHANGED,
  removeNotebookObjectLink,
  type NotebookObjectLink,
} from "@/lib/ecosystem/notebook-object-links";
import { resolveActiveProjectId } from "@/lib/ecosystem/project-context";
import type { ScientificObject } from "@/lib/ecosystem/contracts";

type LinkedResult = {
  link: NotebookObjectLink;
  object: ScientificObject;
};

function objectSummary(object: ScientificObject) {
  const payload = object.revision?.payload;
  if (!payload || typeof payload !== "object") return "Linked scientific result.";
  const data = payload as Record<string, unknown>;
  if (typeof data.summary === "string" && data.summary.trim()) return data.summary.trim();
  if (typeof data.report_markdown === "string" && data.report_markdown.trim()) {
    return data.report_markdown.replace(/[#*_`>\[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, 520);
  }
  return "Linked scientific result.";
}

function LinkedResultBlock({ item, onRemove }: { item: LinkedResult; onRemove: () => void }) {
  const { object, link } = item;
  const writerHref = getEcosystemRouteHref("writer", "/new", "notebook", link.projectId, {
    source: "project",
    objectId: object.id,
  });

  return (
    <article className="notebook-linked-result border-t border-[var(--ax-work-line)] py-6 first:border-t-0">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ax-text-faint)]">
            <span className="inline-flex items-center gap-1.5 text-[var(--ax-accent)]"><Link2 className="h-3 w-3" />Live reference</span>
            <span>Mathematics</span>
            <span>{object.domain || object.kind}</span>
            <span>rev {object.currentRevision}</span>
          </div>
          <h3 className="mt-2 font-serif text-[24px] tracking-[-0.035em] text-[var(--ax-text)]">{object.title}</h3>
          <p className="mt-3 max-w-[720px] text-[13px] leading-7 text-[var(--ax-text-soft)]">{objectSummary(object)}</p>
        </div>
        <button type="button" onClick={onRemove} className="notebook-icon-button h-8 w-8 shrink-0" aria-label={`Remove ${object.title} from notebook`}><X className="h-3.5 w-3.5" /></button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--ax-work-line)] pt-3">
        <span className="text-[9.5px] text-[var(--ax-text-faint)]">Source stays live in this Project. Updates resolve to the latest revision.</span>
        <a href={writerHref} className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-[var(--ax-work-control-radius)] px-2.5 text-[10px] font-semibold text-[var(--ax-accent)] hover:bg-[var(--ax-work-surface-muted)] hover:text-[var(--ax-accent-strong)]">
          Use as Writer evidence <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

export function NotebookScientificLinks() {
  const [host, setHost] = React.useState<HTMLElement | null>(null);
  const [projectId, setProjectId] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<LinkedResult[]>([]);

  const refresh = React.useCallback(async () => {
    const activeProjectId = resolveActiveProjectId();
    setProjectId(activeProjectId);
    if (!activeProjectId) {
      setItems([]);
      return;
    }

    const links = listNotebookObjectLinks(activeProjectId);
    const hydrated = await Promise.all(links.map(async (link) => {
      try {
        const object = await getLocalScientificObject(link.objectId);
        return object ? { link, object } satisfies LinkedResult : null;
      } catch {
        return null;
      }
    }));
    setItems(hydrated.filter((item): item is LinkedResult => Boolean(item)));
  }, []);

  React.useEffect(() => {
    const article = document.querySelector<HTMLElement>(".notebook-document");
    if (!article) return;
    const portalHost = document.createElement("div");
    portalHost.dataset.axionLinkedResults = "true";
    portalHost.className = "notebook-linked-results-host mx-auto mt-8 max-w-[820px] border-t border-[var(--ax-work-line)] pt-7";
    article.appendChild(portalHost);
    setHost(portalHost);
    return () => portalHost.remove();
  }, []);

  React.useEffect(() => {
    void refresh();
    const onChanged = () => void refresh();
    window.addEventListener(NOTEBOOK_OBJECT_LINKS_CHANGED, onChanged);
    window.addEventListener("focus", onChanged);
    return () => {
      window.removeEventListener(NOTEBOOK_OBJECT_LINKS_CHANGED, onChanged);
      window.removeEventListener("focus", onChanged);
    };
  }, [refresh]);

  if (!host || !projectId || !items.length) return null;

  return createPortal(
    <section aria-label="Linked Project results">
      <div className="mb-1 flex items-end justify-between gap-4">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--ax-accent)]">Project evidence</div>
          <h2 className="mt-2 font-serif text-[27px] tracking-[-0.04em] text-[var(--ax-text)]">Linked scientific results</h2>
        </div>
        <div className="hidden text-[9.5px] text-[var(--ax-text-faint)] sm:block">Live · structured · provenance preserved</div>
      </div>
      <div className="mt-4">
        {items.map((item) => (
          <LinkedResultBlock
            key={item.object.id}
            item={item}
            onRemove={() => {
              removeNotebookObjectLink(projectId, item.object.id);
              void refresh();
            }}
          />
        ))}
      </div>
    </section>,
    host,
  );
}
