import React, {useEffect, useRef, useState} from 'react';
import plus from "@shared/imges/svg/plusSvg.svg";
import minus from "@shared/imges/svg/minusSvg.svg";

import './quantityControl.scss'

const QuantityControl = ({initialCount = 0, unit, onChange, min = 1, max = 999, disabled}) => {
    const [count, setCount] = useState(initialCount || min)
    const [inputWidth, setInputWidth] = useState('1ch')
    const [inputValue, setInputValue] = useState(initialCount || min)
    const inputRef = useRef(null)
    const timeoutRef = useRef(null)

    useEffect(() => {
        setCount(initialCount || min)
        setInputValue(initialCount || min)
    },[initialCount])

    const handleInputChange = (e) => {
        e.stopPropagation()
        const rawValue = e.target.value
        setInputValue(rawValue)
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            let value = rawValue.replace(/[^0-9.,]/g, '').replace(',','.')
            if (value === '' || isNaN(parseFloat(value))) {
                setCount(min)
                setInputValue(min)
                if (onChange) onChange(min)
                return
            }

            let numValue = parseFloat(value)
            if (numValue > max) numValue = max;
            if (numValue < min) numValue = min;

            const scaledMin = min * 1000;
            const scaledValue = numValue * 1000;

            const remainder = scaledValue % scaledMin;

            if (remainder === 0) {

            } else {
                const lower = scaledValue - remainder;
                const upper = lower + scaledMin;

                if (scaledValue - lower > upper - scaledValue) {
                    numValue = upper / 1000;
                } else {
                    numValue = lower / 1000;
                }

                if (numValue > max) {
                    numValue = lower / 1000
                }
            }

            numValue = Math.round(numValue * 100) / 100;
            setCount(numValue)
            const formattedValue = numValue % 1 === 0 ? numValue.toString() : numValue.toFixed(1);
            setInputValue(formattedValue);
            if (onChange) onChange(numValue)
        }, 1500)
        // let value = e.target.value.replace(/\D/g, '');
        // if (value === '') {
        //     setInputValue('');
        //     return;
        // }
        // let numValue = parseInt(value, 10);
        // if (numValue > max) numValue = max;
        // if (numValue < min) numValue = min;
        //
        // const remainder = numValue % min;
        //
        // if (remainder !== 0) {
        //     const lower = numValue - remainder;
        //     const upper = lower + min;
        //
        //     if (numValue - lower > upper - numValue) {
        //       numValue = upper;
        //     } else {
        //         numValue = lower;
        //     }
        //
        //     if (numValue > max) {
        //         numValue = lower
        //     }
        // }

        // numValue = Math.max(min, Math.min(max, numValue))
        // setInputValue(numValue);
        //
        // clearTimeout(timeoutRef.current);
        //
        // timeoutRef.current = setTimeout(() => {
        //     setCount(numValue)
        //     if (onChange) onChange(numValue);
        // }, 750);
    };


    const handleIncrement = (e) => {
        e.stopPropagation();
        if (count < max) {
            const newCount = Math.round((count + min) * 100) / 100;
            setCount(newCount);
            setInputValue(newCount);
            if (onChange) onChange(newCount);
        }
    };

    const handleDecrement = (e) => {
        e.stopPropagation();

        if (count <= min) {
            if (onChange) onChange(0)
            return;
        }

        const newCount = Math.round((count - min) * 100) / 100;
        setCount(newCount);
        setInputValue(newCount);
        if (onChange) onChange(newCount);

    };

    const updateCount = (newCount) => {
        setCount(newCount);
        if (onChange) onChange(newCount);
    };

    // useEffect(() => {
    //     const width = String(inputValue).length;
    //     const adjustedWidth = width - (String(inputValue).includes('.') ? 0.75 : 0)
    //     setInputWidth(`${Math.max(1, Math.min(8, adjustedWidth))}ch`);
    // }, [inputValue]);

    return (
        <div className={'product-counter-count'}>
            <button
                className={'counter-count__minus'}
                onClick={handleDecrement}
                disabled={disabled}
            >
                <img src={minus} alt={"Плюс"} className={'counter-count__img'}/>
            </button>
            <div className={'counter-count-input-container'}>
                <div className={'input-wrapper'}>
                    <span className={'input-mirror'}>
                        {inputValue || '0'}
                    </span>
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        style={{}}
                        type="text"
                        inputMode={'decimal'}
                        maxLength={8}
                        className={'counter-count__input'}
                        disabled={disabled}
                        step={initialCount}
                    />
                </div>
                <span className={'unit'}>
                    {unit}
                </span>
            </div>
            <button
                className={'counter-count__plus'}
                onClick={handleIncrement}
                disabled={count >= 999 || disabled}
            >
                <img src={plus} alt={"Плюс"} className={'counter-count__img'}/>
            </button>
        </div>
    );
};

export default QuantityControl;