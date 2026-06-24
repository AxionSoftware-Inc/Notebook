"use client";

import { compile } from "mathjs";

import type {
    NotebookBlock,
    NotebookBlockResult,
    NotebookDependencyNode,
    NotebookExecutionState,
} from "@/features/notebook/core/types";

function safeNumber(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function evaluateExpression(expression: string, x: number) {
    const fn = compile(expression);
    const value = fn.evaluate({ x, alpha: 1, pi: Math.PI, e: Math.E });
    return typeof value === "number" && Number.isFinite(value) ? value : Number(value);
}

export function createIdleExecutionState(runtime: NotebookExecutionState["runtime"] = "local"): NotebookExecutionState {
    return {
        status: "idle",
        runtime,
    };
}

export function inferDependencyGraph(blocks: NotebookBlock[]): NotebookDependencyNode[] {
    const solveBlocks = blocks.filter((block) => block.kind === "solve");
    return blocks.map((block, index) => {
        const upstreamSolve = [...solveBlocks].reverse().find((candidate) => blocks.findIndex((item) => item.id === candidate.id) < index);
        const dependsOn = block.kind === "graph" || block.kind === "table" || block.kind === "code" || block.kind === "export"
            ? upstreamSolve?.id ?? null
            : null;
        return {
            id: block.id,
            title: block.title,
            kind: block.kind,
            dependsOn,
            stale: block.execution.status === "stale" || Boolean(dependsOn && blocks.find((item) => item.id === dependsOn)?.execution.status === "stale"),
        };
    });
}

export function serializeBlockToMarkdown(block: NotebookBlock) {
    if (block.kind === "formula") {
        return `## ${block.title}\n\n$$${block.content}$$`;
    }
    if (block.kind === "code") {
        return `## ${block.title}\n\n\`\`\`python\n${block.content}\n\`\`\``;
    }
    return `## ${block.title}\n\n${block.content}`;
}

export function buildExecutionCacheKey(block: NotebookBlock) {
    return JSON.stringify({
        kind: block.kind,
        content: block.content,
        config: block.config,
    });
}

export function executeLocalPreview(block: NotebookBlock): NotebookBlockResult {
    const started = performance.now();
    if (block.kind === "graph") {
        const xMin = safeNumber(block.config.xMin, -5);
        const xMax = safeNumber(block.config.xMax, 5);
        const samples = Math.max(16, Math.min(600, Math.round(safeNumber(block.config.samples, 160))));
        const points = Array.from({ length: samples }, (_, index) => {
            const x = xMin + ((xMax - xMin) * index) / (samples - 1);
            return { x, y: evaluateExpression(block.content, x) };
        }).filter((point) => Number.isFinite(point.y));
        return {
            status: "success",
            runtime: "local",
            cache_key: buildExecutionCacheKey(block),
            duration_ms: Math.round(performance.now() - started),
            detail: `${points.length} sampled points`,
            output: {
                points,
                y_min: points.length ? Math.min(...points.map((point) => point.y)) : null,
                y_max: points.length ? Math.max(...points.map((point) => point.y)) : null,
            },
        };
    }

    if (block.kind === "table") {
        const rows = Math.max(2, Math.min(50, Math.round(safeNumber(block.config.rows, 8))));
        const xMin = safeNumber(block.config.xMin, 0);
        const xMax = safeNumber(block.config.xMax, 5);
        const data = Array.from({ length: rows }, (_, index) => {
            const x = xMin + ((xMax - xMin) * index) / (rows - 1);
            return { x, y: evaluateExpression(block.content, x) };
        });
        return {
            status: "success",
            runtime: "local",
            cache_key: buildExecutionCacheKey(block),
            duration_ms: Math.round(performance.now() - started),
            detail: `${rows} generated rows`,
            output: {
                rows: data,
            },
        };
    }

    if (block.kind === "code") {
        return {
            status: "success",
            runtime: "server-boundary",
            cache_key: buildExecutionCacheKey(block),
            duration_ms: Math.round(performance.now() - started),
            detail: `${block.content.split(/\r?\n/).length} code lines`,
            output: {
                lines: block.content.split(/\r?\n/).length,
            },
        };
    }

    return {
        status: "success",
        runtime: "local",
        cache_key: buildExecutionCacheKey(block),
        duration_ms: Math.round(performance.now() - started),
        detail: "No execution required",
        output: {},
    };
}
