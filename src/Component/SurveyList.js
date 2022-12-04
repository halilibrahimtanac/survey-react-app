import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Firebase from "../store/Firebase";
import { SurveyContext } from "../store/survey-context";


const SurveyList = (props) => {
    const fire = new Firebase()
    const surveyCtx = useContext(SurveyContext)
    const navigate = useNavigate()
    const [surveyList, setSurveyList] = useState([])
    const [surveyYear, setSurveyYear] = useState([])
    const [filteredSurveys, setFilteredSurveys] = useState([])
    const [category, setCategory] = useState(surveyCtx.categories[0])
    const [year, setYear] = useState("")
    const [user, setUser] = useState({})

    const signOut = async () => {
        await fire.signOut() 
        navigate("/")
    }

     useEffect(()=>{

        async function getInfos(){
            let surveys = await fire.getsurveys()
            setSurveyList(surveys)
            let arr = []
            surveys.map((s) => 
                {
                    let year = s.year.slice(0,4)
                    arr = [...arr, year]
                }
            )
            setSurveyYear(arr.filter((item, position,self) => self.indexOf(item) === position))
            let user = await fire.getCurrentUser()
            setUser(user)
        }

        return () => { getInfos() }

    },[]) 

    const filterSurvey = (category) => {
        setFilteredSurveys(surveyList.filter((x) => x.category === category))
        setCategory(category)
    }

    const filterYear = (year) => {
        setYear(year)
    }

    const goToSurvey = (survey) => {
        navigate("/question",{state: survey})
    }

    return <React.Fragment>
        <label>UserName: <strong>{ user.userName }</strong></label>
        <button style={{ marginTop: "20px", marginLeft: "20px"}} onClick={signOut}>Log out</button>

        <h1>Survey List</h1>
                <ul style={style.inlineBlockStyle}>
                    {
                        surveyCtx.categories.map((c,i) => (
                           <li><h3 style={category !== c ? { color: "gray"} : null} onClick={() => filterSurvey(c)}>{c}</h3></li>
                           
                        ))
                    }
                </ul>
                
        

        <div style={{ display: "inline-block", marginLeft: "400px", position: "absolute"}}>

            { surveyYear.map((y) => <h5 style={year !== y ? { color: "gray", display: "inline-block", marginRight: "10px"} : {display: "inline-block", marginRight: "10px"}} onClick={() => filterYear(y)}>{y}</h5>)}

        <br />

        {
            filteredSurveys.length > 0 ? filteredSurveys?.map((s,i) =>(
                year === s.year.slice(0,4) ? <button key={i} style={{ padding: "5px", display: "inline-block", marginBottom: "5px", borderWidth: "0px", marginRight: "10px" }} onClick={() => goToSurvey(s)}>{s.title}</button> : null
            )) :
            <h3>There is no survey in this category...</h3>
        }


        </div>
            
        
    </React.Fragment>
}

const style = {
    inlineBlockStyle: {
        display: "inline-block",
        marginRight: "10px"
    }
}

export default SurveyList