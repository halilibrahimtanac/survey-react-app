import React, { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Firebase from "../store/Firebase";
import classes from './SignUp.module.css'

const answerReducer = (state,action) => {
    if(action.type === "ANSWER") {
        const updatedAnswers = [...state.answers]
       
        updatedAnswers[action.answer.question] = action.answer.input
        return { ...state, answers: updatedAnswers }
    }

    if( action.type === "SET_USER"){
        return { ...state, userInfo: action.user}
    }
}


const Questions = () => {
    const fire = new Firebase()
    const navigate = useNavigate()
    const location = useLocation()
    const [questionNumber, setQuestionNumber] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isDuration, setIsDuration] = useState(false)
    const [answerRed, dispatchAnswerEducer] = useReducer(answerReducer,{ userInfo: {}, surveyInfo: location.state, answers: location.state.questions.map(() => "") })
    const [questions, setQuestions] = useState([])
    
    useEffect(() => {
        async function setInfo(){
           setQuestions(location.state.questions)
           if(location.state.duration !== 0){
            setIsDuration(true)
             setDuration(location.state.duration * 60)
           }
           
           let user = await fire.getCurrentUser()
           dispatchAnswerEducer({
            type: "SET_USER",
            user: user
           }) 
        }
        
        return () => { setInfo() }
    },[])

    useEffect(() => {
        if(isDuration && duration > 0){
          const x = setInterval(() => {
           updateDuration()
           
          }, 1000);
          
        
          return () => clearInterval(x)  
        } 
        
    },[duration])

    const updateDuration = () => {
        
        setDuration(duration > 0 ? duration - 1 : duration)
        if(duration === 1){
            navigate("/surveyList")
        }
        console.log(duration)
    }

    const onAnswerChange = (answer) => {
        dispatchAnswerEducer({
            type: "ANSWER",
            answer : {
                question: answer.question,
                input: answer.input
            }
        })
    }

    const answersSubmit = async (e) => {
        e.preventDefault()
        if ( !location.state.leftEmpty && answerRed.answers.includes("")){
            alert("Don't left empty question!!!")
            return
        }
        await fire.submitAnswers(answerRed)
        navigate("/surveyList")
    }

    const singleAnswer = () => {
        if (!location.state.leftEmpty && answerRed.answers[questionNumber] === ""){
            alert("Don't left empty")
            return
        }
        else if(questionNumber < location.state.questions.length - 1){
            setQuestionNumber(questionNumber + 1)
        }
    }

    const signOut = async () => {
        await fire.signOut()
        navigate("/")
    }

    const goToSurveyList = () => {
        navigate("/surveyList")
    }

    const previousQ = () => {
        if (questionNumber > 0) {
            setQuestionNumber(questionNumber - 1)
        }
    }

    const nextQ = () => {
        if (questionNumber < questions.length - 1){
            setQuestionNumber(questionNumber + 1)
        }
    }

    
      

    return <div className={classes.row}>
        <div className={classes.column}>
            {location.state.questionNavigate ? <button style={{border: "0", backgroundColor: "white", fontSize: "300%", marginLeft: "40%", marginTop: "25%"}} onClick={previousQ}> { "<" } </button> : null}
        </div>

        <div className={classes.column}>
            
        {
            questions.map((q) => (
                <div style={q.questionNumber === questionNumber ? {} : { display: "none"}}>
                    <h3>{q.questionNumber + 1}. {q.questionTitle}</h3>
                    {q.questionType === 'blank' ? <input type="text" onChange={(e) => onAnswerChange({question: q.questionNumber, input: e.target.value})} /> :
                      <table>
                        <tbody>
                            <tr>
                                <td>{q.multipleChoices.A}</td>
                                <td><input  type="radio" name={q.questionNumber + "question"} value={q.multipleChoices.A} onChange={(e) => onAnswerChange({question: q.questionNumber, input: e.target.value})} /></td>
                            </tr>

                            <tr>
                                <td>{q.multipleChoices.B}</td>
                                <td><input  type="radio" name={q.questionNumber + "question"} value={q.multipleChoices.B} onChange={(e) => onAnswerChange({question: q.questionNumber, input: e.target.value})} /></td>
                            </tr>

                            <tr>
                                <td>{q.multipleChoices.C}</td>
                                <td><input  type="radio" name={q.questionNumber + "question"} value={q.multipleChoices.C} onChange={(e) => onAnswerChange({question: q.questionNumber, input: e.target.value})} /></td>
                            </tr>

                            <tr>
                                <td>{q.multipleChoices.D}</td>
                                <td><input  type="radio" name={q.questionNumber + "question"} value={q.multipleChoices.D} onChange={(e) => onAnswerChange({question: q.questionNumber, input: e.target.value})} /></td>
                            </tr>
                        </tbody>
                        </table>}
                    { !location.state.questionNavigate ? <button onClick={singleAnswer}>answer</button> : null}
                </div>
            ))
        }  

        { duration > 0 ? <h3 style={{ display: "inline-block", marginLeft: "20%"}}>{ duration }s</h3> : null}

        
        </div>
       
        <div className={classes.column}>
            {location.state.questionNavigate ? <button style={{border: "0", backgroundColor: "white", fontSize: "300%", marginLeft: "40%", marginTop: "25%"}} onClick={nextQ}>{ ">" }</button> : null}
            
        </div>
        <button onClick={signOut}>Sign out</button>
        

        {questionNumber === location.state.questions.length - 1 ? <button style={{ marginLeft: "50%"}} onClick={answersSubmit}>send answers</button> : null}
        <table>
            <tbody>
                <tr>
                    <td>Survey title:</td>
                    <td><label> <strong>{ location.state.title}</strong></label></td>
                </tr>

                <tr>
                    <td>Category: </td>
                    <td><label><strong>{ location.state.category}</strong></label> </td>
                </tr>

                <tr>
                    <td>Left empty option:</td>
                    <td><label> <strong>{ location.state.leftEmpty ? "Yes" : "No"}</strong></label></td>
                </tr>

                <tr>
                    <td>Question navigate: </td>
                    <td><label><strong>{ location.state.questionNavigate ? "Yes" : "No"}</strong></label> </td>
                </tr>

                <tr>
                    <td>Duration: </td>
                    <td><label><strong>{ location.state.duration} minute</strong></label> </td>
                </tr>
            </tbody>
        </table>

        <button onClick={goToSurveyList}>Leave Survey</button>
    </div>
}

export default Questions