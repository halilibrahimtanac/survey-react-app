import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Firebase from "../store/Firebase";
import Modal from "./Modal";
import { jsPDF } from 'jspdf'


const Result = () => {
    const [answers, setAnswers] = useState([])
    const [user, setUser] = useState({})
    const [survey, setSurvey] = useState({})
    const [surveyI, setSurveyI] = useState(0)
    const [type, setType] = useState(null)
    const [display, setDisplay] = useState(false)
    const fire = new Firebase()
    const navigate = useNavigate()

    useEffect(() => {
        async function getAnswers(){
            let answers = await fire.getAnswers()
            console.log(answers)
            setAnswers(answers)
        }

        return () => { getAnswers() }
    }, [])

    const showHideFunc = () => {
        setDisplay(!display)
    }

    const getData = async (data, type,i) => {
        if( type === "USER"){
           let user = await fire.getUser(data)
           setUser(user)
           showHideFunc() 
        }
        else {
            setSurvey(data)
            setSurveyI(i)
            showHideFunc()
        }
        setType(type)
    }

    const savePdf = async (answer) => {
        const doc = new jsPDF()
        let startV = 10
        
        let user = await fire.getUser(answer.userInfo)

        doc.text("-- User Info --",30, startV)
        startV = startV + 10
        doc.text("User name: " + user.userName, 10, startV)
        startV = startV + 10
        doc.text("User e-mail: " + user.email, 10, startV)
        startV = startV + 20
        doc.text("-- Survey Answers --", 30, startV)
        for (let i = 0; i< answer.answers.length; i++){
            startV = startV + 20
            if(answer.surveyInfo.questions[i].questionTitle.length > 60){
                let cutted = answer.surveyInfo.questions[i].questionTitle.slice(0, 60)
                doc.text("Question Title: " + cutted, 5, startV)
                startV = startV + 10
                doc.text(answer.surveyInfo.questions[i].questionTitle.slice(60,answer.surveyInfo.questions[i].questionTitle.length), 5, startV)
            }
            else {
              doc.text("Question Title: " + answer.surveyInfo.questions[i].questionTitle, 5, startV)  
            }
            
            startV = startV + 10
            if (answer.surveyInfo.questions[i].questionType === "blank"){
                doc.text("Answer: " + answer.answers[i], 5, startV)
            }
            else {
                doc.text(answer.answers[i] === answer.surveyInfo.questions[i].multipleChoices.A ? 
                "[A: " + answer.surveyInfo.questions[i].multipleChoices.A + "]" : 
                "A: " + answer.surveyInfo.questions[i].multipleChoices.A, 5, startV)

                doc.text(answer.answers[i] === answer.surveyInfo.questions[i].multipleChoices.B ? 
                    "[B: " + answer.surveyInfo.questions[i].multipleChoices.B + "]" : 
                    "B: " + answer.surveyInfo.questions[i].multipleChoices.B, 55, startV)

                doc.text(answer.answers[i] === answer.surveyInfo.questions[i].multipleChoices.C ? 
                    "[C: " + answer.surveyInfo.questions[i].multipleChoices.C + "]" : 
                    "C: " + answer.surveyInfo.questions[i].multipleChoices.C, 105, startV)
                
                doc.text(answer.answers[i] === answer.surveyInfo.questions[i].multipleChoices.D ? 
                    "[D: " + answer.surveyInfo.questions[i].multipleChoices.D + "]" : 
                    "D: " + answer.surveyInfo.questions[i].multipleChoices.D, 155, startV)
                
            }
        }
        doc.save("" + answer.userInfo + ".pdf")
    }

    const signOut = async () => {
        await fire.signOut()
        navigate("/")
    }

    const goBack = () => {
        navigate("/survey")
    }
    
    return <React.Fragment>
        {display && type === "USER" ? 
        <Modal showHideFunc={showHideFunc}>
            
             <h1>-- User Informations --</h1>
            <label>User Name: <strong>{user?.userName}</strong> </label><br />
            <label>User E-mail: <strong>{user?.email}</strong> </label><br />
            <label>UID: <strong>{user?.uid}</strong> </label><br /><br />

            <button onClick={showHideFunc}>OK</button>

        </Modal> : (display && type === "SURVEY" ? <Modal showHideFunc={showHideFunc}>
           <h1>-- Survey Informations --</h1>
           { survey.questions.map((q,i) => (
               <span key={i}>
               <label>{ i + 1 }. Question Title: <strong>{q.questionTitle}</strong></label>
               <br />
               { q.questionType === "blank" ? <label>{answers[surveyI].answers[i]}</label> : 
                   <label>
                   A: { q.multipleChoices.A === answers[surveyI].answers[i] ? <strong>{q.multipleChoices.A}</strong> : q.multipleChoices.A}<br />  
                   B: { q.multipleChoices.B === answers[surveyI].answers[i] ? <strong>{q.multipleChoices.B}</strong> : q.multipleChoices.B}<br />  
                   C: { q.multipleChoices.C === answers[surveyI].answers[i] ? <strong>{q.multipleChoices.C}</strong> : q.multipleChoices.C}<br /> 
                   D: { q.multipleChoices.D === answers[surveyI].answers[i] ? <strong>{q.multipleChoices.D}</strong> : q.multipleChoices.D}<br /> 
                   </label>
               }
               <br />
               <br />
               </span>
           ))
           }
          <button onClick={showHideFunc}>OK</button> 
       </Modal> : null)
        }
        <button onClick={goBack}>Go Back</button>
        <h1>Result</h1>
         <table>
            <tbody>
                <tr>
                    <th>User ID</th>
                    <th>Survey Title</th>
                    <th></th>
                </tr>
        {
            answers?.map((a,i) => (
                <tr key={i}>
                    <td><label onClick={() => getData(a.userInfo, "USER",i)}>{a.userInfo}</label></td>
                    <td><label onClick={() => getData(a.surveyInfo, "SURVEY",i)}>{ a.surveyInfo.title }</label></td>
                    <td><button onClick={() => savePdf(a)}>Save as PDF</button></td>
                </tr>
            ))
        }
        </tbody>
        </table> 
        <button onClick={signOut}>Log Out</button>
    </React.Fragment>
}

export default Result