import type { Status } from "../utils/types";

export default function StatusBadge({ status }: { status: Status }) {
    const configs: Record<Status, string> = {
        Open: "bg-orange-500/10 border-orange-500/30 text-orange-400",
        Solved: "bg-[#00ff41]/10 border-[#00ff41]/30 text-[#00ff41]",
    };
    return (
        <span className={`px-2 py-0.5 border text-[9px] font-mono tracking-wider ${configs[status]}`}>
            {status.toUpperCase()}
        </span>
    );
}