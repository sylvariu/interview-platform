type Props = {
    learnedPercent: number;
    reviewPercent: number;
    hardPercent: number;
};

export const QuestionsProgress = ({
                                      learnedPercent,
                                      reviewPercent,
                                      hardPercent,
                                  }: Props) => {
    return (
        <div className="w-full h-2 bg-[#e5e7eb] rounded-full overflow-hidden flex">
            <div
                className="bg-green-500 transition-all duration-300"
                style={{
                    width: `${learnedPercent}%`,
                }}
            />

            <div
                className="bg-yellow-400 transition-all duration-300"
                style={{
                    width: `${reviewPercent}%`,
                }}
            />

            <div
                className="bg-red-400 transition-all duration-300"
                style={{
                    width: `${hardPercent}%`,
                }}
            />
        </div>
    );
};