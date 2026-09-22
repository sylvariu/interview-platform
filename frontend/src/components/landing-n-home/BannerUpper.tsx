import styles from './BannerUpper.module.css'
import React from "react";
import {useNavigate} from "react-router-dom";

export interface LandingHeaderProps {
    mainTitle?: string;
    description?: string;
    buttonText?: string;
}

export const BannerUpper: React.FC<LandingHeaderProps> = ({
                                                              mainTitle,
                                                              description,
                                                              buttonText,
                                                          }) => {

    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate(`/login`);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>
                {mainTitle}
            </h1>

            <p className={styles.description}>
                {description}
            </p>

            {buttonText &&
                <button
                    className={styles.ctaButton}
                    onClick={handleStartClick}
                >
                    {buttonText}
                </button>
            }
        </div>
    )
}