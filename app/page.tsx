import { ProjectObjectTray } from "@/components/ecosystem/project-object-tray";
import { ComputationalNotebook } from "@/features/notebook/ui/computational-notebook";

export const metadata = {
    title: "Notebook | Axion Science",
    description: "A calm research notebook for mathematics, code, graphs, and project reasoning.",
};

export default function NotebookPage() {
    return (
        <>
            <ProjectObjectTray />
            <ComputationalNotebook />
        </>
    );
}
