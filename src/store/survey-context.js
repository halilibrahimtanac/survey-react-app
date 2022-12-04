import React, { useState, useReducer } from "react";
import Firebase from "./Firebase";

export const SurveyContext = React.createContext({
    surveyList: [],
    surveyRed: {},
    categories: [],
    createSurvey : () => {},
    questionTitle : () => {},
    questionType : () => {},
    questionChoice : () => {},
    createQuestions : () => {}
})


const surveyReducer = (state,action) => {
    if (action.type === "CREATE") {
        let questions = []
        for(let i = 0; i<action.number;i++){
            questions = [...questions, {
                questionNumber: i,
                questionTitle: "",
                questionType: "",
                multipleChoices: { A: "", B: "", C: "", D: ""}
            }]
        }
        return {
            title: action.title, 
            questions: questions, 
            duration: action.duration, 
            category: action.category, 
            leftEmpty: action.leftempty, 
            questionNavigate: action.questionNavigate,
            year: action.year,
            expireDate: action.expireDate }
    }
    if(action.type === "QUESTION_TITLE"){
        let updatedQuestions = [...state.questions]
        updatedQuestions[action.questionIndex].questionTitle = action.title

        return { ...state, questions: updatedQuestions}
    }

    if(action.type === "QUESTION_TYPE"){
        let updatedQuestions = [...state.questions]
        updatedQuestions[action.questionIndex].questionType = action.qType
        if(action.qType === "blank") {
            updatedQuestions[action.questionIndex].multipleChoices = {A: "", B: "", C: "", D: ""}
        }

        return { ...state, questions: updatedQuestions}
    }

    if(action.type === "CHOICE"){
        
        let updatedQuestions = [...state.questions]
        if(action.choice === "A"){
           updatedQuestions[action.questionIndex].multipleChoices = {
            ...updatedQuestions[action.questionIndex].multipleChoices,
            A : action.text
        } 
        }

        else if(action.choice === "B"){
            updatedQuestions[action.questionIndex].multipleChoices = {
             ...updatedQuestions[action.questionIndex].multipleChoices,
             B : action.text
         } 
         }

        else if(action.choice === "C"){
            updatedQuestions[action.questionIndex].multipleChoices = {
             ...updatedQuestions[action.questionIndex].multipleChoices,
             C : action.text
         } 
         }

        else if(action.choice === "D"){
            updatedQuestions[action.questionIndex].multipleChoices = {
             ...updatedQuestions[action.questionIndex].multipleChoices,
             D : action.text
         } 
         }
        
         return { ...state, questions: updatedQuestions}
    }
}


const SurveyContextProvider = (props) => {
    const firebase = new Firebase()
    const [surveyList, setSurveyList] = useState([])
    const [surveyRed, dispatchSurveyRed] = useReducer(surveyReducer, { 
        title: '',
        questions : [],
        duration: 0, 
        category: "", 
        leftEmpty: null, 
        questionNavigate: null,
        year: null,
        expireDate: null })
    
    const createSurvey = (actionObj) => {
        dispatchSurveyRed(actionObj)
    }

    const questionTitle = (actionObj) => {
        dispatchSurveyRed(actionObj)
    }

    const questionType = (actionObj) => {
        dispatchSurveyRed(actionObj)
    }

    const questionChoice = (actionObj) => {
        dispatchSurveyRed(actionObj)
    }

    const createQuestions = () => {
        setSurveyList((prevState) => {
            return [...prevState, surveyRed]
        })
        firebase.newSurvey(surveyRed)
    }

    return <SurveyContext.Provider value={{
        surveyList: surveyList,
        surveyRed: surveyRed,
        categories: ["game","relationship","personality","movie","psychology"],
        createSurvey: createSurvey,
        questionTitle: questionTitle,
        questionType: questionType,
        questionChoice: questionChoice,
        createQuestions: createQuestions
    }}>
        {props.children}
    </SurveyContext.Provider>
}

export default SurveyContextProvider