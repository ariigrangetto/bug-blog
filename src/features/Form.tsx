/* eslint-disable react/jsx-no-comment-textnodes */
import { CheckCircle } from "lucide-react";
import Header from "./Header.tsx";
import Cursor from "./Cursor.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import type { Category, CodeLang, Severity, Status } from "../utils/types";
import CodeEditor from "./CodeEditor.tsx";
import useBugsActions from "../hooks/useBugsActions.tsx";
import useBugs from "../hooks/useBugs.tsx";

const CATEGORIES: Category[] = ["Runtime", "Logic", "UI", "Performance", "Security", "Network", "Other"];
const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];

const SEVERITY_CONFIG = {
    Critical: {
        text: "text-red-400",
        border: "border-red-500/40",
        bg: "bg-red-500/10",
        dot: "bg-red-400",
    },
    High: {
        text: "text-orange-400",
        border: "border-orange-500/40",
        bg: "bg-orange-500/10",
        dot: "bg-orange-400",
    },
    Medium: {
        text: "text-yellow-400",
        border: "border-yellow-500/40",
        bg: "bg-yellow-500/10",
        dot: "bg-yellow-400",
    },
    Low: {
        text: "text-[#00ff41]",
        border: "border-[#00ff41]/40",
        bg: "bg-[#00ff41]/10",
        dot: "bg-[#00ff41]",
    },

}

const STATUSES: Status[] = ["Open", "Solved"];
const STATUS_CONFIG = {
    Open: {
        text: "text-orange-400",
        border: "border-orange-500/40",
        bg: "bg-orange-500/10",
        dot: "bg-orange-400",
    },
    Solved: {
        text: "text-[#00ff41]",
        border: "border-[#00ff41]/40",
        bg: "bg-[#00ff41]/10",
        dot: "bg-[#00ff41]",
    },
};

export default function Form() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { createBug, updateBug, findBugById } = useBugsActions();
    const { bugs } = useBugs();
    const [error, setError] = useState<string>();
    const { id } = useParams();
    const [edit, setEdit] = useState<boolean>(false)
    const [form, setForm] = useState<{ code: string, category: Category, description: string, solution: string, severity: Severity, status: Status, title: string, language: CodeLang }>({
        code: "",
        category: "Other",
        description: "",
        solution: "",
        severity: "Low",
        status: "Open",
        title: "",
        language: "JavaScript"
    });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const { code, category, description, solution, status, severity, title, language } = form;

        if (!code || !category || !description || !status || !severity || !title || !language) {
            setSubmitted(false);
            setError("Please fill all the required fields.");
            return;
        }


        const { error } = await createBug(code, description, solution, status, category, severity, title, language);

        if (error) {
            console.log(error);
            setSubmitted(false);
            setError(error);
            return;
        }
        setSubmitted(true);

        setTimeout(() => {
            navigate("/home");
        }, 3000)
    }

    useEffect(() => {
        async function load() {
            if (!id) return;
            setEdit(true);
            const { error: findErr, data: bug } = await findBugById();
            if (findErr) {
                setError(findErr);
                return;
            }
            if (bug && bug.length > 0) {
                console.log(bug)
                setForm((f) => ({
                    ...f,
                    code: bug[0].code,
                    category: bug[0].category,
                    description: bug[0].description,
                    solution: bug[0].solution,
                    severity: bug[0].severity,
                    status: bug[0].status,
                    title: bug[0].title,
                    language: bug[0].language,
                }));
            }
        }
        load();
    }, [id]);

    async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const { code, category, description, solution, status, severity, title, language } = form;

        if (!code || !category || !description || !status || !severity || !title || !language) {
            setSubmitted(false);
            setError("Please fill all the required fields.");
            return;
        }

        const { error } = await updateBug(code, description, solution, status, category, severity, title, language);

        if (error) {
            console.log(error);
            setSubmitted(false);
            setError(error);
            return;
        }

        setSubmitted(true);

        setTimeout(() => {
            navigate("/home");
        }, 3000)
    }


    const fieldCls =
        "w-full bg-[rgba(0,255,65,0.03)] border border-[#00ff41]/20 text-[#00ff41] text-xs font-mono px-3 py-2 outline-none placeholder-[#00882a]/50 focus:border-[#00ff41]/55 focus:shadow-[0_0_0_1px_rgba(0,255,65,0.14),0_0_14px_rgba(0,255,65,0.07)] transition-all";


    function handleBack() {
        navigate("/home");
    }

    const handleCodeEditor = useCallback((v: string, lang: string) => {
        setForm((f) => ({ ...f, code: v, language: lang as CodeLang }));
    }, []);

    const year = new Date().getFullYear();

    const lastBugTitle = bugs[bugs.length - 1]?.title;
    let nextNumStr = "001";

    if (lastBugTitle) {
        const lastNum = parseInt(lastBugTitle.split("-").pop() || "", 10);
        if (!isNaN(lastNum)) {
            nextNumStr = String(lastNum + 1).padStart(3, "0");
        }
    }

    const bugCodePlaceholder = `BUG-${year}-${nextNumStr}`;

    return (
        <>
            <div className="min-h-screen bg-[#050a05] text-[#00ff41] font-['JetBrains_Mono',monospace] flex flex-col">
                <Header onHome={handleBack} showBack />

                <main
                    className="flex-1 flex items-start justify-center px-4 py-10"
                    style={{ animation: "slideUp 0.4s ease both" }}
                >

                    <div className="w-full max-w-xl">
                        <div className="border border-[#00ff41]/22 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a150a] border-b border-[#00ff41]/18">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/55" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/55" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41]/55" />
                                </div>
                                <span className="flex-1 text-center text-[9px] text-[#00882a] font-mono tracking-[0.2em]">
                                    bug_log_entry.sh &mdash; /dev/stdin
                                </span>
                            </div>
                            <div className="p-6 md:p-8">
                                {submitted ? (
                                    <div className="py-14 text-center">
                                        <CheckCircle size={44} className="text-[#00ff41] glow mx-auto mb-5" />
                                        <div
                                            className="font-['VT323'] text-5xl text-[#00ff41] glow mb-3"
                                            style={{ animation: "flicker 2s ease-in-out infinite" }}
                                        >
                                            BUG LOGGED
                                        </div>
                                        <div className="text-[11px] text-[#00882a] space-y-1">
                                            <div>&gt; Writing record to database... <span className="text-[#00ff41]">DONE</span></div>
                                            <div>&gt; Validating integrity... <span className="text-[#00ff41]">OK</span></div>
                                            <div>&gt; Redirecting to dashboard <Cursor /></div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={edit ? handleEdit : handleSubmit} className="space-y-6">
                                        <div className="text-[11px] text-[#00882a] space-y-0.5 mb-4 select-none">
                                            <div>&gt; INIT NEW BUG ENTRY &mdash; FILL ALL REQUIRED FIELDS</div>
                                            <div className="flex items-center gap-1">
                                                &gt; AWAITING INPUT <Cursor />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-[#00882a] tracking-[0.18em] mb-1.5">
                                                // BUG_CODE &nbsp;<span className="text-red-400">*</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#00882a] text-sm select-none shrink-0">$</span>
                                                <input
                                                    name="title"
                                                    className={fieldCls}
                                                    value={form.title}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            title: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
                                                        }))
                                                    }
                                                    placeholder={bugCodePlaceholder}
                                                />
                                            </div>
                                            <div className="text-[9px] text-[#00882a]/60 mt-1 ml-5">FORMAT: ALPHA-YYYY-NNN</div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div>
                                                <label className="block text-[10px] text-[#00882a] tracking-[0.18em] mb-1.5">
                        // CATEGORY &nbsp;<span className="text-red-400">*</span>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#00882a] text-sm select-none shrink-0">$</span>
                                                    <select
                                                        name="category"
                                                        required
                                                        className={fieldCls + " cursor-pointer"}
                                                        value={form.category}
                                                        onChange={(e) =>
                                                            setForm((f) => ({ ...f, category: e.target.value as Category }))
                                                        }
                                                        style={{ background: "rgba(0,255,65,0.03)" }}
                                                    >
                                                        {CATEGORIES.map((c) => (
                                                            <option key={c} value={c} style={{ background: "#050a05", color: "#00ff41" }}>
                                                                {c}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] text-[#00882a] tracking-[0.18em] mb-1.5">
                        // SEVERITY &nbsp;<span className="text-red-400">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 gap-1">
                                                    {SEVERITIES.map((s) => {
                                                        const c = SEVERITY_CONFIG[s];
                                                        const active = form.severity === s;
                                                        return (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                name="severity"
                                                                onClick={() => setForm((f) => ({ ...f, severity: s }))}
                                                                className={`px-2 py-1.5 border text-[9px] font-mono tracking-wider transition-all ${active
                                                                    ? `${c.bg} ${c.border} ${c.text} font-bold`
                                                                    : "border-[#00ff41]/16 text-[#00882a] hover:border-[#00ff41]/30 hover:text-[#00cc33]"
                                                                    }`}
                                                            >
                                                                {active && "▶ "}
                                                                {s.toUpperCase()}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] text-[#00882a] tracking-[0.18em] mb-1.5">
                        // STATUS &nbsp;<span className="text-red-400">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 gap-1">
                                                    {STATUSES.map((s) => {
                                                        const c = STATUS_CONFIG[s];
                                                        const active = form.status === s;
                                                        return (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                name="status"
                                                                onClick={() => setForm((f) => ({ ...f, status: s }))}
                                                                className={`px-2 py-1.5 border text-[9px] font-mono tracking-wider transition-all ${active
                                                                    ? `${c.bg} ${c.border} ${c.text} font-bold`
                                                                    : "border-[#00ff41]/16 text-[#00882a] hover:border-[#00ff41]/30 hover:text-[#00cc33]"
                                                                    }`}
                                                            >
                                                                {active && "▶ "}
                                                                {s.toUpperCase()}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-[#00882a] tracking-[0.18em] mb-1.5">
                      // DESCRIPTION &nbsp;<span className="text-red-400">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <span className="text-[#00882a] text-sm mt-2 select-none shrink-0">$</span>
                                                <textarea
                                                    name="description"
                                                    required
                                                    rows={4}
                                                    className={fieldCls + " resize-none leading-relaxed"}
                                                    value={form.description}
                                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                                    placeholder="Describe the bug — behavior, context, steps to reproduce..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-[#00882a] tracking-[0.18em] mb-1.5">
                      // CODE_SNIPPET &nbsp;<span className="text-red-400">*</span>
                                            </label>
                                            <CodeEditor
                                                name="code"
                                                value={form.code}
                                                onChange={handleCodeEditor}
                                            />
                                            <div className="text-[9px] text-[#00882a]/50 mt-1">
                                                Paste the problematic code — select the language from the dropdown
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-[#00882a] tracking-[0.18em] mb-1.5">
                      // SOLUTION &nbsp;
                                            </label>
                                            <div className="flex gap-2">
                                                <span className="text-[#00882a] text-sm mt-2 select-none shrink-0">$</span>
                                                <textarea
                                                    name="solution"
                                                    rows={4}
                                                    className={fieldCls + " resize-none leading-relaxed"}
                                                    value={form.solution}
                                                    onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))}
                                                    placeholder="Describe how the bug was or can be resolved..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-1">
                                            <button
                                                type="submit"
                                                className="btn-primary flex-1 py-3 bg-[#00ff41] text-black text-xs font-mono font-bold tracking-widest cursor-pointer"
                                            >
                                                &gt; {edit ? "UPDATE_ENTRY" : "SUBMIT_ENTRY"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="btn-ghost px-6 py-3 border border-[#00ff41]/25 text-[#00882a] text-xs font-mono hover:text-[#00ff41] hover:border-[#00ff41]/50 transition-colors"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {!submitted && error && (
                            <div className="mt-3 text-xs text-red-400 font-mono flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}