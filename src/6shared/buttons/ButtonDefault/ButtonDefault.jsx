import React from "react";
import "./buttonDefault.scss";

const ButtonDefault = ({
   onClick,
   img1: Img1,
   img2: Img2,
   text,
   classButton,
   classImg1,
   classImg2,
   disabled
                       }) => {
    const handleClick = disabled ? undefined : onClick;

    return (
        <div
            onClick={handleClick}
            className={`button-default ${classButton}`}
        >
            {Img1 && <Img1 className={`button-default__img1 ${classImg1}`} />}
            {Img2 && <Img2 className={`button-default__img2 ${classImg2}`} />}
            {text && <span>{text}</span>}
        </div>
    );
};
export default ButtonDefault;