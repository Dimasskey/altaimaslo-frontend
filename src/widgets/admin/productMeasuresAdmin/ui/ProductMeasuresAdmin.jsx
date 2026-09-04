import "./productMeasuresAdminStyles.scss"
import React, {useEffect, useRef, useState, useCallback} from 'react';
import PoductMesureAdminItem from "@/entities/admin/productMesureAdminItem/ui/PoductMesureAdminItem";
import PlusImg from "@shared/imges/svg/plusImg.svg?react";
import ProductMeasuresAddList from "@/widgets/admin/productMeasuresAdmin/productMeasuresAddList/ui/ProductMeasuresAddList";

const ProductMeasuresAdmin = ({measures = [], onMeasuresChange}) => {
    const [openMeasuresList, setOpenMeasuresList] = useState(false);
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const addButtonRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("auto");

    const handelOpenAddMeasuresList = (event) => {
        if (event) {
            setClickPosition({
                x: event.clientX,
                y: event.clientY
            });
        }
        setOpenMeasuresList(!openMeasuresList);
    }

    const handleCloseAddMeasuresList = useCallback(() => {
        setOpenMeasuresList(false);
    }, []);

    const handleAddMeasure = useCallback((filter) => {
        const newMeasure = {
            id: filter.id,
            name: filter.name,
            value: '',
            unit_measure: filter.unit_measure || '',
            type_unit_measure: filter.type_unit_measure || 'text',
            filter_id: filter.id
        };

        const updatedMeasures = [...measures, newMeasure];
        onMeasuresChange?.(updatedMeasures);
        setOpenMeasuresList(false);
    }, [measures, onMeasuresChange]);

    const handleRemoveMeasure = useCallback((measureId) => {
        const updatedMeasures = measures.filter(m => m.id !== measureId);
        onMeasuresChange?.(updatedMeasures);
    }, [measures, onMeasuresChange]);

    const handleValueChange = useCallback((measureId, newValue) => {
        const updatedMeasures = measures.map(measure =>
            measure.id === measureId ? { ...measure, value: newValue } : measure
        );
        onMeasuresChange?.(updatedMeasures);
    }, [measures, onMeasuresChange]);

    useEffect(() => {
        if (containerRef.current) {
            const itemsCount = measures?.length || 0;

            const totalItems = itemsCount + 1;

            const cols = 4;

            const rowsCount = Math.ceil(totalItems / cols);

            const itemHeight = 8;
            const rowGap = 1;
            const headerHeight = 4;
            const verticalPadding = 1.5;

            const totalHeight = headerHeight +
                (rowsCount * itemHeight) +
                ((rowsCount - 1) * rowGap) +
                verticalPadding;

            const finalHeight = Math.max(5, totalHeight);

            setMaxHeight(`${finalHeight}vw`);
        }
    }, [measures?.length]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMeasuresList &&
                addButtonRef.current &&
                !addButtonRef.current.contains(event.target) &&
                !event.target.closest('.product-measures-add-list')) {
                setOpenMeasuresList(false);
            }
        };

        if (openMeasuresList) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMeasuresList]);

    return (
        <>
            <div
                className="product-measures-admin"
                ref={containerRef}
                style={{ maxHeight }}
            >
                <div className={'product-measures-admin-header'}>
                    <div className={'product-measures-admin-header__title'}>
                        Дополнительная информация
                    </div>
                </div>

                <div className={'product-measures-admin-list'}>
                    <div
                        ref={addButtonRef}
                        className={'product-measures-admin-item add-measure-button'}
                        onClick={handelOpenAddMeasuresList}
                    >
                        <PlusImg/>
                    </div>
                    {measures?.map((measure, index) => (
                        <PoductMesureAdminItem
                            key={measure.id || index}
                            index={index}
                            measure={measure}
                            onRemove={handleRemoveMeasure}
                            onValueChange={handleValueChange}
                        />
                    ))}
                </div>
            </div>

            {openMeasuresList && (
                <ProductMeasuresAddList
                    onAddMeasure={handleAddMeasure}
                    existingMeasures={measures}
                    buttonRef={addButtonRef}
                    onClose={handleCloseAddMeasuresList}
                    clickPosition={clickPosition}
                />
            )}
        </>
    );
};

export default ProductMeasuresAdmin;