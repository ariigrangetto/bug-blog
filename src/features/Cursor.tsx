export default function Cursor({ className = "" }: { className?: string }) {
    return (
        <span className={`inline-block w-[0.5em] h-[1.1em] bg-[#00ff41] align-middle ${className}`}
            style={{ animation: "blink 1.1s step-end infinite" }} />
    )
}