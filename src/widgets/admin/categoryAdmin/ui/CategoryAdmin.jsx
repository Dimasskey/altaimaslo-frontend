import React, {useState, useEffect, useCallback} from 'react';
import {useFetchCategories} from "@shared/hooks/useCategoryAdmin/useFetchCategories";
import {useDeleteCategory} from "@shared/hooks/useCategoryAdmin/useDeleteCategory";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";
import {useUpdateCategoryOrder} from "@shared/hooks/useCategoryAdmin/useUpdateCategoryOrder";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import PlusImg from "@shared/imges/svg/plusSvg.svg?react";
import "./CategoryAdminStyles.scss"
import {SortableCategoryItem} from "@/entities/admin/categoryItem/ui/SortableCategoryItem";
import AddCategoryAdmin from "@/features/admin/categoryAdmin/addCategoryAdmin/ui/AddCategoryAdmin";
import EditCategory from "@/features/admin/categoryAdmin/editCategory/ui/editCategory";

const CategoryAdmin = () => {
    const [openAddCategory, setOpenAddCategory] = useState(false)
    const [openEditCategory, setOpenEditCategory] = useState(false)
    const [editData, setEditData] = useState(null)
    const [localCategories, setLocalCategories] = useState([])
    const [isSavingOrder, setIsSavingOrder] = useState(false)

    const {showSuccess, showError, showConfirm, showStatusModal, closeStatusModal} = useStatusModal()

    const showModal = useCallback((modalData) => {
        if (modalData.error) {
            showError(modalData.message || 'Произошла ошибка');
        } else {
            showSuccess(modalData.message || 'Операция выполнена успешно');
        }
    }, [showError, showSuccess]);

    const {categories, loading, fetchCategories} = useFetchCategories(showModal);
    const {deleteCategory, actionStatus: deleteStatus, resetActionStatus: resetDeleteStatus} = useDeleteCategory(showModal, fetchCategories);
    const {updateCategoryOrder, loading: updateOrderLoading} = useUpdateCategoryOrder(showModal, fetchCategories);

    // Синхронизируем локальное состояние с загруженными категориями
    useEffect(() => {
        if (categories && categories.length > 0) {
            setLocalCategories(categories);
        }
    }, [categories]);

    useEffect(() => {
        if (deleteStatus?.isSuccess) {
            showSuccess(deleteStatus.message);
        } else if (deleteStatus?.isError) {
            showError(deleteStatus.message);
        }
    }, [deleteStatus, showError, showSuccess]);

    useEffect(() => {
        setIsSavingOrder(updateOrderLoading);
    }, [updateOrderLoading]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = useCallback(async (event) => {
        const {active, over} = event;

        if (!over || active.id === over.id) {
            return;
        }

        setLocalCategories((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            if (oldIndex === -1 || newIndex === -1) {
                return items;
            }

            const newItems = arrayMove(items, oldIndex, newIndex);

            handleSaveOrder(newItems);

            return newItems;
        });
    }, []);

    const handleSaveOrder = useCallback(async (reorderedCategories) => {
        try {
            setIsSavingOrder(true);

            showStatusModal({
                type: "info",
                title: "Сохранение порядка",
                message: "Идёт сохранение порядка категорий...",
                showClose: false,
            });

            await updateCategoryOrder(reorderedCategories);

            await closeStatusModal();
            showSuccess('Порядок категорий успешно сохранён');

        } catch (error) {
            console.error('Ошибка при обновлении порядка:', error);

            await closeStatusModal();
            showError('Произошла ошибка при обновлении порядка категорий');

            fetchCategories();
        } finally {
            setTimeout(() => {
                setIsSavingOrder(false);
            }, 5000);
        }
    }, [updateCategoryOrder, showError, showSuccess, showStatusModal, closeStatusModal, fetchCategories]);

    const handleOpenAddCategory = useCallback(() => {
        setOpenAddCategory(true)
    }, []);

    const handleCloseAddCategory = useCallback(() => {
        setOpenAddCategory(false)
        fetchCategories();
    }, [fetchCategories]);

    const handleOpenEditCategory = useCallback((data) => {
        setOpenEditCategory(true)
        setEditData(data)
    }, []);

    const handleCloseEditCategory = useCallback(() => {
        setOpenEditCategory(false)
        setEditData(null)
        fetchCategories();
    }, [fetchCategories]);

    const handleDeleteCategory = useCallback((item) => {
        showConfirm(
            `Вы уверены, что хотите удалить категорию "${item.name}"?`,
            'Подтверждение удаления',
            {
                onConfirm: async () => {
                    try {
                        await deleteCategory(item);
                    } catch (error) {
                        console.error('Ошибка при удалении категории:', error);
                        showError('Произошла ошибка при удалении категории');
                    }
                },
                confirmText: 'Удалить',
                cancelText: 'Отмена'
            }
        );
    }, [deleteCategory, showError, showConfirm]);

    return (
        <>
            {
                !openAddCategory && !openEditCategory && (
                    <div className={'category_admin-wrapper'}>
                        <div className={'category_admin-header'}>
                            Категории
                            <ButtonDefault
                                text={'Добавить категорию'}
                                img1={PlusImg}
                                classButton={'category_admin-header-button'}
                                classImg1={'category_admin-header-button_img'}
                                onClick={handleOpenAddCategory}
                            />
                        </div>

                        <div className={`category_admin-body ${loading ? 'loading' : 'loaded'}`}>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={localCategories.map(cat => cat.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {localCategories?.map((item) => (
                                        <SortableCategoryItem
                                            key={item.id}
                                            id={item.id}
                                            name={item.name}
                                            img={item.attachments_guid}
                                            onEdit={() => handleOpenEditCategory(item)}
                                            onDelete={() => handleDeleteCategory(item)}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>


                        {!loading && localCategories.length === 0 && (
                            <div className={'category_admin-no-categories'}>У вас нет категорий</div>
                        )}
                    </div>
                )
            }
            {
                openAddCategory && (
                    <AddCategoryAdmin handelClose={handleCloseAddCategory}/>
                )
            }
            {
                openEditCategory && (
                    <EditCategory
                        handelClose={handleCloseEditCategory}
                        editData={editData}
                        isOpen={openEditCategory}
                    />
                )
            }
        </>
    );
};

export default CategoryAdmin;