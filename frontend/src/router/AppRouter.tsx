import {Route, Routes} from "react-router-dom";
import {LoginPage} from "../pages/LoginPage.tsx";
import {RegisterPage} from "../pages/RegisterPage.tsx";
import {PrivateRoute} from "./PrivateRoute.tsx";
import {Profile} from "../pages/profile/Profile.tsx";
import {ProblemsPage} from "../pages/problems/ProblemsPage.tsx";
import {HomePage} from "../pages/landing-and-home/HomePage.tsx";
import {InterviewSessionPage} from "../pages/interview/InterviewSessionPage.tsx";
import {InterviewHomePage} from "../pages/interview/InterviewHomePage.tsx";
import {QuestionsPage} from "../pages/questions/QuestionsPage.tsx";
import {SectionPage} from "../pages/questions/SectionPage.tsx";
import {QuestionItemPage} from "../pages/questions/QuestionPage.tsx";
import {RootPage} from "../pages/RootPage.tsx";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<RootPage />} />

            /*<Route path='/' element={<HomePage />} />*/
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/interview-home"
                element={
                    <PrivateRoute>
                        <InterviewHomePage />
                    </PrivateRoute>
                }>
            </Route>
            <Route
                path="/interview/:id"
                element={
                <PrivateRoute>
                    <InterviewSessionPage />
                </PrivateRoute>
                }>
            </Route>
            <Route
                path="/problems"
                element={
                    <PrivateRoute>
                        <ProblemsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/questions"
                element={
                    <PrivateRoute>
                        <QuestionsPage />
                    </PrivateRoute>
                }/>
            <Route
                path="/questions/section/:sectionId"
                element={
                    <PrivateRoute>
                        <SectionPage />
                    </PrivateRoute>
                } />
            <Route
                path="/questions/section/:sectionId/question/:questionId"
                element={
                    <PrivateRoute>
                        <QuestionItemPage />
                    </PrivateRoute>
                } />

        </Routes>

    )
}