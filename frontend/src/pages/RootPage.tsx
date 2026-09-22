import { useAuthStore } from "../store/auth.store";
import { LandingPage } from "./landing-and-home/LandingPage.tsx";
import {HomePage} from "./landing-and-home/HomePage.tsx";

export const RootPage = () => {
    const { isAuthenticated } = useAuthStore();

    return isAuthenticated
        ? <HomePage />
        : <LandingPage />;
};