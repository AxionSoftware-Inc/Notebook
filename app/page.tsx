import { ComputationalNotebook } from "@/features/notebook/ui/computational-notebook";

export const metadata = {
    title: "Computational Notebook | MathSphere",
    description: "Live worksheet documents for formulas, solving, graphs, tables, code, proofs, and export.",
};

export default function NotebookPage() {
    return <ComputationalNotebook />;
}
