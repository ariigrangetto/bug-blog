import BugBlogLogo from "./BugBlogLogo";
import MatrixRain from "./MatrixRain";

export default function AuthShell({ onHome, subtitle, children }: { onHome: () => void, subtitle: string, children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-[#050a05] text-[#00ff41] font-['JetBrains_Mono',monospace] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
            <MatrixRain opacity={0.13} />
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, transparent 15%, #050a05 78%)" }}
            />
            <div className="relative z-20 flex flex-col items-center w-full" style={{ animation: "slideUp 0.45s ease both" }}>
                <button onClick={onHome} className="flex flex-col items-center mb-8 group">
                    <BugBlogLogo size={80} />
                    <div
                        className="font-['VT323'] text-[40px] text-[#00ff41] glow tracking-[0.25em] mt-3 leading-none group-hover:opacity-90 transition-opacity"
                        style={{ animation: "flicker 10s ease-in-out infinite" }}
                    >
                        BUG_BLOG
                    </div>
                    <div className="text-[9px] text-[#00882a] tracking-[0.28em] mt-1.5">{subtitle}</div>
                </button>

                {children}

                <div className="mt-5 text-[8px] text-[#00882a]/35 font-mono text-center space-y-0.5">
                    <div>CONNECTION: SECURE &nbsp;·&nbsp; TLS 1.3 &nbsp;·&nbsp; AES-256-GCM</div>
                    <div>BUG_BLOG v2.4.1 &nbsp;·&nbsp; KNOWLEDGE BASE SYSTEM</div>
                </div>
            </div>
        </div>
    )

}