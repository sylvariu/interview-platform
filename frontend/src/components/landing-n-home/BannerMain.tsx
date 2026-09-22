import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../../store/auth.store.ts";

export const BannerMain = () => {
    const cells = [
        {
            title: 'Тренировочные собеседования',
            description: 'Проверь свою готовность к собеседованию с помощью тренажера с реальными вопросами.',
            path: '/interview-home'
        },
        {
            title: 'База вопросов',
            description: 'Теоретические вопросы с собеседований собраны в одном месте.',
            path: '/questions'
        },
        {
            title: 'Алгоритмические задачи',
            description: 'Решай задачи разной сложности и прокачивай навыки программирования.',
            path: '/problems'

        },
        {
            title: 'Отслеживание прогресса',
            description: 'Следи за своим ростом, визуализируй успехи и закрывай пробелы в знаниях.',
            path: '/profile',
            tab: 'progress'
        },
    ];

    const navigate = useNavigate();
    const isAuthenticated = useAuthStore();

    const handleCellClick = (path: string, tab?: string) => {
        if (isAuthenticated) {
            navigate(path, { state: { activeTab: tab } });
        } else {
            alert('Пожалуйста, авторизуйтесь, чтобы продолжить')
            // или navigate('/login');  --- navigate('/login', { state: { from: path, desiredTab: tab } });
        }
    };

    return (
        <div className="w-full bg-[var(--isabelline)]">
            <div className="flex flex-col justify-center max-w-[80%] mx-auto p-4 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 mb-6">
                    <div
                        onClick={() => {handleCellClick(cells[0].path)}}
                        className={`bg-[var(--bg-color)] rounded-2xl shadow-[inset_0_0_8px_0_var(--isa-darker)] p-6 transition-all ]
                            ${isAuthenticated ? 'hover:shadow-[inset_0_0_15px_var(--pink-lavender)] cursor-pointer' : 'cursor-default'}`}>
                        <h3 className="text-2xl font-bold text-[var(--van-dyke)] mb-2">
                            {cells[0].title}
                        </h3>
                        <p className="text-[var(--accent-color)] leading-relaxed">
                            {cells[0].description}
                        </p>
                    </div>
                    <div
                        onClick={() => {handleCellClick(cells[1].path)}}
                        className={`bg-[var(--bg-color)] rounded-2xl shadow-[inset_0_0_8px_0_var(--isa-darker)] p-6 transition-all ]
                            ${isAuthenticated ? 'hover:shadow-[inset_0_0_15px_var(--pink-lavender)] cursor-pointer' : 'cursor-default'}`}>
                        <h3 className="text-2xl font-bold text-[var(--van-dyke)] mb-2">
                            {cells[1].title}
                        </h3>
                        <p className="text-[var(--accent-color)] leading-relaxed">
                            {cells[1].description}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6">
                    <div
                        onClick={() => {handleCellClick(cells[2].path)}}
                        className={`bg-[var(--bg-color)] rounded-2xl shadow-[inset_0_0_8px_0_var(--isa-darker)] p-6 transition-all ]
                            ${isAuthenticated ? 'hover:shadow-[inset_0_0_15px_var(--pink-lavender)] cursor-pointer' : 'cursor-default'}`}>
                        <h3 className="text-2xl font-bold text-[var(--van-dyke)] mb-2">
                            {cells[2].title}
                        </h3>
                        <p className="text-[var(--accent-color)] leading-relaxed">
                            {cells[2].description}
                        </p>
                    </div>
                    <div
                        onClick={() => {handleCellClick(cells[3].path, cells[3].tab)}}
                        className={`bg-[var(--bg-color)] rounded-2xl shadow-[inset_0_0_8px_0_var(--isa-darker)] p-6 transition-all ]
                            ${isAuthenticated ? 'hover:shadow-[inset_0_0_15px_var(--pink-lavender)] cursor-pointer' : 'cursor-default'}`}>
                        <h3 className="text-2xl font-bold text-[var(--van-dyke)] mb-2">
                            {cells[3].title}
                        </h3>
                        <p className="text-[var(--accent-color)] leading-relaxed">
                            {cells[3].description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
