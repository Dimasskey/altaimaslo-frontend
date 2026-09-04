import {useState, useCallback} from "react";

export const useModalWithClass = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState)
    const [modalClass, setModalClass] = useState('')

    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => {
        setIsOpen(false);
        setModalClass('')
    }, [])
    const toggleModal = useCallback(() => setIsOpen(prev => !prev), [])

    const setModalClassName = useCallback((classname) => setModalClass(classname), [])
    const resetModalClass = useCallback(() => setModalClass(''), [])

    return {
        isOpen,
        modalClass,
        openModal,
        closeModal,
        toggleModal,
        setModalClass: setModalClassName,
        resetModalClass
    }
}