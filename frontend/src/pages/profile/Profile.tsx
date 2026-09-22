import React, {useEffect, useState} from 'react';
import {useAuthStore} from "../../store/auth.store.ts";
import {favoritesApi} from "../../shared/api/favorites.api.ts";
import {ProfileProgress} from "./ProfileProgress.tsx";
import {CreateCollection} from "../../components/profile/CreateCollection.tsx";
import {CollectionsList} from "../../components/profile/CollectionsList.tsx";
import {CollectionView} from "../../components/profile/CollectionView.tsx";
import {ProblemCard} from "../../components/problems/ProblemCard.tsx";

import styles from './Profile.module.css';
import {useLocation} from "react-router-dom";

type TabType = "info" | "favorites" | "collections" | "progress";

export const Profile: React.FC = () => {
    const { user, logout, isLoading } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabType>("info");
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

    if (isLoading) {
        return <div className="p-4">Загрузка...</div>;
    }

    if (!user) {
        return <div className="p-4">Не авторизован</div>;
    }

    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const { data } = await favoritesApi.getAll();
            setFavorites(data);
        };

        load();
    }, []);

    const location = useLocation();
    useEffect(() => {
        const state = location.state as { activeTab?: TabType } | null;
        if (state?.activeTab && ['info', 'favorites', 'collections', 'progress'].includes(state.activeTab)) {
            setActiveTab(state.activeTab);
            // очищаем state, чтобы при обновлении страницы не оставалось
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <div className={styles.profile_container}>
            <h2 className={styles.profile_title}>Профиль пользователя</h2>

            <div className={styles.profile_card}>
                <div className={styles.profile_menu}>
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`${styles.tab} ${activeTab === "info" ? styles.active : ""}`}>
                        <svg strokeWidth="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path fill="currentColor"
                                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                        </svg>
                        Личная информация
                    </button>
                    <button
                        onClick={() => setActiveTab("favorites")}
                        className={`${styles.tab} ${activeTab === "favorites" ? styles.active : ""}`}>
                        <svg viewBox="0 0 640 640" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="currentColor"
                                d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/>
                        </svg>
                        Избранное
                    </button>
                    <button
                        onClick={() => setActiveTab("collections")}
                        className={`${styles.tab} ${activeTab === "collections" ? styles.active : ""}`}>
                        <svg viewBox="0 0 640 640" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="currentColor"
                                d="M296.5 69.2C311.4 62.3 328.6 62.3 343.5 69.2L562.1 170.2C570.6 174.1 576 182.6 576 192C576 201.4 570.6 209.9 562.1 213.8L343.5 314.8C328.6 321.7 311.4 321.7 296.5 314.8L77.9 213.8C69.4 209.8 64 201.3 64 192C64 182.7 69.4 174.1 77.9 170.2L296.5 69.2zM112.1 282.4L276.4 358.3C304.1 371.1 336 371.1 363.7 358.3L528 282.4L562.1 298.2C570.6 302.1 576 310.6 576 320C576 329.4 570.6 337.9 562.1 341.8L343.5 442.8C328.6 449.7 311.4 449.7 296.5 442.8L77.9 341.8C69.4 337.8 64 329.3 64 320C64 310.7 69.4 302.1 77.9 298.2L112 282.4zM77.9 426.2L112 410.4L276.3 486.3C304 499.1 335.9 499.1 363.6 486.3L527.9 410.4L562 426.2C570.5 430.1 575.9 438.6 575.9 448C575.9 457.4 570.5 465.9 562 469.8L343.4 570.8C328.5 577.7 311.3 577.7 296.4 570.8L77.9 469.8C69.4 465.8 64 457.3 64 448C64 438.7 69.4 430.1 77.9 426.2z"/></svg>
                        Коллекции задач
                    </button>
                    <button
                        onClick={() => setActiveTab("progress")}
                        className={`${styles.tab} ${activeTab === "progress" ? styles.active : ""}`}>
                        <svg viewBox="0 0 640 640" height="24" width="24" xmlns="http://www.w3.org/2000/svg" >
                            <path
                                fill="currentColor"
                                d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z"/></svg>
                        Прогресс
                    </button>
                </div>

                <div className={styles.profile_content}>
                    {activeTab==="info" && (
                        <div>
                            <h3 className={styles.section_title}>Аккаунт</h3>
                            <div className="space-y-3 text-gray-700">
                                <p>ID <strong>{user.id}</strong></p>
                                <p>Имя <strong>{user.name}</strong></p>
                                <p>Email <strong>{user.email}</strong></p>
                                <p>Дата регистрации <strong>{new Date(user.createdAt).toLocaleDateString()}</strong></p>
                                <button
                                    onClick={logout}
                                    className={styles.logout_btn}>
                                    Выйти
                                </button>
                            </div>
                        </div>

                    )}

                    {activeTab === "favorites" && (
                        <div>
                            <h3 className={styles.section_title}>Избранное</h3>

                            <div className="space-y-4 ">
                                {favorites.map((fav) => (
                                    <ProblemCard key={fav.problem.id} problem={fav.problem} />
                                ))}
                            </div>
                        </div>


                    )}

                    {activeTab === "collections" && (
                        <div>
                            {!selectedCollectionId ? (
                                <>
                                    <h3 className={styles.section_title}>Коллекции задач</h3>
                                    <p className=" font-semibold text-[var(--accent-color)] mb-4">Cобирайте задачи в отдельные списки</p>
                                    <CreateCollection />
                                    <CollectionsList onOpen={setSelectedCollectionId} />
                                </>
                            ) : (
                                <CollectionView
                                    collectionId={selectedCollectionId}
                                    onBack={() => setSelectedCollectionId(null)}
                                />
                            )}
                        </div>
                    )}

                    { activeTab === "progress" &&
                        <>
                            <h3 className={styles.section_title}>Ваш прогресс</h3>
                            <ProfileProgress />
                        </>
                         }
                </div>
            </div>
        </div>
    );
};