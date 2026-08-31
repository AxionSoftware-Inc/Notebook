import Link from "next/link";
import { ArrowRight, BookOpenText, Braces, ChartNoAxesCombined, FileText, Sigma } from "lucide-react";

import { NotebookHeroScene } from "@/components/home/notebook-hero-scene";

function NotebookMark() {
    return (
        <svg viewBox="0 0 40 40" className="h-9 w-9 text-[var(--ax-accent)]" aria-hidden="true">
            <circle cx="20" cy="20" r="17.2" fill="none" stroke="currentColor" strokeWidth="1.05" />
            <path d="M11 11.5h18M11 17h14M11 22.5h18M11 28h11" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.68" />
            <circle cx="30.5" cy="28" r="1.65" fill="currentColor" />
        </svg>
    );
}

const navLink = "rounded-[var(--ax-radius-control)] px-2.5 py-2 text-[12px] font-semibold text-[var(--ax-text-soft)] outline-none transition-colors duration-[var(--ax-motion-fast)] hover:bg-[var(--ax-surface-soft)] hover:text-[var(--ax-text)] focus-visible:shadow-[var(--ax-focus-ring)]";
const container = "mx-auto w-full max-w-[1520px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20";

function NotebookDocumentPreview() {
    return (
        <div className="overflow-hidden rounded-[18px] border border-[var(--ax-line)] bg-[var(--ax-surface)] shadow-[var(--ax-shadow-floating)]">
            <div className="flex h-10 items-center justify-between border-b border-[var(--ax-line)] px-4 text-[10px] text-[var(--ax-text-faint)]">
                <span>Research Notebook · Thermal transport</span><span>Saved locally</span>
            </div>
            <div className="grid min-h-[520px] lg:grid-cols-[200px_minmax(0,1fr)]">
                <aside className="border-b border-[var(--ax-line)] bg-[var(--ax-surface-soft)] p-5 lg:border-b-0 lg:border-r">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ax-text-faint)]">Outline</div>
                    <div className="mt-4 space-y-1.5 text-[11px] font-semibold text-[var(--ax-text-soft)]">
                        {['Question', 'Model', 'Computation', 'Observation', 'Finding'].map((item, index) => (
                            <div key={item} className={`rounded-[7px] px-3 py-2.5 ${index === 3 ? 'bg-[var(--ax-surface)] text-[var(--ax-text)] shadow-[0_1px_2px_rgb(23_36_54_/_0.05)]' : ''}`}>{item}</div>
                        ))}
                    </div>
                    <div className="mt-8 border-t border-[var(--ax-line)] pt-5 text-[10px] leading-5 text-[var(--ax-text-faint)]">Text + equations<br />Code + results<br />Project context</div>
                </aside>

                <article className="bg-[var(--ax-canvas)] p-5 sm:p-8 lg:p-10">
                    <div className="mx-auto max-w-[820px]">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--ax-accent)]">Observation 03</p>
                        <h3 className="mt-3 font-serif text-[36px] tracking-[-0.04em]">Heat diffusion study</h3>
                        <p className="mt-3 max-w-[650px] text-[13px] leading-6 text-[var(--ax-text-soft)]">The temperature field smooths over time while preserving the symmetry implied by the boundary conditions.</p>

                        <div className="mt-7 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                            <div className="space-y-4">
                                <div className="rounded-[10px] border border-[var(--ax-line)] bg-[var(--ax-surface)] p-5">
                                    <div className="text-[9px] uppercase tracking-[0.12em] text-[var(--ax-text-faint)]">Model</div>
                                    <div className="mt-4 text-center font-serif text-[28px]">∂u/∂t = α∇²u</div>
                                </div>
                                <div className="rounded-[10px] border border-[#223550] bg-[#101827] p-5 font-mono text-[11px] leading-6 text-[#d9e7f8]">
                                    <span className="text-[#8eb7e8]">x</span> = linspace(0, 2π, 200)<br />
                                    <span className="text-[#8eb7e8]">u</span> = exp(-α*t) * sin(x)<br />
                                    plot(x, u)
                                </div>
                            </div>
                            <div className="rounded-[10px] border border-[var(--ax-line)] bg-[var(--ax-surface)] p-5">
                                <div className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[0.12em] text-[var(--ax-text-faint)]">Linked Math result</span><span className="text-[9px] font-semibold text-[var(--ax-accent)]">live context</span></div>
                                <svg viewBox="0 0 320 210" className="mt-5 h-[210px] w-full" aria-hidden="true">
                                    <path d="M18 105H303M160 18V194" stroke="#d7dfe9" strokeWidth="1" />
                                    <path d="M18 105 C48 55 77 56 105 105 C134 154 161 154 190 105 C219 56 248 56 302 105" fill="none" stroke="#2f6fbe" strokeWidth="2.2" />
                                    <path d="M18 105 C58 78 83 79 119 105 C154 131 181 131 217 105 C252 79 278 83 302 105" fill="none" stroke="#8db1e0" strokeWidth="1.2" opacity="0.75" />
                                </svg>
                                <div className="mt-4 border-t border-[var(--ax-line)] pt-4 text-[11px] leading-5 text-[var(--ax-text-soft)]"><span className="font-semibold text-[var(--ax-text)]">Finding.</span> Amplitude decays exponentially while the spatial mode remains smooth.</div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default function NotebookHomePage() {
    return (
        <div className="min-h-[calc(100vh-32px)] bg-[var(--ax-canvas)] text-[var(--ax-text)]">
            <header className="sticky top-0 z-40 border-b border-[var(--ax-line)] bg-[color-mix(in_srgb,var(--ax-surface)_94%,transparent)] backdrop-blur-xl">
                <div className={`${container} flex h-[72px] items-center justify-between gap-6`}>
                    <Link href="/" className="flex min-w-0 items-center gap-3.5 rounded-[var(--ax-radius-control)] outline-none focus-visible:shadow-[var(--ax-focus-ring)]">
                        <NotebookMark />
                        <span className="min-w-0 leading-none"><span className="block truncate font-serif text-[23px] font-medium tracking-[-0.035em]">Axion Notebook</span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--ax-text-faint)]">Research workspace</span></span>
                    </Link>
                    <nav className="hidden items-center gap-1 xl:flex" aria-label="Notebook product">
                        <Link href="#product" className={navLink}>Product</Link><Link href="#workflow" className={navLink}>Workflow</Link><Link href="#capabilities" className={navLink}>Capabilities</Link><Link href="#ecosystem" className={navLink}>Ecosystem</Link>
                    </nav>
                    <div className="flex items-center gap-2"><Link href="/workspace" className="hidden rounded-[var(--ax-radius-control)] px-3 py-2 text-[11px] font-semibold text-[var(--ax-text-soft)] hover:bg-[var(--ax-surface-soft)] sm:inline-flex">Workspace</Link><Link href="/workspace" className="inline-flex h-10 items-center rounded-[var(--ax-radius-control)] bg-[var(--ax-accent-strong)] px-4 text-[11px] font-semibold text-white hover:bg-[var(--ax-accent)] sm:px-5">Open Notebook <span className="ml-2 text-sm">→</span></Link></div>
                </div>
            </header>

            <main>
                <div className={container}>
                    <section className="relative grid min-h-[620px] items-center gap-6 overflow-hidden pb-8 pt-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-0 lg:pb-5 lg:pt-5">
                        <div className="relative z-10 max-w-[570px] py-10 lg:py-16">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ax-accent)]">Axion Notebook · research memory</p>
                            <h1 className="mt-4 font-serif text-[clamp(3.75rem,5.9vw,6.8rem)] font-medium leading-[0.92] tracking-[-0.058em]">Reasoning,<br />kept <span className="italic">alive.</span></h1>
                            <div className="mt-7 flex items-center gap-2" aria-hidden="true"><span className="h-[3px] w-16 rounded-full bg-[var(--ax-accent)]" /><span className="h-1.5 w-1.5 rounded-full bg-[#9b8cf0]" /></div>
                            <p className="mt-6 max-w-[470px] text-[17px] leading-8 text-[var(--ax-text-soft)] sm:text-[18px]">Capture explanations, formulas, code, figures and results without separating them from the scientific work that produced them.</p>
                            <div className="mt-8 flex flex-wrap items-center gap-3"><Link href="/workspace" className="inline-flex h-11 items-center gap-2 rounded-[var(--ax-radius-control)] bg-[var(--ax-accent-strong)] px-5 text-sm font-semibold text-white shadow-[var(--ax-shadow-subtle)] hover:bg-[var(--ax-accent)]">Open Notebook <ArrowRight className="h-4 w-4" /></Link><Link href="#product" className="inline-flex h-11 items-center gap-2 rounded-[var(--ax-radius-control)] px-4 text-sm font-semibold hover:bg-[var(--ax-surface-soft)]">Explore the product <ArrowRight className="h-3.5 w-3.5 text-[var(--ax-text-faint)]" /></Link></div>
                        </div>
                        <div className="relative min-w-0 lg:-ml-14 lg:-mr-8 xl:-ml-20 xl:-mr-12"><NotebookHeroScene /></div>
                    </section>
                </div>

                <section className="border-y border-[var(--ax-line)] bg-[var(--ax-surface)]"><div className={`${container} grid md:grid-cols-3 md:divide-x md:divide-[var(--ax-line)]`}>{[["Think", "Write questions, explanations and observations in a document made for reading."],["Compute", "Use mathematics and code when the reasoning needs them, not as the whole interface."],["Connect", "Keep results linked to the Project so context survives the next handoff."]].map(([title,text]) => <div key={title} className="border-b border-[var(--ax-line)] py-7 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"><div className="font-serif text-[24px] tracking-[-0.035em]">{title}</div><p className="mt-2 max-w-sm text-[13px] leading-6 text-[var(--ax-text-soft)]">{text}</p></div>)}</div></section>

                <section id="product" className="py-20 md:py-24 lg:py-28"><div className={container}><div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ax-accent)]">The product</p><h2 className="mt-4 max-w-[650px] font-serif text-[clamp(2.8rem,4.2vw,5.1rem)] leading-[0.98] tracking-[-0.05em]">A notebook that remembers the research, not just the text.</h2></div><p className="max-w-[650px] text-[16px] leading-8 text-[var(--ax-text-soft)] lg:justify-self-end">Build a readable research trail from question to finding. Typed blocks add structure when useful while the document stays calm and human-first.</p></div><div className="mt-12"><NotebookDocumentPreview /></div></div></section>

                <section id="workflow" className="border-y border-[var(--ax-line)] bg-[var(--ax-surface)] py-20 md:py-24"><div className={container}><div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ax-accent)]">Research workflow</p><h2 className="mt-4 font-serif text-[clamp(2.8rem,4vw,4.7rem)] leading-[1] tracking-[-0.05em]">From a question to a finding, in one readable trail.</h2><p className="mt-5 max-w-[440px] text-[15px] leading-7 text-[var(--ax-text-soft)]">Notebook is not another solver. It is the place where scientific context, interpretation and evidence stay together.</p></div><div className="divide-y divide-[var(--ax-line)] border-y border-[var(--ax-line)]">{[["01","Question","What are we trying to understand?"],["02","Model","State assumptions, equations and structure."],["03","Computation","Use Math results or code where needed."],["04","Observation","Record what the evidence actually shows."],["05","Finding","Keep the conclusion tied to its context."]].map(([step,title,text]) => <div key={step} className="grid gap-3 py-5 sm:grid-cols-[60px_150px_1fr] sm:items-center"><div className="font-serif text-[18px] text-[var(--ax-text-faint)]">{step}</div><div className="font-serif text-[25px] tracking-[-0.035em]">{title}</div><div className="text-[12px] leading-6 text-[var(--ax-text-soft)]">{text}</div></div>)}</div></div></div></section>

                <section id="capabilities" className="py-20 md:py-24 lg:py-28"><div className={container}><div className="max-w-[760px]"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ax-accent)]">Built for serious reasoning</p><h2 className="mt-4 font-serif text-[clamp(2.9rem,4.4vw,5.2rem)] leading-[0.98] tracking-[-0.05em]">A quiet document with scientific depth underneath.</h2></div><div className="mt-14 divide-y divide-[var(--ax-line)] border-y border-[var(--ax-line)]">
                    <article className="grid gap-8 py-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:py-14"><div><div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ax-text-faint)]">01 · Reading first</div><h3 className="mt-3 font-serif text-[34px] tracking-[-0.04em]">The document stays calm enough to think in.</h3><p className="mt-4 max-w-[470px] text-sm leading-7 text-[var(--ax-text-soft)]">Structure exists without turning every paragraph into a dashboard card or every thought into a form.</p></div><div className="lg:border-l lg:border-[var(--ax-line)] lg:pl-12"><div className="font-serif text-[30px] tracking-[-0.04em]">Observation</div><p className="mt-4 max-w-xl text-[15px] leading-8 text-[var(--ax-text-soft)]">The dominant spatial mode decays smoothly while preserving symmetry. This agrees with the boundary-constrained diffusion model.</p><div className="mt-6 h-px bg-[var(--ax-line)]" /><div className="mt-4 text-[10px] uppercase tracking-[0.13em] text-[var(--ax-text-faint)]">Readable prose · structured context</div></div></article>
                    <article className="grid gap-8 py-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:py-14"><div className="order-2 grid gap-3 sm:grid-cols-2 lg:order-1"><div className="rounded-[10px] border border-[var(--ax-line)] bg-[var(--ax-surface)] p-5 text-center font-serif text-[26px]">∂u/∂t = α∇²u</div><div className="rounded-[10px] border border-[#223550] bg-[#101827] p-5 font-mono text-[11px] leading-6 text-[#d9e7f8]">u = exp(-α*t) * sin(x)<br />plot(x, u)</div></div><div className="order-1 lg:order-2 lg:pl-10"><div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ax-text-faint)]">02 · Math and code when needed</div><h3 className="mt-3 font-serif text-[34px] tracking-[-0.04em]">Computation supports the reasoning.</h3><p className="mt-4 max-w-[470px] text-sm leading-7 text-[var(--ax-text-soft)]">Equations, code and scientific results appear exactly where they help explain the work.</p></div></article>
                    <article className="grid gap-8 py-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:py-14"><div><div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ax-text-faint)]">03 · Research memory</div><h3 className="mt-3 font-serif text-[34px] tracking-[-0.04em]">The context survives tomorrow.</h3><p className="mt-4 max-w-[470px] text-sm leading-7 text-[var(--ax-text-soft)]">Keep the Project, source result and reasoning trail together so the finding can be understood later.</p></div><div className="lg:border-l lg:border-[var(--ax-line)] lg:pl-12">{[["Project","Thermal transport"],["Source","Math · PDE result"],["Observation","Amplitude decays smoothly"],["Finding","Consistent with diffusion model"],["State","Saved on this device"]].map(([label,value]) => <div key={label} className="grid grid-cols-[110px_1fr] border-b border-[var(--ax-line)] py-3 text-[12px]"><span className="text-[var(--ax-text-faint)]">{label}</span><span className="font-semibold">{value}</span></div>)}</div></article>
                </div></div></section>

                <section id="ecosystem" className="border-y border-[var(--ax-line)] bg-[var(--ax-surface)] py-20 md:py-24 lg:py-28"><div className={container}><div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ax-accent)]">Connected scientific work</p><h2 className="mt-4 font-serif text-[clamp(2.8rem,4.2vw,5rem)] leading-[1] tracking-[-0.05em]">Notebook sits between computation and publication.</h2><p className="mt-5 max-w-[500px] text-[15px] leading-7 text-[var(--ax-text-soft)]">Bring evidence from Math, reason about it here, then move the finding into Writer without rebuilding the scientific context.</p></div><div className="grid md:grid-cols-3">{[{step:'01',title:'Math',text:'Create the evidence.',icon:Sigma},{step:'02',title:'Notebook',text:'Reason about it.',icon:BookOpenText},{step:'03',title:'Writer',text:'Publish the finding.',icon:FileText}].map((item,index)=><div key={item.title} className={`relative border-t border-[var(--ax-line)] py-6 md:border-t-0 md:px-7 ${index?'md:border-l':''}`}><div className="flex items-center justify-between"><item.icon className="h-5 w-5 text-[var(--ax-accent)]" /><span className="font-serif text-[18px] text-[var(--ax-text-faint)]">{item.step}</span></div><div className="mt-8 font-serif text-[28px] tracking-[-0.04em]">{item.title}</div><p className="mt-2 text-[12px] leading-6 text-[var(--ax-text-soft)]">{item.text}</p>{index<2?<ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[var(--ax-text-faint)] md:block" />:null}</div>)}</div></div></div></section>

                <section className="py-24 md:py-32"><div className={container}><div className="mx-auto max-w-[980px] text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ax-accent)]">Axion Notebook</p><h2 className="mt-5 font-serif text-[clamp(3rem,5.2vw,6.2rem)] leading-[0.95] tracking-[-0.055em]">Keep the reasoning close to the <span className="italic">science.</span></h2><p className="mx-auto mt-6 max-w-[600px] text-[16px] leading-8 text-[var(--ax-text-soft)]">Open a quiet research workspace for notes, mathematics, code, evidence and findings.</p><Link href="/workspace" className="mt-8 inline-flex h-12 items-center gap-2 rounded-[var(--ax-radius-control)] bg-[var(--ax-accent-strong)] px-6 text-sm font-semibold text-white hover:bg-[var(--ax-accent)]">Open Notebook <ArrowRight className="h-4 w-4" /></Link></div></div></section>
            </main>

            <footer className="border-t border-[var(--ax-line)] bg-[var(--ax-surface)] py-10"><div className={`${container} grid gap-8 md:grid-cols-[1fr_auto] md:items-end`}><div><div className="font-serif text-[24px] tracking-[-0.035em]">Axion Notebook</div><p className="mt-2 max-w-md text-[11px] leading-5 text-[var(--ax-text-faint)]">Research memory and scientific reasoning inside Axion Science.</p><div className="mt-6 text-[10px] text-[var(--ax-text-faint)]">Axion Science</div></div><nav className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-[var(--ax-text-soft)]"><Link href="#product">Product</Link><Link href="#workflow">Workflow</Link><Link href="#ecosystem">Ecosystem</Link><Link href="/workspace" className="text-[var(--ax-accent)]">Open Notebook →</Link></nav></div></footer>
        </div>
    );
}
