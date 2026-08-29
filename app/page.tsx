import Link from "next/link";
import { ArrowRight, BookOpenText, Braces, ChartNoAxesCombined } from "lucide-react";

function NotebookMark() {
    return (
        <svg viewBox="0 0 36 36" className="h-8 w-8 text-[var(--ax-accent)]" aria-hidden="true">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
            <path d="M10 10.5h16M10 15.5h12M10 20.5h16M10 25.5h9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.72" />
            <circle cx="27" cy="25.5" r="2.2" fill="currentColor" opacity="0.9" />
        </svg>
    );
}

const navLink = "rounded-[var(--ax-radius-control)] px-2 py-1.5 text-[12px] font-semibold text-[var(--ax-text-soft)] outline-none transition-colors duration-[var(--ax-motion-fast)] hover:bg-[var(--ax-surface-soft)] hover:text-[var(--ax-text)] focus-visible:shadow-[var(--ax-focus-ring)]";

export default function NotebookHomePage() {
    return (
        <div className="min-h-[calc(100vh-32px)] bg-[var(--ax-canvas)] text-[var(--ax-text)]">
            <header className="sticky top-0 z-40 border-b border-[var(--ax-line)] bg-[color-mix(in_srgb,var(--ax-surface)_96%,transparent)] backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-full max-w-[var(--ax-content-max)] items-center justify-between gap-5 px-4 sm:px-6">
                    <Link href="/" className="flex min-w-0 items-center gap-3 rounded-[var(--ax-radius-control)] outline-none focus-visible:shadow-[var(--ax-focus-ring)]">
                        <NotebookMark />
                        <span className="truncate text-[19px] font-medium tracking-[-0.025em] sm:text-[20px]">Axion Notebook</span>
                    </Link>
                    <nav className="flex items-center gap-1 sm:gap-3" aria-label="Notebook">
                        <div className="hidden items-center gap-1 lg:flex">
                            <Link href="#workflow" className={navLink}>Workflow</Link>
                            <Link href="#blocks" className={navLink}>Blocks</Link>
                            <Link href="/workspace" className={navLink}>Workspace</Link>
                        </div>
                        <Link href="/workspace" className="ml-1 inline-flex h-9 items-center rounded-[var(--ax-radius-control)] bg-[var(--ax-accent-strong)] px-4 text-[11px] font-semibold text-white outline-none transition-colors hover:bg-[var(--ax-accent)] focus-visible:shadow-[var(--ax-focus-ring)]">
                            Open Notebook
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 pb-12 pt-12 sm:px-8 lg:grid-cols-[0.66fr_1.34fr] lg:gap-12 lg:px-10 lg:pb-10 lg:pt-10 xl:px-12">
                    <div className="max-w-[500px] lg:pb-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ax-accent)]">Research memory · connected to the Project</p>
                        <h1 className="mt-4 font-serif text-[clamp(3.35rem,5.4vw,5.9rem)] font-medium leading-[0.95] tracking-[-0.055em]">
                            Reasoning,
                            <br />
                            kept alive.
                        </h1>
                        <div className="mt-6 h-[3px] w-14 bg-[var(--ax-accent)]" />
                        <p className="mt-5 max-w-[430px] text-[17px] leading-7 text-[var(--ax-text-soft)] sm:text-[18px]">
                            Capture explanations, formulas, code, figures and results without separating them from the scientific work that produced them.
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <Link href="/workspace" className="inline-flex h-11 items-center gap-2 rounded-[var(--ax-radius-control)] bg-[var(--ax-accent-strong)] px-5 text-sm font-semibold text-white shadow-[var(--ax-shadow-subtle)]">
                                Open Notebook <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="#workflow" className="inline-flex h-11 items-center rounded-[var(--ax-radius-control)] border border-[var(--ax-line-strong)] bg-[var(--ax-surface)] px-5 text-sm font-semibold text-[var(--ax-text)]">
                                See the workflow
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[15px] border border-[var(--ax-line)] bg-[var(--ax-surface)] shadow-[var(--ax-shadow-floating)]">
                        <div className="flex h-9 items-center justify-between border-b border-[var(--ax-line)] px-3.5 text-[10px] text-[var(--ax-text-faint)]">
                            <span>Research Notebook · Heat Equation</span><span>Saved</span>
                        </div>
                        <div className="grid min-h-[390px] md:grid-cols-[150px_1fr]">
                            <aside className="border-b border-[var(--ax-line)] bg-[var(--ax-surface-soft)] p-3 md:border-b-0 md:border-r">
                                <div className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[var(--ax-text-faint)]">Outline</div>
                                <div className="mt-3 space-y-1 text-[10px] text-[var(--ax-text-soft)]">
                                    {['Question', 'Model', 'Computation', 'Observation', 'Finding'].map((item, index) => (
                                        <div key={item} className={`rounded-[6px] px-2 py-2 ${index === 3 ? 'bg-[var(--ax-surface)] font-semibold text-[var(--ax-text)] shadow-[0_1px_2px_rgb(23_36_54_/_0.05)]' : ''}`}>{item}</div>
                                    ))}
                                </div>
                            </aside>
                            <div className="p-5 sm:p-7">
                                <div className="mx-auto max-w-[720px]">
                                    <div className="font-serif text-[29px] tracking-[-0.035em]">Heat diffusion study</div>
                                    <div className="mt-2 text-[11px] text-[var(--ax-text-faint)]">Project · Thermal transport · edited just now</div>
                                    <div className="mt-6 space-y-3">
                                        <div className="rounded-[9px] border border-[var(--ax-line)] bg-[var(--ax-surface)] p-4 text-[12px] leading-6 text-[var(--ax-text-soft)]">
                                            The model describes how a temperature field evolves under diffusion with a fixed conductivity parameter.
                                        </div>
                                        <div className="rounded-[9px] border border-[var(--ax-line)] bg-[var(--ax-surface-soft)] px-4 py-4 text-center font-serif text-[22px] text-[var(--ax-text)]">
                                            ∂u/∂t = α∇²u
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                                            <div className="rounded-[9px] border border-[var(--ax-line)] bg-[#101827] p-4 font-mono text-[10px] leading-5 text-[#dbe7f6]">
                                                x = linspace(0, 2π, 200)<br />u = exp(-α*t) * sin(x)<br />plot(x, u)
                                            </div>
                                            <div className="rounded-[9px] border border-[var(--ax-line)] bg-[var(--ax-surface)] p-4">
                                                <div className="text-[9px] text-[var(--ax-text-faint)]">Linked result</div>
                                                <svg viewBox="0 0 250 78" className="mt-2 h-[78px] w-full" aria-hidden="true">
                                                    <path d="M4 39H246" stroke="#d4dbe5" strokeWidth="1" />
                                                    <path d="M4 39 C30 8 58 8 84 39 C110 70 138 70 164 39 C190 8 218 8 246 39" fill="none" stroke="#245da8" strokeWidth="2" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="rounded-[9px] border border-[var(--ax-line)] bg-[var(--ax-accent-soft)] p-4 text-[12px] leading-6 text-[var(--ax-text)]">
                                            <span className="font-semibold">Observation.</span> Amplitude decays while the spatial mode remains smooth, matching the expected diffusion behavior.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="workflow" className="border-y border-[var(--ax-line)] bg-[var(--ax-surface)]">
                    <div className="mx-auto grid max-w-[1180px] gap-0 px-6 sm:px-8 md:grid-cols-3">
                        {[
                            { icon: BookOpenText, title: 'Reason', text: 'Write explanations and observations beside the work they describe.' },
                            { icon: Braces, title: 'Compute', text: 'Keep formulas and code close without turning the notebook into an IDE.' },
                            { icon: ChartNoAxesCombined, title: 'Connect', text: 'Bring saved Math results into the same research trail.' },
                        ].map((item, index) => (
                            <div key={item.title} className={`py-6 md:px-7 ${index ? 'md:border-l md:border-[var(--ax-line)]' : ''}`}>
                                <item.icon className="h-4 w-4 text-[var(--ax-accent)]" />
                                <div className="mt-3 text-sm font-semibold">{item.title}</div>
                                <p className="mt-1 text-sm leading-6 text-[var(--ax-text-soft)]">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="blocks" className="mx-auto max-w-[1180px] px-6 py-14 sm:px-8 lg:py-20">
                    <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ax-accent)]">One quiet document</p>
                            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Blocks when useful. Reading first.</h2>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {['Text & notes', 'Mathematics', 'Code & computation', 'Plots & scientific results'].map((item) => (
                                <div key={item} className="border-t border-[var(--ax-line)] py-4 text-sm font-semibold text-[var(--ax-text)]">{item}</div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
