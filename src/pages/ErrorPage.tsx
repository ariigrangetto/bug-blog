import { Link } from "react-router-dom";
import MatrixRain from "../features/MatrixRain.tsx";

export default function ErrorPage() {
    return (
        <div className="min-h-screen bg-[#050a05] text-[#00ff41] font-['JetBrains_Mono',monospace] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <MatrixRain opacity={0.32} />

            <div className="relative z-20 text-center w-full max-w-2xl bg-[#0a150a]/80 border border-[#00ff41]/30 p-8 md:p-12 shadow-[0_0_20px_rgba(0,255,65,0.15)]"
                style={{ animation: "slideUp 0.55s ease both" }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff41]/60"></div>

                <div className="mb-6 flex justify-center">
                    <div className="text-[#00ff41] border border-[#00ff41] p-3 shadow-[0_0_10px_rgba(0,255,65,0.3)] animate-pulse">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                </div>

                <div className="text-[10px] font-mono text-[#00882a] tracking-[0.35em] mb-2 uppercase">&gt; System_Exception_Caught</div>
                <h1 className="font-['VT323'] text-[60px] md:text-[80px] text-[#00ff41] glow tracking-widest leading-none mb-6" style={{ animation: "flicker 5s ease-in-out infinite" }}>
                    CRITICAL ERROR
                </h1>

                <div className="border-y border-[#00ff41]/20 py-4 mb-8 text-[#00882a] text-sm md:text-base font-mono tracking-wide">
                    <p className="mb-1 uppercase">&gt; We&apos;re having some issues</p>
                    <p className="opacity-80 uppercase">&gt; The matrix has encountered a glitch</p>
                </div>

                <div className="flex items-center justify-center">
                    <Link to="/" className="btn-primary inline-flex items-center justify-center px-8 py-3 bg-[#00ff41] text-black text-sm font-mono font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#00cc33] hover:shadow-[0_0_15px_rgba(0,255,65,0.5)]">
                        &lt; RETURN TO HOME
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 h-20 bg-linear-to-t from-[#050a05] to-transparent z-10" />
        </div>
    );
}