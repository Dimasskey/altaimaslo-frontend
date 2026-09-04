import React, {useCallback, useState} from 'react';
import "./filtersAdminStyles.scss"
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import PlusImg from "@shared/imges/svg/plusSvg.svg?react";
import SearchAdmin from "@shared/ui/SearchAdmin/SearchAdmin";
import { useFetchFiltersAdmin } from '../lib/useFetchFiltersAdmin';
import { useStatusModal } from '@/app/providers/statusModalProvider/statusModalProvider';
import AddFiltersAdmin from "@/features/admin/filtersAdmin/addFiltersAdmin/AddFiltersAdmin";
import EditFilters from "@/features/admin/filtersAdmin/editFilters/EditFilters";
import { useFiltersModal } from '@shared/utils/admin/filtersAdminUtils/filtersUtilsAdmin';

import { arrayMove } from '@dnd-kit/sortable';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortableFiltersItem from '@/entities/admin/filtersItem/ui/SortableFiltersItem';

const useFiltersSensors = () => {
    return useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: (event, {activeNode}) => {
                const rect = activeNode.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };
            },
        })
    );
};

const FiltersAdmin = () => {
    const { filters, loading, deleteFilter, fetchFilters, updateFilter, addFilter } = useFetchFiltersAdmin();
    const { showConfirm, closeStatusModal, showSuccess, showError } = useStatusModal();

    const {
        isModalOpen,
        modalType,
        currentFilter,
        modalPosition,
        modalPlacement,
        modalRef,
        calculateModalPosition,
        openModal,
        closeModal
    } = useFiltersModal();

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpenAddFilters, setIsOpenAddFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState([]);
    const [isReordering, setIsReordering] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [activeItem, setActiveItem] = useState(null);

    const sensors = useFiltersSensors();

    React.useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleDeleteFilter = (filterId, filterName) => {
        showConfirm(
            `При удалении фильтра, он открепится от всех товаров и будет удалён навсегда. Вы уверены, что хотите удалить фильтр "${filterName}"?`,
            'Подтверждение удаления',
            {
                onConfirm: async () => {
                    closeStatusModal();
                    await deleteFilter(filterId);
                },
                onCancel: () => {
                    console.log('Удаление отменено');
                },
                confirmText: 'Удалить',
                cancelText: 'Отмена'
            }
        );
    };

    const handleEditFilter = useCallback((filter, element, event) => {
        const rect = element.getBoundingClientRect();
        const positionData = calculateModalPosition(rect, event);
        openModal('edit', filter, positionData);
    }, [calculateModalPosition, openModal]);

    const handleSaveFilter = useCallback(async (filterData) => {
        try {
            if (currentFilter) {
                const updateData = {
                    ...filterData,
                    order_number: filterData.order_number || currentFilter.order_number || 1
                };
                await updateFilter(currentFilter.id, updateData);
                closeModal();
                await fetchFilters();
                showSuccess('Фильтр успешно обновлен');
            }
        } catch (error) {
            console.error('Ошибка при сохранении фильтра:', error);
            showError('Не удалось сохранить фильтр');
        }
    }, [currentFilter, updateFilter, closeModal, fetchFilters, showSuccess, showError]);

    const handleDeleteFilterFromModal = useCallback((filterId, filterName) => {
        handleDeleteFilter(filterId, filterName);
        closeModal();
    }, [handleDeleteFilter, closeModal]);

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        setActiveId(active.id);
        const item = localFilters.find(filter => String(filter.id) === String(active.id));
        setActiveItem(item);
    }, [localFilters]);

    const handleDragEnd = useCallback(async (event) => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setIsReordering(true);

            const currentLocalFilters = [...localFilters];

            const oldIndex = currentLocalFilters.findIndex((item) => String(item.id) === String(active.id));
            const newIndex = currentLocalFilters.findIndex((item) => String(item.id) === String(over.id));

            if (oldIndex === -1 || newIndex === -1) {
                console.error('Не удалось найти элементы для перетаскивания');
                setIsReordering(false);
                return;
            }

            const newOrder = arrayMove(currentLocalFilters, oldIndex, newIndex);

            const updatedOrder = newOrder.map((item, index) => ({
                ...item,
                order_number: index + 1
            }));

            setLocalFilters(updatedOrder);

            try {
                const changedFilters = [];

                for (let i = 0; i < updatedOrder.length; i++) {
                    const newItem = updatedOrder[i];
                    const oldItem = currentLocalFilters.find(item => item.id === newItem.id);

                    if (oldItem && oldItem.order_number !== newItem.order_number) {
                        changedFilters.push(newItem);
                    }
                }

                if (changedFilters.length > 0) {
                    const updatePromises = changedFilters.map(item => {
                        const updateData = {
                            name: item.name,
                            unit_measure: item.unit_measure,
                            type_unit_measure: item.type_unit_measure,
                            order_number: item.order_number
                        };

                        return updateFilter(item.id, updateData)
                            .then(response => {
                                return response;
                            })
                            .catch(error => {
                                console.error(`Ошибка обновления ${item.id}:`, error);
                                throw error;
                            });
                    });

                    const results = await Promise.allSettled(updatePromises);

                    const successfulUpdates = results.filter(r => r.status === 'fulfilled');
                    const failedUpdates = results.filter(r => r.status === 'rejected');

                    if (failedUpdates.length === 0) {
                        showSuccess('Порядок фильтров успешно обновлен');
                    } else {
                        console.error('Не все обновления прошли успешно:', failedUpdates);
                        showError('Часть обновлений не удалась');
                    }

                    await fetchFilters();

                } else {
                    fetchFilters();
                }

            } catch (error) {
                console.error('Ошибка при обновлении порядка фильтров:', error);
                showError('Не удалось обновить порядок фильтров');
                fetchFilters();
            } finally {
                setIsReordering(false);
            }
        } else {

        }
        setActiveId(null);
        setActiveItem(null);
        setIsReordering(false);
    }, [localFilters, updateFilter, fetchFilters, showSuccess, showError]);

    const filteredFilters = localFilters.filter(filter =>
        filter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenAddFilter = useCallback(() => {
        setIsOpenAddFilters(true)
    }, []);

    const handleCloseAddFilter = useCallback(async () => {
        setIsOpenAddFilters(false);
        await fetchFilters();
    }, [fetchFilters]);

    const handleAddFilterSuccess = useCallback(async () => {
        setIsOpenAddFilters(false);
        await fetchFilters();
        showSuccess('Фильтр успешно добавлен');
    }, [fetchFilters, showSuccess]);

    return (
        <div className="filters-admin">
            {!isOpenAddFilters ? (
                <>
                    <div className="filters-admin-heder">
                        <div style={{display:'flex', flexDirection:'row'}}>
                            Фильтры
                            (
                            <div className={`${loading ? 'loading' : 'loaded'}`}>
                                {filters.length}
                            </div>
                            )
                        </div>
                        <SearchAdmin
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            placeholder={"Поиск фильтров..."}
                        />
                        <ButtonDefault
                            text={"Добавить фильтр"}
                            img1={PlusImg}
                            classButton={"button"}
                            classImg1={"button-img"}
                            disabled={loading || isReordering}
                            onClick={handleOpenAddFilter}
                        />
                    </div>

                    <div className={`filters-admin-body ${loading || isReordering ? 'loading' : 'loaded'}`}>
                        {loading || isReordering ? (
                            <div className="filters-admin-empty">
                                {isReordering ? 'Обновление порядка...' : 'Загрузка фильтров...'}
                            </div>
                        ) : filteredFilters.length > 0 ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragCancel={() => {
                                    setActiveId(null);
                                    setActiveItem(null);
                                }}
                            >
                                <SortableContext
                                    items={filteredFilters.map(filter => String(filter.id))}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="filters-list">
                                        {filteredFilters.map((item, index) => (
                                            <SortableFiltersItem
                                                key={item.id}
                                                id={String(item.id)}
                                                item={item}
                                                index={index}
                                                onDelete={handleDeleteFilter}
                                                onEdit={handleEditFilter}
                                                showDeleteButton={true}
                                                isDragging={activeId === String(item.id)}
                                                disabled={loading || isReordering}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeItem ? (
                                        <div style={{
                                            opacity: 0.9,
                                            cursor: 'grabbing',
                                        }}>
                                            <SortableFiltersItem
                                                id={String(activeItem.id)}
                                                item={activeItem}
                                                index={localFilters.findIndex(f => f.id === activeItem.id)}
                                                onDelete={handleDeleteFilter}
                                                onEdit={handleEditFilter}
                                                showDeleteButton={false}
                                                isDragging={true}
                                                isDragOverlay={true}
                                            />
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        ) : (
                            <div className="filters-admin-empty">
                                {searchTerm ? 'Фильтры не найдены' : 'Нет доступных фильтров'}
                            </div>
                        )}
                    </div>

                    {isModalOpen && modalType === 'edit' && (
                        <div className="edit-filter-modal-overlay">
                            <div
                                ref={modalRef}
                                className="edit-filter-modal-container"
                                style={{
                                    position: 'absolute',
                                    top: modalPosition.top,
                                    left: modalPosition.left,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <EditFilters
                                    onClose={closeModal}
                                    onSave={handleSaveFilter}
                                    onDelete={handleDeleteFilterFromModal}
                                    filter={currentFilter}
                                    position={modalPlacement}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <AddFiltersAdmin
                    onClose={handleCloseAddFilter}
                    onSuccess={handleAddFilterSuccess}
                    onAddFilter={addFilter}
                />
            )}
        </div>
    );
};

export default FiltersAdmin;