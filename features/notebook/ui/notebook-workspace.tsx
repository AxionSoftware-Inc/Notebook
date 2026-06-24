"use client";

import React from "react";
import {
    CheckCircle2,
    Grid3X3,
    History,
    ListPlus,
    Lock,
    LogIn,
    LogOut,
    Play,
    Save,
    Search,
    Send,
    ShieldCheck,
} from "lucide-react";

import { createCodeAppendixBlock, getNotebookPlugin, notebookPlugins } from "@/features/notebook/core/plugins";
import { serializeBlockToMarkdown } from "@/features/notebook/core/runtime";
import type { NotebookBlock } from "@/features/notebook/core/types";
import { useNotebookSession } from "@/features/notebook/core/use-notebook-session";
import { bootstrapDemoNotebookUser } from "@/lib/auth";
import { createLaboratoryWriterDraftHref, queueWriterImport } from "@/lib/live-writer-bridge";

const starterBlocks: NotebookBlock[] = [
    { ...getNotebookPlugin("text").create(), title: "Research question", content: "# Structured Notebook\nA typed workspace for formulas, proofs, execution, history, and publication." },
    { ...getNotebookPlugin("formula").create(), title: "Model equation", content: "u_t = alpha u_xx" },
    { ...getNotebookPlugin("solve").create(), title: "Energy integral", content: "sin(x) + x^2 / 5", config: { variable: "x", lower: "0", upper: "3.14", method: "auto" } },
    { ...getNotebookPlugin("graph").create(), title: "Profile graph", content: "exp(-0.4*x) * sin(x)", config: { xMin: "0", xMax: "10", samples: "160" } },
    { ...getNotebookPlugin("proof").create(), title: "Proof outline", content: "State the invariant and sketch the proof." },
    { ...getNotebookPlugin("export").create(), title: "Publication package", content: "Export notebook to Markdown, LaTeX, or Writer draft." },
];

function downloadText(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

export function NotebookWorkspace() {
    const session = useNotebookSession({
        initialBlocks: starterBlocks,
        initialTitle: "Structured Notebook",
        initialSummary: "Single-user pro notebook with typed blocks, checkpoints, hybrid compute, and export.",
    });
    const [outlineSearch, setOutlineSearch] = React.useState("");
    const [workspaceNotice, setWorkspaceNotice] = React.useState<string | null>(null);
    const deferredOutlineSearch = React.useDeferredValue(outlineSearch);
    const canEdit = Boolean(session.sessionUser);

    const visibleBlocks = React.useMemo(() => session.blocks.filter((block) => {
        if (!deferredOutlineSearch.trim()) return true;
        const haystack = `${block.title} ${block.kind} ${block.content}`.toLowerCase();
        return haystack.includes(deferredOutlineSearch.trim().toLowerCase());
    }), [deferredOutlineSearch, session.blocks]);

    const activeBlock = session.blocks.find((block) => block.id === session.activeBlockId) ?? session.blocks[0];
    const staleCount = session.dependencyGraph.filter((item) => item.stale).length;
    const selectedMarkdown = session.blocks.filter((block) => session.selectedBlockIds.has(block.id)).map(serializeBlockToMarkdown).join("\n\n");
    const blockingExecutionCount = session.blocks.filter((block) => {
        if (!getNotebookPlugin(block.kind).supportsExecute) return false;
        return ["dirty", "queued", "running", "error", "stale"].includes(block.execution.status);
    }).length;
    const backendOffline = Boolean(session.saveError?.includes("BACKEND_OFFLINE:"));

    const exportWorksheet = (format: "md" | "json" | "tex") => {
        if (blockingExecutionCount) {
            setWorkspaceNotice("Export blocked until compute blocks reach a successful state.");
            return;
        }
        setWorkspaceNotice(null);
        if (format === "json") {
            downloadText("notebook.json", JSON.stringify({ title: session.documentTitle, summary: session.documentSummary, visibility: session.visibility, blocks: session.blocks }, null, 2));
            return;
        }
        if (format === "tex") {
            downloadText("notebook.tex", `\\documentclass{article}\n\\usepackage{amsmath,amssymb,listings}\n\\begin{document}\n${session.markdown}\n\\end{document}`);
            return;
        }
        downloadText("notebook.md", session.markdown);
    };

    const sendSelectionToWriter = () => {
        if (blockingExecutionCount) {
            setWorkspaceNotice("Writer export waits for the latest successful compute state.");
            return;
        }
        setWorkspaceNotice(null);
        const requestId = queueWriterImport({
            version: 1,
            markdown: `# ${session.documentTitle}\n\n${selectedMarkdown || session.markdown}`,
            title: session.documentTitle,
            abstract: session.documentSummary,
            keywords: "notebook, structured, computational",
        });
        window.location.assign(createLaboratoryWriterDraftHref(requestId));
    };

    return (
        <div id="notebook" className="site-workspace-shell min-h-screen text-foreground">
            <div className="site-workspace-topbar sticky top-[80px] z-30">
                <div className="mx-auto flex min-h-16 max-w-[1800px] flex-wrap items-center gap-3 px-4 py-2">
                    <div className="min-w-0 flex-1">
                        <div className="site-eyebrow hidden text-accent sm:block">Notebook Core v1.1</div>
                        <input
                            value={session.documentTitle}
                            onChange={(event) => session.setDocumentTitle(event.target.value)}
                            readOnly={!canEdit}
                            className="w-full bg-transparent text-lg font-black tracking-tight outline-none read-only:cursor-not-allowed"
                        />
                        <div className="hidden text-xs font-semibold text-muted-foreground md:block">
                            {session.documentId ? `Document ${session.documentId} · revision ${session.revision ?? 1}` : "Unsaved notebook draft"}
                        </div>
                    </div>
                    <div className="hidden min-w-0 flex-[0.8] lg:block">
                        <input
                            value={session.documentSummary}
                            onChange={(event) => session.setDocumentSummary(event.target.value)}
                            readOnly={!canEdit}
                            className="h-10 w-full rounded-2xl border border-border/70 bg-background/75 px-3 text-xs font-semibold text-muted-foreground outline-none focus:border-accent/45 read-only:cursor-not-allowed"
                        />
                    </div>
                    <div className="site-toolbar-shell flex shrink-0 items-center gap-1.5 p-1.5">
                        <button onClick={() => void session.saveDocument()} disabled={!canEdit || session.saveState === "saving"} className="site-btn-accent h-9 px-3 text-xs disabled:opacity-50">
                            <Save className="h-3.5 w-3.5" />
                            {session.saveState === "saving" ? "Saving" : "Save"}
                        </button>
                        <button onClick={() => void session.createCheckpoint(`Checkpoint ${new Date().toLocaleTimeString()}`)} disabled={!canEdit} className="site-btn h-9 px-3 text-xs disabled:opacity-50">
                            <History className="h-3.5 w-3.5" />
                            Checkpoint
                        </button>
                        <button onClick={() => void session.runAll(false)} disabled={!canEdit || session.runAllState === "running"} className="site-btn h-9 px-3 text-xs disabled:opacity-50">
                            <Play className="h-3.5 w-3.5" />
                            {session.runAllState === "running" ? "Running" : "Run all"}
                        </button>
                        <button onClick={() => void session.runAll(true)} disabled={!canEdit || session.runAllState === "running" || !staleCount} className="site-btn h-9 px-3 text-xs disabled:opacity-50">
                            Stale
                        </button>
                        <button onClick={sendSelectionToWriter} disabled={blockingExecutionCount > 0} className="site-btn h-9 px-3 text-xs disabled:opacity-50">
                            <Send className="h-3.5 w-3.5" />
                            Writer
                        </button>
                        <button onClick={() => exportWorksheet("md")} disabled={blockingExecutionCount > 0} className="site-btn h-9 px-3 text-xs disabled:opacity-50">MD</button>
                        <button onClick={() => exportWorksheet("tex")} disabled={blockingExecutionCount > 0} className="site-btn h-9 px-3 text-xs disabled:opacity-50">TeX</button>
                        <button onClick={() => exportWorksheet("json")} className="site-btn h-9 px-3 text-xs">JSON</button>
                    </div>
                </div>
                <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-2 px-4 pb-2 text-xs font-semibold">
                    <span className="site-status-pill px-3 py-1">
                        {canEdit ? `Editable as ${session.sessionUser?.username}` : "Public read-only mode"}
                    </span>
                    <span className="site-status-pill px-3 py-1">
                        Visibility {session.visibility === "public_read" ? "public read" : "private"}
                    </span>
                    {session.isAuthLoading ? <span className="site-status-pill px-3 py-1">Session loading</span> : null}
                    {blockingExecutionCount ? <span className="site-status-pill px-3 py-1">{blockingExecutionCount} blocks need successful execution before export</span> : null}
                </div>
                {workspaceNotice ? <div className="mx-auto max-w-[1800px] px-4 pb-2 text-xs font-semibold text-amber-700">{workspaceNotice}</div> : null}
                {session.authError ? <div className="mx-auto max-w-[1800px] px-4 pb-2 text-xs font-semibold text-rose-600">{session.authError}</div> : null}
                {session.saveError ? <div className="mx-auto max-w-[1800px] px-4 pb-2 text-xs font-semibold text-rose-600">{backendOffline ? "Backend offline: API server is unreachable." : session.saveError}</div> : null}
            </div>

            <div className="mx-auto grid max-w-[1800px] gap-4 px-4 py-4 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
                <aside className="space-y-3 xl:sticky xl:top-[152px] xl:self-start">
                    <div className="site-panel p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="site-eyebrow">Typed Blocks</div>
                            <ListPlus className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                            {notebookPlugins.map((plugin) => (
                                <button key={plugin.kind} onClick={() => session.addBlock(plugin.create())} disabled={!canEdit} title={plugin.description} className="flex h-11 items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-2 text-left transition hover:border-accent/30 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50">
                                    <Grid3X3 className="h-4 w-4 shrink-0 text-accent" />
                                    <span className="truncate text-xs font-black">{plugin.label}</span>
                                </button>
                            ))}
                        </div>
                        {!canEdit ? <div className="mt-2 text-xs text-muted-foreground">Sign in to add, edit, execute, and checkpoint blocks.</div> : null}
                    </div>
                    <div className="site-panel p-3">
                        <div className="site-eyebrow text-sky-600">Navigator</div>
                        <div className="mt-3 space-y-2">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <input value={outlineSearch} onChange={(event) => setOutlineSearch(event.target.value)} placeholder="Find block..." className="h-10 w-full rounded-2xl border border-border/70 bg-background/70 pl-9 pr-3 text-sm outline-none focus:border-accent/45" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-muted-foreground">
                                <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">Blocks {session.blocks.length}</div>
                                <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">Stale {staleCount}</div>
                            </div>
                        </div>
                    </div>
                    <div className="site-panel p-3">
                        <div className="site-eyebrow text-emerald-600">Capabilities</div>
                        <div className="mt-3 space-y-1.5">
                            {session.capabilities.map((capability) => (
                                <div key={capability.kind} className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs">
                                    <div className="font-black">{capability.title}</div>
                                    <div className="text-muted-foreground">{capability.kind}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="space-y-3">
                    <div className="site-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
                            <span className="site-status-pill px-3 py-1">Selected {session.selectedBlockIds.size}</span>
                            <span className="site-status-pill px-3 py-1">Dirty {session.isDirty ? "yes" : "no"}</span>
                            <span className="site-status-pill px-3 py-1">Stale {staleCount}</span>
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                            Active: <span className="font-black text-foreground">{activeBlock?.title}</span>
                        </div>
                    </div>
                    {!visibleBlocks.length ? (
                        <div className="site-panel rounded-[1.6rem] border border-dashed border-border/70 p-8 text-sm text-muted-foreground">
                            No blocks matched your filter.
                        </div>
                    ) : visibleBlocks.map((block, index) => (
                        <NotebookBlockCard
                            key={block.id}
                            block={block}
                            index={index}
                            active={block.id === session.activeBlockId}
                            selected={session.selectedBlockIds.has(block.id)}
                            collapsed={Boolean(session.collapsedBlocks[block.id])}
                            editable={canEdit}
                            onFocus={session.setActiveBlockId}
                            onToggleCollapsed={(blockId) => session.setCollapsedBlocks((current) => ({ ...current, [blockId]: !current[blockId] }))}
                            onToggleSelected={(blockId) => session.setSelectedBlockIds((current) => {
                                const next = new Set(current);
                                if (next.has(blockId)) next.delete(blockId);
                                else next.add(blockId);
                                return next;
                            })}
                            onChange={(blockId, patch) => session.setBlockPatch(blockId, patch)}
                            onRunBlock={(blockId) => void session.runBlock(blockId)}
                            onInsertBlockAfter={session.insertBlockAfter}
                            onRemove={session.removeBlock}
                        />
                    ))}
                </main>

                <aside className="space-y-3 xl:sticky xl:top-[152px] xl:self-start">
                    <AccessCard
                        editable={canEdit}
                        visibility={session.visibility}
                        onVisibilityChange={session.setVisibility}
                        onLogin={session.login}
                        onLogout={session.logout}
                        onBootstrapDemo={async () => {
                            await bootstrapDemoNotebookUser();
                            await session.login("demo", "demo-demo-2026");
                        }}
                        isAuthLoading={session.isAuthLoading}
                        sessionUser={session.sessionUser}
                    />
                    <div className="site-panel p-3">
                        <div className="site-eyebrow text-amber-600">History</div>
                        <div className="mt-3 max-h-[240px] space-y-1.5 overflow-auto pr-1">
                            {session.snapshots.length ? session.snapshots.map((snapshot) => (
                                <div key={snapshot.id} className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate font-black">{snapshot.label || snapshot.source}</span>
                                        <button onClick={() => void session.restoreCheckpoint(snapshot.id)} disabled={!canEdit} className="text-accent disabled:opacity-40">Restore</button>
                                    </div>
                                    <div className="mt-1 text-muted-foreground">rev {snapshot.revision} · {snapshot.blocks.length} blocks</div>
                                </div>
                            )) : (
                                <div className="rounded-xl border border-dashed border-border/70 p-3 text-xs text-muted-foreground">No checkpoints yet.</div>
                            )}
                        </div>
                    </div>
                    <div className="site-panel p-3">
                        <div className="site-eyebrow text-sky-600">Documents</div>
                        <div className="mt-3 max-h-[220px] space-y-1.5 overflow-auto pr-1">
                            {session.documents.length ? session.documents.map((document) => (
                                <button key={document.id} onClick={() => void session.loadDocument(document)} className="w-full rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-left text-xs transition hover:bg-muted/50">
                                    <span className="block truncate font-bold">{document.title}</span>
                                    <span className="block text-xs text-muted-foreground">rev {document.revision} · {document.visibility === "public_read" ? "public read" : "private"}</span>
                                    <span className="text-[11px] text-muted-foreground">{document.owner ? document.owner.username : "anonymous owner"}</span>
                                </button>
                            )) : (
                                <div className="rounded-xl border border-dashed border-border/70 p-3 text-xs text-muted-foreground">No notebooks loaded from the backend yet.</div>
                            )}
                        </div>
                    </div>
                    <div className="site-panel p-3">
                        <div className="site-eyebrow text-emerald-600">Inspector</div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="col-span-2 rounded-xl border border-border/70 bg-background/70 p-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Execution history</div>
                                <div className="mt-2 max-h-36 space-y-1 overflow-auto text-xs text-muted-foreground">
                                    {session.executionHistory.length ? session.executionHistory.map((entry) => (
                                        <div key={entry.id} className="rounded-xl border border-border/60 bg-muted/10 px-3 py-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-bold text-foreground">{entry.title}</span>
                                                <span>{entry.status}</span>
                                            </div>
                                            <div className="mt-1">{entry.detail}</div>
                                        </div>
                                    )) : <div>No executions recorded yet.</div>}
                                </div>
                            </div>
                            <div className="col-span-2 rounded-xl border border-border/70 bg-background/70 p-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Dependency graph</div>
                                <div className="mt-2 max-h-36 space-y-1 overflow-auto text-xs text-muted-foreground">
                                    {session.dependencyGraph.map((item) => (
                                        <div key={item.id}>{item.title} {item.dependsOn ? "-> depends on solve" : "-> source"} {item.stale ? "(stale)" : ""}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function AccessCard({
    editable,
    visibility,
    onVisibilityChange,
    onLogin,
    onLogout,
    onBootstrapDemo,
    isAuthLoading,
    sessionUser,
}: {
    editable: boolean;
    visibility: "private" | "public_read";
    onVisibilityChange: (visibility: "private" | "public_read") => void;
    onLogin: (username: string, password: string) => Promise<void>;
    onLogout: () => void;
    onBootstrapDemo: () => Promise<void>;
    isAuthLoading: boolean;
    sessionUser: { username: string } | null;
}) {
    const [username, setUsername] = React.useState("demo");
    const [password, setPassword] = React.useState("demo-demo-2026");
    const [submitting, setSubmitting] = React.useState(false);
    const [localError, setLocalError] = React.useState<string | null>(null);

    const handleLogin = async () => {
        setSubmitting(true);
        setLocalError(null);
        try {
            await onLogin(username, password);
        } catch (error) {
            setLocalError(error instanceof Error ? error.message : "Login failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleBootstrapDemo = async () => {
        setSubmitting(true);
        setLocalError(null);
        try {
            await onBootstrapDemo();
        } catch (error) {
            setLocalError(error instanceof Error ? error.message : "Demo bootstrap failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="site-panel p-3">
            <div className="flex items-center justify-between gap-2">
                <div className="site-eyebrow text-violet-600">Access</div>
                {editable ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4 text-amber-600" />}
            </div>
            <div className="mt-3 space-y-3">
                {editable ? (
                    <>
                        <div className="rounded-2xl border border-border/70 bg-background/70 px-3 py-3 text-sm">
                            <div className="font-black">{sessionUser?.username}</div>
                            <div className="text-xs text-muted-foreground">Authenticated writer session</div>
                        </div>
                        <label className="block text-xs font-bold text-muted-foreground">
                            Visibility
                            <select value={visibility} onChange={(event) => onVisibilityChange(event.target.value === "public_read" ? "public_read" : "private")} className="mt-2 h-10 w-full rounded-2xl border border-border/70 bg-background px-3 text-sm font-semibold outline-none">
                                <option value="private">Private</option>
                                <option value="public_read">Public read</option>
                            </select>
                        </label>
                        <button onClick={onLogout} className="site-btn h-10 w-full justify-center text-xs">
                            <LogOut className="h-3.5 w-3.5" />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 px-3 py-3 text-sm text-muted-foreground">
                            Anonymous visitors can read public notebooks but cannot change documents, run compute blocks, or restore checkpoints.
                        </div>
                        <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" className="h-10 w-full rounded-2xl border border-border/70 bg-background px-3 text-sm outline-none" />
                        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="h-10 w-full rounded-2xl border border-border/70 bg-background px-3 text-sm outline-none" />
                        <button onClick={() => void handleLogin()} disabled={submitting || isAuthLoading} className="site-btn-accent h-10 w-full justify-center text-xs disabled:opacity-50">
                            <LogIn className="h-3.5 w-3.5" />
                            {submitting ? "Signing in" : "Sign in"}
                        </button>
                        <button onClick={() => void handleBootstrapDemo()} disabled={submitting || isAuthLoading} className="site-btn h-10 w-full justify-center text-xs disabled:opacity-50">
                            Demo account
                        </button>
                        {localError ? <div className="text-xs font-semibold text-rose-600">{localError}</div> : null}
                        {isAuthLoading ? <div className="text-xs text-muted-foreground">Session check in progress.</div> : null}
                    </>
                )}
            </div>
        </div>
    );
}

function NotebookBlockCard({
    block,
    index,
    active,
    selected,
    collapsed,
    editable,
    onFocus,
    onToggleCollapsed,
    onToggleSelected,
    onChange,
    onRunBlock,
    onInsertBlockAfter,
    onRemove,
}: {
    block: NotebookBlock;
    index: number;
    active: boolean;
    selected: boolean;
    collapsed: boolean;
    editable: boolean;
    onFocus: (blockId: string) => void;
    onToggleCollapsed: (blockId: string) => void;
    onToggleSelected: (blockId: string) => void;
    onChange: (blockId: string, patch: Partial<NotebookBlock>) => void;
    onRunBlock: (blockId: string) => void;
    onInsertBlockAfter: (afterId: string, block: NotebookBlock) => void;
    onRemove: (blockId: string) => void;
}) {
    const plugin = getNotebookPlugin(block.kind);
    return (
        <section onClick={() => onFocus(block.id)} className={`site-panel overflow-hidden border-l-4 ${active ? "border-l-accent ring-2 ring-accent/15" : "border-l-transparent"}`}>
            <div className="flex flex-col gap-3 border-b border-border/70 bg-background/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <input type="checkbox" checked={selected} onChange={() => onToggleSelected(block.id)} onClick={(event) => event.stopPropagation()} className="h-4 w-4 accent-[var(--accent)]" />
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-accent">
                        <Grid3X3 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Block {index + 1} · {plugin.kind}</div>
                        <input value={block.title} readOnly={!editable} onChange={(event) => onChange(block.id, { title: event.target.value })} className="mt-0.5 w-full bg-transparent text-base font-black tracking-tight outline-none read-only:cursor-not-allowed" />
                        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-600">{block.execution.status}</div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {plugin.supportsExecute ? (
                        <>
                            <button onClick={() => onRunBlock(block.id)} disabled={!editable} className="site-btn-accent h-9 px-3 text-xs disabled:opacity-50">
                                <Play className="h-3.5 w-3.5" />
                                Run
                            </button>
                            {block.kind === "solve" ? (
                                <button onClick={() => onInsertBlockAfter(block.id, createCodeAppendixBlock(block))} disabled={!editable} className="site-btn h-9 px-3 text-xs disabled:opacity-50">Add code</button>
                            ) : null}
                        </>
                    ) : null}
                    <button onClick={() => onToggleCollapsed(block.id)} className="site-btn h-9 px-3 text-xs">{collapsed ? "Expand" : "Collapse"}</button>
                    <button onClick={() => onRemove(block.id)} disabled={!editable} className="h-9 rounded-xl border border-border/70 px-3 text-xs font-bold text-muted-foreground hover:text-rose-600 disabled:opacity-50">Remove</button>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-4 py-2 text-[11px] text-muted-foreground">
                <span className="site-status-pill px-2.5 py-1">{plugin.family}</span>
                <span className="site-status-pill px-2.5 py-1">{block.execution.runtime}</span>
                {block.execution.durationMs ? <span className="site-status-pill px-2.5 py-1">{block.execution.durationMs} ms</span> : null}
                {block.execution.detail ? <span className="site-status-pill px-2.5 py-1">{block.execution.detail}</span> : null}
            </div>
            {!collapsed ? (
                <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className={editable ? "space-y-3" : "space-y-3 rounded-[1.25rem] border border-dashed border-border/60 p-2"}>
                        {!editable ? <div className="flex items-center gap-2 px-2 text-xs font-semibold text-muted-foreground"><Lock className="h-3.5 w-3.5" />Read-only block editor</div> : null}
                        <div className={editable ? "" : "pointer-events-none opacity-70"}>{plugin.editor({ block, onChange: (patch) => editable ? onChange(block.id, patch) : undefined })}</div>
                    </div>
                    <div className="site-soft-panel rounded-[1.25rem] p-3">
                        <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Preview
                        </div>
                        {plugin.preview({ block, onChange: (patch) => editable ? onChange(block.id, patch) : undefined })}
                    </div>
                </div>
            ) : null}
        </section>
    );
}
