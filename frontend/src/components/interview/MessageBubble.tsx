interface Props {
    role: 'USER' | 'AI';
    text: string;
}

export const MessageBubble: React.FC<Props> = ({ role, text }) => {
    return (
        <div
            className={`flex ${role === 'USER' ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                    role === 'USER'
                        ? 'bg-[var(--van-dyke)] text-[var(--isabelline)] mr-2'
                        : 'bg-[var(--isabelline)] text-[var(--van-dyke)] border border-[#e5e7eb] ml-2'
                }`}
            >
                {text}
            </div>
        </div>
    );
};