import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.ts';
import styles from './Navigation.module.css';

export const Navigation: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuthStore();

    return (
        <nav className={styles.nav_container}>
            <div className="flex justify-start items-center gap-8">
                <Link to="/" className="text-lg font-semibold text-[var(--van-dyke)]">Mock Interview</Link>
                <Link to="/interview-home" className="font-semibold text-[var(--van-dyke)]">Интервью</Link>
                <Link to="/problems" className="font-semibold text-[var(--van-dyke)]">Задачи</Link>
                <Link to="/questions" className="font-semibold text-[var(--van-dyke)]">Вопросы</Link>
            </div>


            <div className="flex items-center gap-4">
                {!isAuthenticated ? (
                    <>
                        <Link
                            to="/login"
                            className="text-[var(--van-dyke)] transition hover:text-[var(--isabelline)]">
                            Вход
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-[var(--button-radius)] bg-[var(--reseda-green)] px-4 py-2 text-[var(--isabelline)]">
                            Регистрация
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="text-gray-600">
                            Привет, <span className="font-medium">{user?.name}</span>!
                        </span>
                        <Link
                            to="/profile"
                            className="font-semibold text-[var(--van-dyke)] transition hover:text-[var(--reseda-green)]">
                            Профиль
                        </Link>
                        <button
                            onClick={logout}
                            className="rounded-[var(--button-radius)] bg-[var(--reseda-green)] px-4 py-2 text-[var(--isa-darker)] transition cursor-pointer duration-200">
                            Выйти
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};
