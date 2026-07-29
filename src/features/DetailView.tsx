
import type { Bugs, Category } from "../utils/types";
import { ArrowLeft, Calendar, Edit } from "lucide-react";
import CodeEditor from "./CodeEditor";
import Header from "./Header";
import StatusBadge from "./StatusBadge.tsx";
import SeverityBadge from "./SeverityBadge.tsx";
import { useNavigate } from "react-router-dom";

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

interface DetailViewProps {
    bug: Bugs;
    CAT_ICONS: Record<Category, IconComponent>;
    onBack: () => void;
    onNewBug: () => void;
}


export default function DetailView({ bug, CAT_ICONS, onBack, onNewBug }: DetailViewProps) {
    const CatIcon = CAT_ICONS[bug.category];
    const navigate = useNavigate();

    function handleEditForm() {
        navigate(`/edit/${bug.id}`);
    }

    return (
        <>
            <div className="min-h-screen bg-[#050a05] text-[#00ff41] font-['JetBrains_Mono',monospace] flex flex-col">

                <Header onHome={onBack} onNewBug={onNewBug} showBack />

                <main
                    className="flex-1 max-w-3xl mx-auto w-full px-6 py-8"
                    style={{ animation: "slideUp 0.35s ease both" }}
                >
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-[10px] text-[#00882a] hover:text-[#00ff41] font-mono transition-colors mb-7"
                    >
                        <ArrowLeft size={11} />
                        &lt; BACK_TO_DATABASE
                    </button>


                    <div className="border border-[#00ff41]/20 p-5 mb-4 bg-[#0a150a]/40">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <div
                                    className="font-['VT323'] text-[52px] text-[#00ff41] glow leading-none mb-2"
                                    style={{ animation: "flicker 11s ease-in-out infinite" }}
                                >
                                    {bug.title}
                                    <button onClick={handleEditForm} className="ml-2"><Edit /></button>
                                </div>
                                <div className="flex items-center gap-2.5 text-[10px] text-[#00882a]">
                                    <CatIcon size={11} />
                                    <span>{bug.category}</span>
                                    <span className="text-[#00ff41]/20">│</span>
                                    <Calendar size={10} />
                                    <span>{bug.created_at}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <SeverityBadge severity={bug.severity} />
                                <StatusBadge status={bug.status} />
                            </div>
                        </div>
                    </div>

                    {[
                        {
                            label: "DESCRIPTION",
                            prompt: "cat bug.description",
                            content: bug.description,
                            empty: "// NO DESCRIPTION RECORDED",
                        },
                        {
                            label: "SOLUTION",
                            prompt: "cat bug.solution",
                            content: bug.solution,
                            empty: "// NO SOLUTION DOCUMENTED YET — BUG REMAINS OPEN",
                        },
                    ].map(({ label, prompt, content, empty }) => (
                        <div key={label} className="border border-[#00ff41]/14 mb-4">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#0a150a] border-b border-[#00ff41]/14">
                                <span className="text-[9px] text-[#00882a] tracking-[0.2em]">{label}</span>
                                <span className="text-[9px] text-[#00882a]/50 font-mono">$ {prompt}</span>
                            </div>
                            <div className="p-4">
                                <p
                                    className={`text-xs leading-relaxed whitespace-pre-wrap ${content ? "text-[#00cc33]" : "text-[#00882a]/50 italic"
                                        }`}
                                >
                                    {content || empty}
                                </p>
                            </div>
                        </div>
                    ))}

                    {bug.code && (
                        <div className="border border-[#00ff41]/14 mb-4">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#0a150a] border-b border-[#00ff41]/14">
                                <span className="text-[9px] text-[#00882a] tracking-[0.2em]">CODE_SNIPPET</span>
                                <span className="text-[9px] text-[#00882a]/50 font-mono">$ cat bug.code</span>
                            </div>
                            <CodeEditor
                                value={bug.code}
                            />
                        </div>
                    )}

                    <div className="border border-[#00ff41]/14">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#0a150a] border-b border-[#00ff41]/14">
                            <span className="text-[9px] text-[#00882a] tracking-[0.2em]">METADATA</span>
                            <span className="text-[9px] text-[#00882a]/50 font-mono">$ env | grep BUG</span>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                            {(
                                [
                                    ["BUG_CODE", bug.title],
                                    ["CATEGORY", bug.category],
                                    ["SEVERITY", bug.severity],
                                    ["STATUS", bug.status],
                                    ["DATE_LOGGED", bug.created_at],
                                    ["RECORD_ID", bug.id],
                                ] as [string, string][]
                            ).map(([k, v]) => (
                                <div key={k} className="flex items-center gap-2 text-[11px]">
                                    <span className="text-[#00882a] min-w-24">{k}</span>
                                    <span className="text-[#00ff41]/30">=</span>
                                    <span className="text-[#00ff41] glow-sm">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>

    )
}