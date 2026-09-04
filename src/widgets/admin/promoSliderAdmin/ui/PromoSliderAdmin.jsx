import React, { useState, useEffect } from 'react';
import "./promoSliderAdminStyles.scss"
import PromoMobileSlider from "@/widgets/admin/promoSliderAdmin/ui/promoMobileSlider/PromoMobileSlider";
import PromoDefualtSlider from "@/widgets/admin/promoSliderAdmin/ui/promoDefualtSlider/PromoDefualtSlider";
import Toggle from "@shared/ui/toggle/Toggle";
import MainSliderAdmin from "@/features/admin/slidersAdmin/ui/MainSliderAdmin";
import { useFetchSliderImgAdmin } from '../lib/useFetchSliderImgAdmin';

const PromoSliderAdmin = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [mainSliderIndex, setMainSliderIndex] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const {
        pcSliders,
        mobileSliders,
        loading,
        updateSlidersOrder,
        addNewSlider,
        updateSlider,
        deleteSlider,
    } = useFetchSliderImgAdmin();

    function toggleSwitch(isMobileActive) {
        setIsMobile(isMobileActive);
        setMainSliderIndex(0);
    }

    const currentSliders = isMobile ? mobileSliders : pcSliders;

    const handleUpdateOrder = async (sliders, type) => {
        await updateSlidersOrder(sliders, type);
    };

    const handleAddSlider = async (sliderData, type) => {
        await addNewSlider(sliderData, type);
        setMainSliderIndex(0);
    };

    const handleUpdateSlider = async (sliderId, sliderData, type) => {
        await updateSlider(sliderId, sliderData, type);
    };

    const handleDeleteSlider = async (sliderId, type) => {
        await deleteSlider(sliderId, type);
        if (mainSliderIndex >= currentSliders.length - 1) {
            setMainSliderIndex(Math.max(0, currentSliders.length - 2));
        }
    };

    useEffect(() => {
        setMainSliderIndex(0);
    }, [isMobile, refreshTrigger]);

    return (
        <div className={"promo-slider-admin"}>

            <div className={"promo-slider-admin-header"}>
                <Toggle
                    onChange={toggleSwitch}
                    isActive={isMobile}
                />
            </div>

            <div className="main-slider-container">
                {currentSliders.length > 0 ? (
                    <MainSliderAdmin
                        key={`${isMobile ? 'mobile' : 'pc'}-${refreshTrigger}`}
                        slider={currentSliders}
                        isMobile={isMobile}
                        currentIndex={mainSliderIndex}
                        onIndexChange={setMainSliderIndex}
                    />
                ) : (
                    <div className={`main-slider-placeholder ${loading ? 'loading' : 'loaded'}`}>
                        <p>Нет {isMobile ? 'мобильных' : ''} слайдов для отображения</p>
                    </div>
                )}
            </div>

            {isMobile ?
                <PromoMobileSlider
                    sliders={mobileSliders}
                    loading={loading}
                    mainSliderIndex={mainSliderIndex}
                    onMainSliderIndexChange={setMainSliderIndex}
                    onUpdateOrder={(sliders) => handleUpdateOrder(sliders, 'mobile')}
                    onAddSlider={(sliderData) => handleAddSlider(sliderData, 'mobile')}
                    onUpdateSlider={(sliderId, sliderData) => handleUpdateSlider(sliderId, sliderData, 'mobile')}
                    onDeleteSlider={(sliderId) => handleDeleteSlider(sliderId, 'mobile')}
                />
                :
                <PromoDefualtSlider
                    sliders={pcSliders}
                    loading={loading}
                    mainSliderIndex={mainSliderIndex}
                    onMainSliderIndexChange={setMainSliderIndex}
                    onUpdateOrder={(sliders) => handleUpdateOrder(sliders, 'pc')}
                    onAddSlider={(sliderData) => handleAddSlider(sliderData, 'pc')}
                    onUpdateSlider={(sliderId, sliderData) => handleUpdateSlider(sliderId, sliderData, 'pc')}
                    onDeleteSlider={(sliderId) => handleDeleteSlider(sliderId, 'pc')}
                />
            }

        </div>
    );
};

export default PromoSliderAdmin;