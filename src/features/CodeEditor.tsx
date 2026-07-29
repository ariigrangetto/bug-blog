import { Code2 } from "lucide-react";
import type { CodeLang } from "../utils/types";
import { memo, useMemo, useRef, useState } from "react";

const CODE_LANGS: CodeLang[] = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "Rust",
    "C++",
    "C#",
    "CSS",
    "HTML",
    "SQL",
    "Shell"
];

function escHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const KW = new Set([
    "function", "const", "let", "var", "return", "if", "else", "for", "while", "do", "break",
    "continue", "class", "import", "export", "from", "default", "async", "await", "try", "catch",
    "finally", "throw", "new", "typeof", "instanceof", "void", "null", "undefined", "true", "false",
    "def", "lambda", "pass", "in", "not", "and", "or", "is", "elif", "None", "True", "False", "with",
    "yield", "global", "nonlocal", "raise", "del", "as", "assert", "print", "range",
    "type", "interface", "extends", "implements", "public", "private", "protected", "static",
    "abstract", "readonly", "enum", "namespace", "declare", "keyof", "of", "override",
    "int", "long", "short", "byte", "float", "double", "char", "boolean", "string", "str", "bool",
    "list", "dict", "tuple", "set", "self", "super", "this",
    "fn", "mut", "struct", "impl", "use", "mod", "trait", "pub", "match", "Some", "Ok", "Err", "where", "move",
    "SELECT", "FROM", "WHERE", "JOIN", "ON", "GROUP", "BY", "ORDER", "HAVING", "INSERT", "INTO",
    "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "DROP", "TABLE", "INDEX", "ALTER", "AND", "OR",
    "NOT", "LIKE", "IS", "AS", "DISTINCT", "LIMIT", "OFFSET", "LEFT", "RIGHT", "INNER",
    "OUTER", "FULL", "CROSS", "UNION", "ALL", "CASE", "WHEN", "THEN", "END", "WITH",
]);

const TOKEN_RE = new RegExp(
    [
        "(\\/\\/[^\\n]*|#[^\\n]*)",
        "(\\/\\*[\\s\\S]*?\\*\\/)",
        "(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')",
        "(`(?:[^`\\\\]|\\\\.)*`)",
        "(\\b\\d+\\.?\\d*(?:[eE][+-]?\\d+)?\\b)",
        "(\\b[a-zA-Z_$][\\w$]*(?=\\s*\\())",
        "(\\b[a-zA-Z_$][\\w$]*\\b)",
        "(===|!==|=>|==|!=|<=|>=|&&|\\|\\||[+\\-*\\/%=<>!&|^~?]+)",
        "([;:.,(){}\\[\\]])",
    ].join("|"),
    "g"
);

const C = {
    comment: "#64748b",
    string: "#f59e0b",
    number: "#c084fc",
    keyword: "#38bdf8",
    fn: "#60a5fa",
    operator: "#38bdf8",
    punct: "#94a3b8",
    plain: "#e2e8f0",
};

function tokenizedToHTML(code: string): string {
    let out = "";
    let last = 0;
    let m: RegExpExecArray | null;
    TOKEN_RE.lastIndex = 0;

    while ((m = TOKEN_RE.exec(code)) !== null) {
        if (m.index > last) {
            out += `<span style="color:${C.plain}">${escHtml(code.slice(last, m.index))}</span>`;
        }

        const full = m[0];
        if (m[1] || m[2]) {
            out += `<span style="color:${C.comment};font-style:italic">${escHtml(full)}</span>`;
        } else if (m[3] || m[4]) {
            out += `<span style="color:${C.string}">${escHtml(full)}</span>`;
        } else if (m[5]) {
            out += `<span style="color:${C.number}">${escHtml(full)}</span>`;
        } else if (m[6]) {
            out += `<span style="color:${C.fn}">${escHtml(full)}</span>`;
        } else if (m[7]) {
            const isKw = KW.has(full);
            out += `<span style="color:${isKw ? C.keyword : C.plain};${isKw ? "font-weight:600" : ""}">${escHtml(full)}</span>`;
        } else if (m[8]) {
            out += `<span style="color:${C.operator}">${escHtml(full)}</span>`;
        } else if (m[9]) {
            out += `<span style="color:${C.punct}">${escHtml(full)}</span>`;
        }

        last = TOKEN_RE.lastIndex;
    }

    if (last < code.length) {
        out += `<span style="color:${C.plain}">${escHtml(code.slice(last))}</span>`;
    }

    return out;
}

export interface CodeEditorProps {
    value: string;
    onChange?: (code: string, language: CodeLang) => void;
    name?: string;
    readOnly?: boolean;
}

function CodeEditor({ value, onChange, name, readOnly = false }: CodeEditorProps) {
    const [language, setLanguage] = useState<CodeLang>("JavaScript");
    const [copied, setCopied] = useState<boolean>(false);
    const taRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const numberLinesRef = useRef<HTMLDivElement>(null);

    const lineCount = Math.max(6, value.split("\n").length);
    const editorH = Math.min(300, Math.max(140, lineCount * 20 + 28));

    const syncScroll = () => {
        if (!taRef.current) return;
        if (preRef.current) {
            preRef.current.scrollTop = taRef.current.scrollTop;
            preRef.current.scrollLeft = taRef.current.scrollLeft;
        }
        if (numberLinesRef.current) {
            numberLinesRef.current.scrollTop = taRef.current.scrollTop;
        }
    };

    const highlighted = useMemo(() => tokenizedToHTML(value || ""), [value]);

    function handleCopy() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(value).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            });
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Tab") {
            e.preventDefault();
            const target = e.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const val = value || "";

            if (e.shiftKey) {
                const valBefore = val.substring(0, start);
                let removeCount = 0;

                if (valBefore.endsWith("  ")) {
                    removeCount = 2;
                } else if (valBefore.endsWith(" ")) {
                    removeCount = 1;
                }

                if (removeCount > 0) {
                    const newValue = valBefore.substring(0, valBefore.length - removeCount) + val.substring(end);
                    onChange?.(newValue, language);
                    setTimeout(() => {
                        target.selectionStart = target.selectionEnd = start - removeCount;
                    }, 0);
                }
            } else {
                const newValue = val.substring(0, start) + "  " + val.substring(end);
                onChange?.(newValue, language);
                setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + 2;
                }, 0);
            }
        }
    }

    return (
        <div className="border border-[#00ff41]/22 overflow-hidden bg-[#020802]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#060e06] border-b border-[#00ff41]/15">
                <div className="flex items-center gap-2">
                    <Code2 size={11} className="text-[#00882a]" />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as CodeLang)}
                        className="bg-transparent text-[#00882a] text-[9px] font-mono outline-none cursor-pointer"
                        style={{ appearance: "none" }}
                    >
                        {CODE_LANGS.map((l) => (
                            <option key={l} value={l} style={{ background: "#050a05", color: "#00ff41" }}>
                                {l}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden sm:block text-[9px] text-[#00882a]/50 font-mono">
                        {lineCount} {lineCount === 1 ? "line" : "lines"}
                    </span>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="text-[9px] font-mono transition-colors"
                        style={{ color: copied ? "#00ff41" : "#00882a" }}
                    >
                        {copied ? "✓ COPIED" : "COPY"}
                    </button>
                </div>
            </div>

            <div className="flex" style={{ height: editorH }}>
                <div
                    ref={numberLinesRef}
                    className="shrink-0 w-10 overflow-hidden bg-[#040c04] border-r border-[#00ff41]/10 py-3 select-none"
                    style={{ paddingRight: "8px" }}
                >
                    {Array.from({ length: lineCount }, (_, i) => (
                        <div
                            key={i}
                            className="text-right font-mono leading-5"
                            style={{ fontSize: "10px", color: "rgba(148, 163, 184, 0.45)" }}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                <div className="relative flex-1 overflow-hidden">
                    <pre
                        ref={preRef}
                        aria-hidden="true"
                        className="absolute inset-0 m-0 overflow-hidden pointer-events-none"
                        style={{
                            padding: "12px",
                            fontSize: "11px",
                            lineHeight: "20px",
                            fontFamily: "'JetBrains Mono', monospace",
                            whiteSpace: "pre",
                            tabSize: 2,
                        }}
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                    {readOnly ? (
                        <div
                            className="absolute inset-0 overflow-auto"
                            style={{ padding: "12px", fontSize: "11px", lineHeight: "20px" }}
                        />
                    ) : (
                        <textarea
                            ref={taRef}
                            name={name}
                            value={value}
                            onChange={(e) => onChange?.(e.target.value, language)}
                            onKeyDown={handleKeyDown}
                            onScroll={syncScroll}
                            spellCheck={false}
                            autoCapitalize="none"
                            autoCorrect="off"
                            className="absolute inset-0 w-full h-full overflow-auto resize-none outline-none"
                            style={{
                                padding: "12px",
                                fontSize: "11px",
                                lineHeight: "20px",
                                fontFamily: "'JetBrains Mono', monospace",
                                whiteSpace: "pre",
                                tabSize: 2,
                                background: "transparent",
                                color: "transparent",
                                caretColor: "#38bdf8",
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(CodeEditor);