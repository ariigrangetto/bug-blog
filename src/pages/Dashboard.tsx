/* eslint-disable react/jsx-no-comment-textnodes */
import { useNavigate } from "react-router-dom";
import Header from "../features/Header";
import MatrixRain from "../features/MatrixRain";
import useBugs from "../hooks/useBugs.tsx";
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Terminal,
  ChevronRight,
  Cpu,
  Bug,
  Layout,
  Activity,
  Shield,
  Globe,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Bugs, Category, Filter } from "../utils/types";
import SeverityBadge from "../features/SeverityBadge.tsx";
import StatusBadge from "../features/StatusBadge.tsx";
import DetailView from "../features/DetailView.tsx";
import useBugsActions from "../hooks/useBugsActions.tsx";

const FILTERS: Filter[] = ["All", "Critical", "High", "Medium", "Low", "Open", "Solved"];

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const CAT_ICONS: Record<Category, IconComponent> = {
  Runtime: Cpu,
  Logic: Bug,
  UI: Layout,
  Performance: Activity,
  Security: Shield,
  Network: Globe,
  Other: HelpCircle,
};


const dateCache = new Map<string, string>();
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  let cached = dateCache.get(dateStr);
  if (!cached) {
    cached = new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dateCache.set(dateStr, cached);
  }
  return cached;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { bugs, setBugs } = useBugs();
  const { deleteBug } = useBugsActions();
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedBug, setSelectedBug] = useState<Bugs | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const stats = useMemo(() => {
    let critical = 0;
    let solved = 0;
    let open = 0;

    for (const bug of bugs) {
      if (bug.severity === "Critical") critical++;
      if (bug.status === "Solved") solved++;
      if (bug.status === "Open") open++;
    }

    return { critical, solved, open };
  }, [bugs]);

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      if (filter === "All") return true;
      return bug.status === filter || bug.severity === filter;
    });
  }, [bugs, filter]);

  function navigateHome() {
    navigate("/home");
  }

  function handleNewBug() {
    navigate("/new");
  }

  async function handleDeleteBug(id: string) {
    const previousBugs = [...bugs];
    setBugs((prev) => prev.filter((b) => b.id !== id));

    const { error } = await deleteBug(id);
    if (error) {
      setBugs(previousBugs);
      setError(`DATABASE_TRANSACTION_ERROR: Failed to delete bug [${id}]. ${error}`);
      setTimeout(() => setError(""), 2500);
      return;
    }

    setSuccess(`RECORD_PURGED: Bug entry [${id}] successfully removed from database index.`);
    setTimeout(() => setSuccess(""), 2500);
  }

  if (selectedBug) {
    return (
      <DetailView
        bug={selectedBug}
        CAT_ICONS={CAT_ICONS}
        onBack={() => setSelectedBug(null)}
        onNewBug={handleNewBug}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#050a05] text-[#00ff41] font-['JetBrains_Mono',monospace] flex flex-col">
        <Header onHome={navigateHome} onNewBug={handleNewBug} showLogout={true} />
        <section className="relative h-72 overflow-hidden flex items-center justify-center select-none">
          <MatrixRain opacity={0.32} />

          <div className="relative z-20 text-center px-4" style={{ animation: "slideUp 0.55s ease both" }}>
            <div className="text-[10px] font-mono text-[#00882a] tracking-[0.35em] mb-3 uppercase">
              &gt; Initializing error knowledge base...
            </div>
            <h1
              className="font-['VT323'] text-[80px] md:text-[100px] text-[#00ff41] glow tracking-[0.12em] leading-none mb-3"
              style={{ animation: "flicker 9s ease-in-out infinite" }}
            >
              BUG_BLOG
            </h1>
            <p className="text-[#00882a] text-xs font-mono tracking-widest mb-7">
              PERSISTENT ERROR KNOWLEDGE BASE &nbsp;·&nbsp; v1.0.0
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleNewBug}
                className="btn-primary px-6 py-2.5 bg-[#00ff41] text-black text-xs font-mono font-bold cursor-pointer"
              >
                + LOG NEW BUG
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-20 bg-linear-to-t pointer-events-none from-[#050a05] to-transparent z-20" />
        </section>

        <div className="border-y border-[#00ff41]/14 bg-[#0a150a]/60">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-[#00ff41]/14 divide-y md:divide-y-0">
            {[
              { label: "TOTAL_BUGS", value: bugs?.length || 0, Icon: Database, cls: "text-[#00ff41]" },
              { label: "CRITICAL", value: stats.critical, Icon: AlertTriangle, cls: "text-red-400 glow-red" },
              { label: "SOLVED", value: stats.solved, Icon: CheckCircle, cls: "text-[#00ff41]" },
              { label: "OPEN", value: stats.open, Icon: Terminal, cls: "text-orange-400 glow-ora" },
            ].map(({ label, value, Icon, cls }) => (
              <div key={label} className="px-6 py-4 flex items-center gap-3">
                <Icon size={15} className="text-[#00882a] shrink-0" />
                <div>
                  <div className={`font-['VT323'] text-3xl leading-none ${cls}`}>{value}</div>
                  <div className="text-[9px] text-[#00882a] tracking-[0.2em] mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <main
          className="flex-1 max-w-6xl mx-auto w-full px-6 py-8"
          style={{ animation: "slideUp 0.5s 0.15s ease both", opacity: 0, animationFillMode: "forwards" }}
        >
          {error && (
            <div className="mb-5 p-3 border border-red-500/30 bg-red-500/05 text-red-400 text-xs font-mono flex items-center justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-ping" />
                <span>&gt; ERROR: {error}</span>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-400/50 hover:text-red-400 font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 border border-[#00ff41]/30 bg-[#00ff41]/05 text-[#00ff41] text-xs font-mono flex items-center justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] shrink-0 animate-ping" />
                <span>&gt; SUCCESS: {success}</span>
              </div>
              <button
                onClick={() => setSuccess("")}
                className="text-[#00882a] hover:text-[#00ff41] font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center flex-wrap gap-1">
              <span className="text-[#00882a] text-[10px] font-mono mr-2 tracking-widest">&gt; FILTER:</span>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-[10px] font-mono border tracking-wider transition-colors cursor-pointer ${filter === f
                    ? "bg-[#00ff41] text-black border-[#00ff41]"
                    : "border-[#00ff41]/18 text-[#00882a] hover:border-[#00ff41]/40 hover:text-[#00ff41]"
                    }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-[#00882a] font-mono tracking-widest">
              {filteredBugs.length}/{bugs.length} RECORDS
            </span>
          </div>

          <div className="border border-[#00ff41]/14 bg-[#0a150a]/20">
            <div className="hidden md:grid grid-cols-[1fr_110px_96px_80px_88px_40px] gap-4 px-4 py-2 bg-[#0a150a] border-b border-[#00ff41]/14">
              {["DESCRIPTION", "CATEGORY", "SEVERITY", "STATUS", "DATE", ""].map((h, idx) => (
                <span key={idx} className="text-[9px] text-[#00882a] tracking-[0.2em]">
                  {h}
                </span>
              ))}
            </div>

            {filteredBugs.length === 0 ? (
              <div className="px-6 py-16 text-center text-[#00882a] text-xs font-mono">
                <Terminal size={28} className="mx-auto mb-3 opacity-30" />
                <div>&gt; NO RECORDS MATCH CURRENT FILTER.</div>
                <div className="mt-1">&gt; ADJUST FILTER OR LOG A NEW BUG.</div>
              </div>
            ) : (
              filteredBugs.map((bug, i) => {
                const CatIcon = CAT_ICONS[bug.category] || HelpCircle;
                const formattedDate = formatDate(bug.created_at);
                return (
                  <div
                    key={bug.id}
                    className={`flex items-center justify-between border-b border-[#00ff41]/08 transition-all group ${i % 2 === 1 ? "bg-[#00ff41]/[0.018]" : ""
                      }`}
                  >
                    <button
                      onClick={() => setSelectedBug(bug)}
                      className="flex-1 grid md:grid-cols-[1fr_110px_96px_80px_88px] gap-3 md:gap-4 px-4 py-3 text-left transition-all cursor-pointer group-hover:bg-[#00ff41]/05"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[#00ff41]/50 text-[10px] font-mono">{bug.title}</span>
                          <ChevronRight
                            size={10}
                            className="text-[#00ff41]/0 group-hover:text-[#00ff41]/40 transition-colors"
                          />
                        </div>
                        <p className="text-[11px] text-[#00cc33] truncate leading-relaxed">{bug.description}</p>
                      </div>

                      <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#00882a] self-center">
                        <CatIcon size={11} />
                        <span>{bug.category}</span>
                      </div>

                      <div className="hidden md:flex self-center">
                        <SeverityBadge severity={bug.severity} />
                      </div>

                      <div className="hidden md:flex self-center">
                        <StatusBadge status={bug.status} />
                      </div>

                      <div className="hidden md:flex self-center text-[10px] text-[#00882a] font-mono">
                        {formattedDate}
                      </div>

                      <div className="flex md:hidden items-center gap-2 flex-wrap">
                        <SeverityBadge severity={bug.severity} />
                        <StatusBadge status={bug.status} />
                        <span className="text-[9px] text-[#00882a]">{formattedDate}</span>
                      </div>
                    </button>
                    <div className="px-4 shrink-0 flex items-center md:w-10 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBug(bug.id);
                        }}
                        title="Delete record"
                        className="text-[#00882a]/50 hover:text-red-400 p-1 bg-transparent hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main >
      </div >
      <footer className="border-t border-[#00ff41]/14 px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2 text-[9px] text-[#00882a] font-mono tracking-widest">
          <span>BUG_BLOG &nbsp;·&nbsp; PERSISTENT ERROR KNOWLEDGE BASE</span>
          <div className="flex items-center gap-4">
            <span className="text-[#00ff41]/15">|</span>
            <span className="text-[#00ff41]/15">|</span>
            <span>SYS: ONLINE &nbsp;·&nbsp; UPTIME: 99.97%</span>
          </div>
        </div>
      </footer>
    </>
  );
}
