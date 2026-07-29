/* eslint-disable react/jsx-no-comment-textnodes */
import { Link } from "react-router-dom";
import { Terminal, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import BugBlogLogo from "../features/BugBlogLogo";
import MatrixRain from "../features/MatrixRain";
import Cursor from "../features/Cursor";

export default function Landing() {
    const fullText = "The ultimate terminal-inspired knowledge base for tracking your errors, documenting solutions, and building your personal developer index.";
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 95);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="min-h-screen bg-[#050a05] text-[#00ff41] font-mono relative overflow-hidden flex flex-col selection:bg-[#00ff41]/30">
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen">
                <MatrixRain opacity={0.4} />
            </div>

            <header className="relative z-10 px-6 py-6 border-b border-[#00ff41]/20 bg-[#050a05]/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BugBlogLogo size={32} glow={true} />
                        <span className="font-['VT323'] text-3xl tracking-[0.2em] leading-none glow" style={{ animation: "flicker 12s ease-in-out infinite" }}>
                            BUG_BLOG
                        </span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm uppercase tracking-wider hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 border border-[#00ff41]/50 text-sm uppercase tracking-wider hover:bg-[#00ff41]/10 hover:border-[#00ff41] transition-all flex items-center gap-2"
                        >
                            Init <ArrowRight size={14} />
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="relative z-10 grow flex flex-col items-center justify-center px-6 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-block border border-[#00ff41]/30 bg-[#00ff41]/5 px-3 py-1 rounded-full text-xs tracking-widest mb-4">
                        SYSTEM_STATUS: ONLINE
                    </div>

                    <h1 className="font-['VT323'] text-6xl md:text-8xl font-normal tracking-widest uppercase">
                        Log Bugs. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00ff41] to-[#00882a]">
                            Store Knowledge.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-[#00ff41]/70 max-w-2xl mx-auto leading-relaxed h-[84px] md:h-[60px]">
                        {typedText}
                        <Cursor className="ml-1 inline-block opacity-70" />
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 bg-[#00ff41] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 group"
                        >
                            <Terminal size={18} />
                            Start Tracking
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 border border-[#00ff41]/50 uppercase tracking-widest hover:bg-[#00ff41]/10 transition-colors"
                        >
                            Access DB
                        </Link>
                    </div>
                </div>

                {/* <div className="max-w-6xl mx-auto w-full mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="border border-[#00ff41]/20 bg-[#0a150a]/80 backdrop-blur-md p-8 hover:border-[#00ff41]/60 transition-colors group">
                        <Bug className="text-[#00882a] group-hover:text-[#00ff41] mb-6 transition-colors" size={32} />
                        <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">Error Logging</h3>
                        <p className="text-[#00ff41]/60 text-sm leading-relaxed">
                            Capture stack traces, environment details, and exact reproduction steps. Never lose a fix again.
                        </p>
                    </div>

                    <div className="border border-[#00ff41]/20 bg-[#0a150a]/80 backdrop-blur-md p-8 hover:border-[#00ff41]/60 transition-colors group">
                        <Database className="text-[#00882a] group-hover:text-[#00ff41] mb-6 transition-colors" size={32} />
                        <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">Knowledge Base</h3>
                        <p className="text-[#00ff41]/60 text-sm leading-relaxed">
                            Build a searchable index of solutions. Turn hours of debugging into a 5-second query.
                        </p>
                    </div>

                    <div className="border border-[#00ff41]/20 bg-[#0a150a]/80 backdrop-blur-md p-8 hover:border-[#00ff41]/60 transition-colors group">
                        <Terminal className="text-[#00882a] group-hover:text-[#00ff41] mb-6 transition-colors" size={32} />
                        <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">Hacker Aesthetic</h3>
                        <p className="text-[#00ff41]/60 text-sm leading-relaxed">
                            A UI that feels like home. Built by developers, for developers, with a retro terminal vibe.
                        </p>
                    </div>
                </div> */}
            </main>

            <footer className="relative z-10 border-t border-[#00ff41]/20 bg-[#050a05] py-6 text-center text-xs text-[#00ff41]/40 uppercase tracking-widest">
                <p>BUG_BLOG // {new Date().getFullYear()} // v1.0.0_INIT</p>
            </footer>
        </div>
    );
}