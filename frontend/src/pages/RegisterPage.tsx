import React, { useState } from 'react';
import {useAuthStore} from "../store/auth.store.ts";

export const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const { register, isLoading } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await register(formData);
            window.location.href = '/';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка регистрации');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
            >
                <h2 className="mb-6 text-center text-2xl font-bold text-[var(--van-dyke)]">
                    Регистрация
                </h2>

                {error && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mb-4 flex flex-col">
                    <label className="mb-1 text-sm font-medium text-[var(--van-dyke)]">Имя</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[var(--pink-lavender)] focus:ring-1 focus:ring-[var(--pink-lavender)]"
                    />
                </div>

                <div className="mb-4 flex flex-col">
                    <label className="mb-1 text-sm font-medium text-[var(--van-dyke)]">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[var(--pink-lavender)] focus:ring-1 focus:ring-[var(--pink-lavender)]"
                    />
                </div>

                <div className="mb-6 flex flex-col">
                    <label className="mb-1 text-sm font-medium text-[var(--van-dyke)]">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>
        </div>
    );
};