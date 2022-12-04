import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Firebase from "../store/Firebase";
import Modal from "./Modal";


const SurveyArchive = () => {
    const fire = new Firebase()
    const navigate = useNavigate()
    const [surveys, setSurveys] = useState([])
    const [display, setDisplay] = useState(false)
    const [survey, setSurvey] = useState({})
    const [newExpireDates, setNewExpireDates] = useState([])

    useEffect(() => {
        async function getSurveys(){
            let s = await fire.getAllSurvey()
            setSurveys(s)
            setNewExpireDates(s.map((s) => ""))
        }

        return () => { getSurveys() }
    },[])

    const newExpireDateFunc = (e,i) => {
        let sur = [...newExpireDates]
        sur[i] = e.target.value
        setNewExpireDates(sur)
    }

    const showHideFunc = () => {
        setDisplay(!display)
    }

    const showSurveyInfo = (s) => {
        setSurvey(s)
        console.log(s)
        showHideFunc()
    }

    const reuseSurvey = (s,i) => {
        console.log(s)
        let updatedSurvey = {
            ...s,
            expireDate: newExpireDates[i]
        }
        fire.reuseSurvey(updatedSurvey)
    }
    return <React.Fragment>
        { display ? <Modal showHideFunc={showHideFunc}>
        <h1>-- Survey Informations --</h1>
           <table>
                <tbody>
                    <tr>
                        <td>Title:</td>
                        <td><strong>{ survey.title }</strong></td>
                    </tr>

                    <tr>
                        <td>Category:</td>
                        <td><strong>{ survey.category }</strong></td>
                    </tr>

                    <tr>
                        <td>Duration:</td>
                        <td><strong>{ survey.duration } minute</strong></td>
                    </tr>

                    <tr>
                        <td>Left Empty Option:</td>
                        <td><strong>{ survey.leftEmpty ? "Yes" : "No" }</strong></td>
                    </tr>

                    <tr>
                        <td>Question Navigate:</td>
                        <td><strong>{ survey.questionNavigate ? "Yes" : "No"}</strong></td>
                    </tr>

                    <tr>
                        <td>Year:</td>
                        <td><strong>{ survey.year }</strong></td>
                    </tr>

                    <tr>
                        <td>Expire Date:</td>
                        <td><strong>{ survey.expireDate }</strong></td>
                    </tr>
                </tbody>
           </table>

            <br />
            <br />
           

           { survey.questions.map((q,i) => (
               <span key={i}>
               <label>{ i + 1}. Question Title: <strong>{q.questionTitle}</strong></label>
               <br />
               { q.questionType === "blank" ? <label>Text input type</label> : 
                   <label>
                   A: { q.multipleChoices.A }<br />  
                   B: { q.multipleChoices.B }<br />  
                   C: { q.multipleChoices.C }<br /> 
                   D: { q.multipleChoices.D }<br /> 
                   </label>
               }
               <br />
               <br />
               </span>
           ))
           }
          <button onClick={showHideFunc}>OK</button> 
        </Modal>: null}

        <button onClick={() => navigate("/survey")}>Go Back</button>
        <h1>-- Survey Archive --</h1>

        <table>
            <tbody>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Expire Date</th>
                    <th>New Expire Date</th>
                    <th></th>
                </tr>
              { surveys?.map((s,i) => (
                <tr key={i}>
                  <td onClick={() => showSurveyInfo(s)}>{ s.title }</td>
                  <td>{ s.category }</td> 
                  <td>{ s.expireDate }</td>
                  <td><input type="date" onChange={(e) => newExpireDateFunc(e,i)}></input></td>
                  <td><button onClick={() => reuseSurvey(s,i)}>Re-use</button></td>
                </tr>
                
            
        ))}  
            </tbody>
        </table>
        
    </React.Fragment>
}

export default SurveyArchive