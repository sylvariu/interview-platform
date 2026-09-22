interface Props {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    actionText: string;
}

export const ConfirmModal: React.FC<Props> = ({
                                                  title,
                                                  description,
                                                  onConfirm,
                                                  onCancel,
                                                  actionText
                                              }) => {
    return (
        <div className="fixed inset-0 z-50 bg-[var(--van-dyke)]/50 flex justify-center items-center"
             onClick={onCancel}>
            <div className="bg-[var(--bg-color)] p-5 rounded-xl w-[350px] space-y-2"
                 onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-[var(--van-dyke)]">{title}</h2>

                <p className="text-sm text-gray-600">{description}</p>

                <div className="flex justify-end gap-3 pt-3">
                    <button
                        className="border border-[#e5e7eb] px-3 py-1 rounded-lg cursor-pointer"
                        onClick={onCancel}>Отмена</button>

                    <button
                        onClick={onConfirm}
                        className="bg-[var(--accent-color)] text-white px-3 py-1 rounded-lg cursor-pointer"
                    >
                        {actionText}
                    </button>
                </div>
            </div>
        </div>
    );
};