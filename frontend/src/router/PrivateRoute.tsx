import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.ts';
import {useEffect, useRef} from "react";

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading, checkAuth, accessToken, user } = useAuthStore();
    const hasCheckedRef = useRef(false);

    useEffect(() => {
        // Проверяем только один раз при монтировании, и только если нет данных
        if (!hasCheckedRef.current && !accessToken && !user) {
            hasCheckedRef.current = true;
            checkAuth();
        } else if (accessToken && user && !isAuthenticated) {
            // Если есть токен и пользователь, но isAuthenticated false - исправляем
            useAuthStore.setState({ isAuthenticated: true });
        }
    }, [accessToken, user, isAuthenticated]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};