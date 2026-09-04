import React, { useEffect, useState } from "react";
import "./filterSidebar.scss";
import Checkbox from "@/widgets/categoryPage/filterSidebar/ui/Checkbox/Checkbox";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";

const ANIMATION_DURATION = 200;

const FilterSidebar = ({
                           filters,
                           loading,
                           selectedFilters,
                           onFilterChange,
                           onClearFilters,
                           className,
                       }) => {
    const [expandedGroups, setExpandedGroups] = useState({});
    const [visibleGroups, setVisibleGroups] = useState({});
    const [closingGroups, setClosingGroups] = useState({});

    const toggleGroup = (id) => {
        const isOpen = expandedGroups[id];

        if (isOpen) {
            setExpandedGroups((prev) => ({ ...prev, [id]: false }));
            setClosingGroups((prev) => ({ ...prev, [id]: true }));
            setTimeout(() => {
                setVisibleGroups((prev) => ({ ...prev, [id]: false }));
                setClosingGroups((prev) => ({ ...prev, [id]: false }));
            }, ANIMATION_DURATION);
        } else {
            setVisibleGroups((prev) => ({ ...prev, [id]: true }));
            requestAnimationFrame(() => {
                setExpandedGroups((prev) => ({ ...prev, [id]: true }));
            });
        }
    };

    const isChecked = (groupId, value) => {
        return selectedFilters.some(
            (f) => f.id === groupId && f.values.includes(value)
        );
    };

    const handleCheckboxChange = (groupId, value, checked) => {
        onFilterChange(groupId, value, checked);
    };

    useEffect(() => {
        if (!filters?.length) return;
        const expanded = {};
        const visible = {};
        filters.forEach((group) => {
            const hasSelected = selectedFilters.some((f) => f.id === group.id);
            if (hasSelected) {
                expanded[group.id] = true;
                visible[group.id] = true;
            }
        });
        setExpandedGroups((prev) => ({ ...prev, ...expanded }));
        setVisibleGroups((prev) => ({ ...prev, ...visible }));
    }, [filters, selectedFilters]);

    return (
        <div className={`filter-sidebar ${className} ${loading ? "loading" : ""}`}>
            {filters?.length > 0 && <div className="filter-title">Фильтры</div>}
            <div className="filter-scroll">
                {filters?.length ? (
                    filters.map((group) => {
                        const isOpen = expandedGroups[group.id];
                        const isVisible = visibleGroups[group.id];
                        const isClosing = closingGroups[group.id];

                        return (
                            <div key={group.id} className="filter-group">
                                <button
                                    className="filter-group__title"
                                    onClick={() => toggleGroup(group.id)}
                                >
                                    {group.name}
                                    <ArrowBack
                                        className={`arrow ${isOpen ? "open" : ""}`}
                                    />
                                </button>
                                {isVisible && (
                                    <div
                                        className={`filter-group__content ${
                                            isOpen ? "open" : isClosing ? "closing" : ""
                                        }`}
                                    >
                                        {group.values.map((value, i) => (
                                            <Checkbox
                                                key={`${group.id}-${i}`}
                                                id={`${group.id}-${i}`}
                                                label={value}
                                                checked={isChecked(group.id, value)}
                                                onChange={(checked) =>
                                                    handleCheckboxChange(group.id, value, checked)
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="filter-empty">Фильтров нет</div>
                )}
            </div>
            {filters?.length > 0 && (
                <div className="filter-actions">
                    <ButtonDefault onClick={onClearFilters} text="Очистить" classButton={'filter-actions__clear'}/>
                </div>
            )}
        </div>
    );
};

export default FilterSidebar;