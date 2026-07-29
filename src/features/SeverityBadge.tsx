import type { Severity } from "../utils/types";

export default function SeverityBadge({ severity }: { severity: Severity }) {
    const configs: Record<Severity, string> = {
        Critical: "bg-red-500/10 border-red-500/30 text-red-400",
        High: "bg-orange-500/10 border-orange-500/30 text-orange-400",
        Medium: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
        Low: "bg-emerald-500/10 border-[#00ff41]/30 text-[#00ff41]",
    };
    return (
        <span className={`px-2 py-0.5 border text-[9px] font-mono tracking-wider ${configs[severity]}`}>
            {severity.toUpperCase()}
        </span>
    );
}