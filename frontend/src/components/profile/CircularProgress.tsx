interface Props {
    solved: number;
    total: number;
}

interface Props {
    solved: number;
    total: number;
}

export const CircularProgress = ({ solved, total }: Props) => {
    const size = 200;
    const stroke = 12;
    const radius = (size - stroke) / 2;

    const circumference = 2 * Math.PI * radius;
    const percent = solved / total;

    const offset = circumference - percent * circumference;

    return (
        <div className="relative w-[200px] h-[200px]">

            <svg width={size} height={size}>

                {/* gradient definition */}
                <defs>
                    <linearGradient id="progressGradient">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>

                {/* background */}
                <circle
                    stroke="#eee"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />

                {/* progress */}
                <circle
                    stroke="url(#progressGradient)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{
                        transition: "stroke-dashoffset 0.8s ease",
                    }}
                />

            </svg>

            {/* centered text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">

                <div className="text-3xl font-bold">
                    {solved}
                    <span className="text-gray-400 text-lg">
            /{total}
          </span>
                </div>

                <div className="text-sm text-green-600">
                    ✓ Решено
                </div>

            </div>
        </div>
    );
};