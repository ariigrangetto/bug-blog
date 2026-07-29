import { Outlet } from "react-router-dom";
import { Suspense } from "react";

export default function RootLayout() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050a05] text-[#00ff41] font-mono flex items-center justify-center">
                <div className="text-xs tracking-widest animate-pulse text-[#00ff41]">&gt; LOADING_MODULE...</div>
            </div>
        }>
            <Outlet />
        </Suspense>
    )
}
