import { useEffect, useRef } from "react";

export default function MatrixRain({ opacity }: { opacity: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const FS = 14;
        const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*<>/\\|~!?;:";

        let drops: number[] = [];

        const initDrops = () => {
            const cols = Math.floor(canvas.width / FS);
            drops = Array.from({ length: cols }, () => Math.random() * -120);
        };

        const onResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.font = `${FS}px monospace`;
            initDrops();
        };
        onResize();
        window.addEventListener("resize", onResize);

        let animationFrameId: number;
        let lastTime = 0;
        const fpsInterval = 1000 / 25; // ~25 FPS target

        const loop = (currentTime: number) => {
            animationFrameId = requestAnimationFrame(loop);

            const elapsed = currentTime - lastTime;
            if (elapsed < fpsInterval) return;

            lastTime = currentTime - (elapsed % fpsInterval);

            const cols = Math.floor(canvas.width / FS);
            if (drops.length !== cols) initDrops();

            ctx.fillStyle = "rgba(5, 10, 5, 0.042)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < drops.length; i++) {
                const y = drops[i] * FS;
                if (y < 0) {
                    drops[i] += 0.55;
                    continue;
                }

                const char = CHARS[Math.floor(Math.random() * CHARS.length)];

                if (y < canvas.height) {
                    ctx.fillStyle = "rgba(210, 255, 255, 0.95)";
                    ctx.fillText(char, i * FS, y);
                }

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = Math.random() * -80;
                }

                drops[i] += 0.58;
            }
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ opacity }}></canvas>
        </>
    )

}