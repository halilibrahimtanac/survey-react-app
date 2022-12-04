import React, { useContext, useEffect, useState } from "react";
import { SurveyContext } from "../store/survey-context";
import classes from './SignUp.module.css'
import { useNavigate } from "react-router-dom";
import Firebase from "../store/Firebase";

const Survey = () => {  
    const surveyCtx = useContext(SurveyContext)

    const [survey, setSurvey] = useState({
        surveyTitle: "",
        questionNumber: "",
        duration: "",
        category: "",
        leftempty: "",
        questionNav: "",
        year: "",
        expireD: ""
    })
    const [isSubmitted, setSubmitted] = useState(false)

    const [user, setUser] = useState({})

    const fire = new Firebase()
    const navigate = useNavigate()

    useEffect(() => {
        async function getUser(){
            let u = await fire.getCurrentUser()
            setUser(u) 
     
        }

        return () => { getUser() }
    }, [])
    
    const submitHandler = (e) => {
        e.preventDefault()
        if(!Object.values(survey).includes("")){

                surveyCtx.createSurvey({
                        type: "CREATE",
                        title: survey.surveyTitle,
                        number: parseInt(survey.questionNumber),
                        duration: parseInt(survey.duration),
                        category: survey.category,
                        leftempty: survey.leftempty === "yes" ? true : false,
                        questionNavigate: survey.questionNav === "yes" ? true : false,
                        year: survey.year,
                        expireDate: survey.expireD
                        })
                        setSubmitted(true)

        }
        else {
            alert("Don't left empty area")
        }
    }

    const questionsSubmitHandler = (e) => {
        e.preventDefault()
        let quest = surveyCtx.surveyRed.questions.map((q) => q.questionTitle)
        surveyCtx.surveyRed.questions.map((q) => {
            quest = [...quest, q.questionType]
            if(q.questionType === "choice"){
                quest = [...quest, q.multipleChoices.A,q.multipleChoices.B,q.multipleChoices.C,q.multipleChoices.D]
            }
            })
        if(quest.includes("")){
            alert("Don't left empty")
        }
        else {
            surveyCtx.createQuestions()
            setSubmitted(false)
        }
    }
    
    const signOut = async () => {
       await fire.signOut()
       navigate("/")
    }

    const resultNav = () => {
        navigate("/result")
    }

    const archiveNav = () => {
        navigate("/archive")
    }

    return <React.Fragment>
        <label>User Name: </label><h4 style={{ display: "inline-block", margin: "0", marginRight: "10px"}}>{ user?.userName }</h4>
        <button onClick={signOut}>Sign out</button> <br />
        <button onClick={resultNav}>Result</button> <br />
        <button onClick={archiveNav}>Survey Archive</button>
        {
            !isSubmitted ? 
            <form onSubmit={submitHandler}>
              <h1 style={{ textAlign: "center"}}>Survey Basic Informations</h1>  
                <table>
                    <tbody>
                        <tr>
                            <td><label>Survey Title:</label></td>
                            <td><input type="text" onChange={(e) => setSurvey({...survey, surveyTitle: e.target.value})}></input></td>
                        </tr>

                        <tr>
                            <td><label>Number of questions:</label></td>
                            <td><input type="number" onChange={(e) => setSurvey({...survey, questionNumber: e.target.value})}></input></td>
                        </tr>

                        <tr>
                            <td><label>Duration(minute):</label></td>
                            <td><input type="number" onChange={(e) => setSurvey({...survey, duration: e.target.value})}></input></td>
                        </tr>

                        <tr>
                            <td><label>Category:</label></td>
                            <td>
                                <select name="category" onChange={(e)=> setSurvey({...survey, category: e.target.value})}>
                                    <option key="blank"></option>
                                {
                                    surveyCtx.categories.map((c,i) => (
                                       <option key={i} value={c}>{c}</option> 
                                    ))
                                }
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <td><label>Left Empty Option:</label></td>
                            <td>Yes:<input type="radio" name="leftempty" value="yes" onChange={(e) => setSurvey({...survey, leftempty: e.target.value})}/>
                            No:<input type="radio" name="leftempty" value="no" onChange={(e) => setSurvey({...survey, leftempty: e.target.value})}/></td>
                        </tr>

                        <tr>
                            <td><label>Question Navigate:</label></td>
                            <td>Yes:<input type="radio" name="questionnav" value="yes" onChange={(e) => setSurvey({...survey, questionNav: e.target.value})}/>No:<input type="radio" name="questionnav" value="no" onChange={(e) => setSurvey({...survey, questionNav: e.target.value})}/></td>
                        </tr>

                        <tr>
                            <td><label>Year:</label></td>
                            <td><input type="date" onChange={(e)=> setSurvey({...survey, year: e.target.value})}/> </td>
                        </tr>

                        <tr>
                            <td><label>Expire Date:</label></td>
                            <td><input type="date" onChange={(e)=> setSurvey({...survey, expireD: e.target.value})}/> </td>
                        </tr>

                        <tr>
                            <td>
                                
                                
                            </td>
                            <td>
                                <button type="submit">Create</button> 
                            </td>
                        </tr>
                    </tbody>
                </table>
                </form> : null
        }
        
        {
            isSubmitted ? <form onSubmit={questionsSubmitHandler}>
                <table>
            <tbody>
                {
                    surveyCtx.surveyRed.questions.map((q,i) => (
                        <div>
                        <tr key={i}>
                            <div>
                            <td>{i+1}. Question: </td>
                            <td><input type="text" onChange={(e) => surveyCtx.questionTitle({ type: "QUESTION_TITLE", title: e.target.value, questionIndex: i})}></input></td>
                            
                            <td>Question Type:</td>
                            <td>Fill the blank <input type="radio" name={i +"type"} value="blank"  onChange={(e) => surveyCtx.questionType({ type: "QUESTION_TYPE", qType: e.target.value, questionIndex: i})}/>
                            Multiple choice <input type="radio" name={i+"type"} value="choice" onChange={(e) => surveyCtx.questionType({ type: "QUESTION_TYPE", qType: e.target.value, questionIndex: i})}/>
                            </td>
                            </div>
                            

                        </tr>
                       
                           { q.questionType === "choice" ?
                            <tr>
                                <div>
                            <td>
                                A: <input type="text" onChange={(e) => surveyCtx.questionChoice({ type: "CHOICE", text: e.target.value, choice: "A", questionIndex: i})} />
                            </td>
                            <td>  
                                B: <input type="text" onChange={(e) => surveyCtx.questionChoice({ type: "CHOICE", text: e.target.value, choice: "B", questionIndex: i})} />
                            </td>
                            <td>
                                C: <input type="text" onChange={(e) => surveyCtx.questionChoice({ type: "CHOICE", text: e.target.value, choice: "C", questionIndex: i})} />
                            </td>
                            <td>
                                D: <input type="text" onChange={(e) => surveyCtx.questionChoice({ type: "CHOICE", text: e.target.value, choice: "D", questionIndex: i})} />
                                </td>
                                </div>
                            </tr> : null} 
                        
                        </div>
                    ))
                }
                
            </tbody>
        </table>
            <button type="submit">Create</button>
        </form>
        : null
        }
        
    </React.Fragment>
}

export default Survey