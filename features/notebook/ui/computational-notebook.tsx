import { NotebookScientificLinks } from "@/components/ecosystem/notebook-scientific-links";
import { NotebookWorkspace } from "@/features/notebook/ui/notebook-workspace";

export function ComputationalNotebook() {
    return (
        <>
            <NotebookWorkspace />
            <NotebookScientificLinks />
        </>
    );
}
