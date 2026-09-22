import {useState} from "react";
import {useAuthStore} from "../store/auth.store.ts";

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, isLoading } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            window.location.href = '/';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка входа');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
            >
                <h2 className="mb-6 text-center text-2xl font-bold text-[var(--van-dyke)]">
                    Вход в аккаунт
                </h2>

                {error && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mb-4 flex flex-col">
                    <label className="mb-1 text-sm font-medium text-[var(--van-dyke)]">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[var(--pink-lavender)] focus:ring-1 focus:ring-[var(--pink-lavender)]"
                    />
                </div>

                <div className="mb-6 flex flex-col">
                    <label className="mb-1 text-sm font-medium text-[var(--van-dyke)]">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[var(--pink-lavender)] focus:ring-1 focus:ring-[var(--pink-lavender)]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-2xl bg-[var(--accent-color)] py-2 font-medium text-[var(--isabelline)]
                    transition disabled:opacity-50 cursor-pointer"
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>
    );
};