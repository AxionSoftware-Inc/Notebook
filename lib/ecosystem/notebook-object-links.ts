import type { ScientificObjectReference } from "./contracts";

const STORAGE_KEY = "axion.notebook.object-links.v1";
export const NOTEBOOK_OBJECT_LINKS_CHANGED = "axion:notebook-object-links-changed";

export type NotebookObjectLink = ScientificObjectReference & {
  insertedAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readAll(): NotebookObjectLink[] {
  if (!canUseStorage()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as NotebookObjectLink[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(links: NotebookObjectLink[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  window.dispatchEvent(new CustomEvent(NOTEBOOK_OBJECT_LINKS_CHANGED));
}

export function listNotebookObjectLinks(projectId: string): NotebookObjectLink[] {
  return readAll()
    .filter((link) => link.projectId === projectId)
    .sort((a, b) => a.insertedAt.localeCompare(b.insertedAt));
}

export function addNotebookObjectLink(reference: ScientificObjectReference): NotebookObjectLink {
  const current = readAll();
  const existing = current.find((link) => link.projectId === reference.projectId && link.objectId === reference.objectId);
  if (existing) return existing;

  const link: NotebookObjectLink = {
    ...reference,
    insertedAt: new Date().toISOString(),
  };
  writeAll([...current, link]);
  return link;
}

export function removeNotebookObjectLink(projectId: string, objectId: string) {
  writeAll(readAll().filter((link) => !(link.projectId === projectId && link.objectId === objectId)));
}
