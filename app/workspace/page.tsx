import { ProjectObjectTray } from "@/components/ecosystem/project-object-tray";
import { ComputationalNotebook } from "@/features/notebook/ui/computational-notebook";

export const metadata = {
    title: "Workspace | Axion Notebook",
    description: "Research notebook workspace for mathematics, code, graphs, evidence, and project reasoning.",
};

export default function NotebookWorkspacePage() {
    return (
        <div className="ax-workspace-root ax-notebook-workspace">
            <ProjectObjectTray />
            <ComputationalNotebook />
        </div>
    );
}
