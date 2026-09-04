import React from 'react';


import MainSlider from "@/features/mainPage/mainSlider/ui/MainSlider.jsx";
import RecommendationSlider from "@/features/mainPage/recommendationSlider/ui/RecommendationSlider.jsx";
import CategoriesMainPage from "@/features/mainPage/categoryMainPage/ui/CategoriesMainPage.jsx";


const MainPage = () => {

    return (
        <>
            <MainSlider></MainSlider>
            <RecommendationSlider></RecommendationSlider>
            <CategoriesMainPage></CategoriesMainPage>
        </>
    );
};

export default MainPage;