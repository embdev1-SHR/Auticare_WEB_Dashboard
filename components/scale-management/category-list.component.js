import React from 'react'
import CategoryItem from './category-item.component';
import { NavItem, NavLink } from 'reactstrap';
import { useState } from 'react';
import { useEffect } from 'react';

function CategoryList({ key, index, Category, textFieldActive, handleCategoryEdit, setAlert, setId, hide }) {

    const [activeTab, setActiveTab] = useState(false);


    const toggleTab = (tab, catID) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }

        const qn = arrangeQuestions(questions, catID).map((q) => {
            return {
                Score: [
                    { value: q.ResponseOption1, weight: q.ResponseScore1 },
                    { value: q.ResponseOption2, weight: q.ResponseScore2 },
                    { value: q.ResponseOption3, weight: q.ResponseScore3 },
                    { value: q.ResponseOption4, weight: q.ResponseScore4 },
                    { value: q.ResponseOption5, weight: q.ResponseScore5 },
                ],
                ...q,
            };
        });
        setSelectedCategory(catID);
        setSelectedCatQn(qn);
    };
    
    const arrangeQuestions = (questions, catID) => {
        const qn = questions.filter((q) => q.CategoryID === catID).sort((a, b) => a.QuestionNumber - b.QuestionNumber);
        return qn;
    };


    useEffect(() => {
        const size = categories.length;
        if (size > 0) toggleTab(size, categories[size - 1].CategoryID);
    }, [categories, questions]);




    return (
        <NavItem key={key}>
            <NavLink
                style={{ cursor: "default" }}
                className={activeTab === key + 1 ? "active" : ""}
                onClick={() => {
                    toggleTab(key + 1, Category.CategoryID);
                }}
            >
                <CategoryItem
                    index={index}
                    Category={Category}
                    textFieldActive={textFieldActive}
                    handleCategoryEdit={handleCategoryEdit}
                    setAlert={setAlert}
                    setId={setId}
                    hide={hide}
                />
            </NavLink>
        </NavItem>
    )
}

export default CategoryList