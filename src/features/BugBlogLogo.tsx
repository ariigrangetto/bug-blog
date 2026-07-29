export default function BugBlogLogo({ size = 64, glow = true }: { size?: number; glow?: boolean }) {
    return (
        <svg
            viewBox="0 0 64 64"
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            style={glow ? { filter: "drop-shadow(0 0 8px rgba(0,255,65,0.55))" } : undefined}
        >
            {/* Tile background */}
            <rect width="64" height="64" rx="10" fill="#050a05" />

            <g transform="translate(0, 9)">
                {/* Antenna cursor blocks */}
                <rect x="14" y="2" width="5" height="5" fill="#00ff41" />
                <rect x="45" y="2" width="5" height="5" fill="#00ff41" />

                {/* Antenna lines */}
                <line x1="26" y1="12" x2="18" y2="5" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="square" />
                <line x1="38" y1="12" x2="46" y2="5" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="square" />

                {/* Head */}
                <rect x="25" y="12" width="14" height="10" fill="#00ff41" />

                {/* Eyes — punched dark pixels */}
                <rect x="27" y="14" width="3.5" height="3.5" fill="#050a05" />
                <rect x="33.5" y="14" width="3.5" height="3.5" fill="#050a05" />

                {/* Body — IC chip form */}
                <rect x="21" y="22" width="22" height="24" fill="#00ff41" />

                {/* Body scan lines */}
                <line x1="22" y1="27" x2="43" y2="27" stroke="#050a05" strokeWidth="0.8" opacity="0.5" />
                <line x1="22" y1="31" x2="43" y2="31" stroke="#050a05" strokeWidth="0.8" opacity="0.5" />
                <line x1="22" y1="35" x2="43" y2="35" stroke="#050a05" strokeWidth="0.8" opacity="0.5" />
                <line x1="22" y1="39" x2="43" y2="39" stroke="#050a05" strokeWidth="0.8" opacity="0.5" />
                <line x1="22" y1="43" x2="43" y2="43" stroke="#050a05" strokeWidth="0.8" opacity="0.5" />

                {/* Elytra seam */}
                <line x1="32" y1="22" x2="32" y2="46" stroke="#050a05" strokeWidth="2.2" />

                {/* Left IC pins (legs) */}
                <rect x="13" y="24" width="8" height="2.5" fill="#00ff41" />
                <rect x="13" y="30" width="8" height="2.5" fill="#00ff41" />
                <rect x="13" y="36" width="8" height="2.5" fill="#00ff41" />

                {/* Right IC pins (legs) */}
                <rect x="43" y="24" width="8" height="2.5" fill="#00ff41" />
                <rect x="43" y="30" width="8" height="2.5" fill="#00ff41" />
                <rect x="43" y="36" width="8" height="2.5" fill="#00ff41" />
            </g>
        </svg>
    );
}