import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./HeroBanner.module.css"
import heroImage from "../../assets/candidate_home.png"
import { useNavigate } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

export const HeroBanner: React.FC = () => {

    const navigate = useNavigate()
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        const el = wrapperRef.current
        if (!el) return

        gsap.set(el, {
            clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
            borderRadius: "10% 0 40% 10%",
        })
        gsap.from(el, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            borderRadius: '0 0 0 0',
            scrollTrigger: {
                trigger: el,
                start: "top top",
                end: "bottom center",
                scrub: true,
            },
            ease: "power1.inOut",
            duration: 1.5,
        })
    }, [])

    const handleStartClick = () => {
        navigate(`/interview-home`);
    }

    return (
        <div className={styles.heroBanner}>
            <div ref={wrapperRef} className={styles.heroBg}></div>

            <div className={styles.heroContent}>
                <div className={styles.heroText}>
                    <h1>Добро пожаловать</h1>
                    <p>
                        Пройди тренировочное собеседование и получи оценку знаний
                        с помощью искусственного интеллекта.
                    </p>
                    <button
                        className={styles.ctaButton}
                        onClick={handleStartClick}
                    >ПЕРЕЙТИ</button>
                </div>



                <div className={styles.heroImage}>
                    <img src={heroImage} alt="Illustration" />
                </div>
            </div>
        </div>
    )
}