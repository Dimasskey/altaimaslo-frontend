import React, { useEffect } from 'react';
import { useFetchInformationAdmin } from '@/features/admin/informationAdmin/lib/useFetchInformationAdmin';
import { useUpdateInformationAdmin } from '@/features/admin/informationAdmin/lib/useUpdateInformationAdmin';
import { useSlateEditor } from '@/entities/admin/information/lib/useSlateEditor';
import { SlateEditor } from '@/entities/admin/information/ui/SlateEditor/SlateEditor';
import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import "./InformationStyles.scss";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";

const InformationAdmin = () => {
    const {
        informations,
        selectedInformation,
        getAllInformation,
        getInformation,
        setSelectedInformation,
        loading
    } = useFetchInformationAdmin();

    const { updateInformation, loading: saving } = useUpdateInformationAdmin();

    const {
        editor,
        value,
        setValue,
        initializeEditor,
        getHtmlContent,
        editorKey
    } = useSlateEditor();

    useEffect(() => {
        getAllInformation();
    }, [getAllInformation]);

    useEffect(() => {
        if (selectedInformation?.about) {
            initializeEditor(selectedInformation.about);
        } else {
            initializeEditor('');
        }
    }, [selectedInformation, initializeEditor]);

    const handleSelectChange = (selectedValue) => {
        const selectedInfo = informations.find(info => info.name === selectedValue);
        if (selectedInfo) {
            setSelectedInformation(selectedInfo);
            getInformation(selectedInfo.id);
        }
    };

    const handleSave = async () => {
        if (!selectedInformation) return;

        const htmlContent = getHtmlContent();

        if (!htmlContent || htmlContent.trim() === '<p></p>') {
            console.error('No content to save');
            return;
        }

        const success = await updateInformation(selectedInformation.id, {
            about: htmlContent
        });

        if (success) {
            getAllInformation();
            getInformation(selectedInformation.id);
        }
    };

    const selectItems = informations.map(info => ({
        value: info.name,
        label: info.name
    }));

    return (
        <div className="information-wrapper">
            <div className="information-header">
                <CustomSelect
                    items={selectItems}
                    onChange={handleSelectChange}
                    type="information-select"
                    placeholder={"Информация о доставке"}
                />

                <ButtonDefault
                    onClick={handleSave}
                    disabled={saving}
                    classButton={"information-save-btn"}
                    text={"Сохранить"}
                />
            </div>

            <div className={`information-container ${loading ? 'loading' : 'loaded'}`}>
                {selectedInformation && (
                        <div className="information-editor">
                            {editor && value && Array.isArray(value) ? (
                                <SlateEditor
                                    editor={editor}
                                    value={value}
                                    onChange={setValue}
                                    editorKey={editorKey}
                                    placeholder="Введите текст информации..."
                                />
                            ) : (
                                <div>Загрузка редактора...</div>
                            )}
                        </div>

                )}
            </div>

        </div>
    );
};

export default InformationAdmin;