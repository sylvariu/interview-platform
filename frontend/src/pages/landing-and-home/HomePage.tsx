import React from "react";
import {BannerMain} from "../../components/landing-n-home/BannerMain.tsx";
import {HeroBanner} from "../../components/landing-n-home/HeroBanner.tsx";

export const HomePage: React.FC = () => {
    return (
        <div>
            <HeroBanner />
            <BannerMain />
        </div>
    );
};