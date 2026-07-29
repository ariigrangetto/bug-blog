import { ArrowLeft, LogOut, Plus } from "lucide-react";
import BugBlogLogo from "./BugBlogLogo";
import Cursor from "./Cursor";
import Client from "../services/clients";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    showBack?: boolean;
    onHome?: () => void;
    onNewBug?: () => void;
    showLogout?: boolean;
}

export default function Header({ showBack, onHome, onNewBug, showLogout }: HeaderProps) {
    const navigate = useNavigate();

    async function handleLogout() {
        const { error } = await Client.logout();
        if (!error) {
            navigate("/login");
        };
    }

    return (
        <>
            <header className="relative z-30 border-b border-[#00ff41]/18 bg-[#050a05]/92 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <button className="flex items-center gap-2.5 group" aria-label="Go to landing page">
                        <BugBlogLogo size={28} glow={false} />
                        <span className="font-['VT323'] text-[26px] text-[#00ff41] glow tracking-[0.2em] leading-none" style={{ animation: "flicker 12s ease-in-out infinite" }}>BUG_BLOG</span>
                        <Cursor className="opacity-80" />
                    </button>

                    <nav className="flex items-center gap-4">
                        <span className="hidden sm:block text-[10px] text-[#00882a] font-mono tracking-widest">{`// knowledge base`}</span>
                        {showBack && (
                            <button className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-[#00882a] text-xs font-mono hover:text-[#00ff41] transition-colors" onClick={onHome}>
                                <ArrowLeft size={14} />
                                BACK
                            </button>
                        )}
                        {showLogout &&
                            <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-1.5 border border-[#00ff41]/50 text-[#00ff41] text-xs font-mono btn-ghost transition-colors hover:bg-[rgba(0,255,65,0.1)] hover:border-[#00ff41]">
                                <LogOut size={11} />
                                LOGOUT
                            </button>

                        }
                        <button onClick={onNewBug} className="flex items-center gap-1.5 px-4 py-1.5 border border-[#00ff41]/50 text-[#00ff41] text-xs font-mono btn-ghost transition-colors hover:bg-[rgba(0,255,65,0.1)] hover:border-[#00ff41]">
                            <Plus size={11} />
                            LOG_BUG
                        </button>
                    </nav>
                </div>
            </header>
        </>
    )
}
