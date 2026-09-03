import React, {useEffect, useState} from 'react';

import TopLink from "@/3widgets/topLink/TopLink.jsx";
import Header from "@/3widgets/header/ui/Header.jsx";
import MainSlider from "@/4features/mainPage/mainSlider/ui/MainSlider.jsx";
import RecommendationSlider from "@/4features/mainPage/recommendationSlider/ui/RecommendationSlider.jsx";
import CategoriesMainPage from "@/4features/mainPage/categoryMainPage/ui/CategoriesMainPage.jsx";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const MainPage = () => {
    const isMobile = useIsMobile()

    return (
        <>
            {/*{!isMobile &&  <TopLink />}*/}
            {/*<Header />*/}
            <MainSlider></MainSlider>
            <RecommendationSlider></RecommendationSlider>
            <CategoriesMainPage></CategoriesMainPage>
        </>
    );
};

export default MainPage;