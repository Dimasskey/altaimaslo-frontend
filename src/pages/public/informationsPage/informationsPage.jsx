import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useFetchInformationAdmin} from "@/features/admin/informationAdmin/lib/useFetchInformationAdmin";

import "./informationsPage.scss"
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const InformationsPage = () => {
    const { id } = useParams()
    const isMobile = useIsMobile()
    const {selectedInformation, loading, getInformation} = useFetchInformationAdmin()

    useEffect(() => {
        if (id) {
            getInformation(id)
        }
    },[id]);

    return (
        <>
            <div className={`information-page ${loading ? 'loading' : 'loaded'}`}>
                <div className={'information-content-view'} dangerouslySetInnerHTML={{__html: selectedInformation?.about}} />
            </div>
        </>
    );
};

export default InformationsPage;