import React, { useEffect, useState } from "react";
import classes from './SignUp.module.css';
import Firebase from "../store/Firebase";
import { Navigate, useNavigate } from "react-router-dom";

const SignIn = (props) => {
    const navigate = useNavigate()
    const [user,setUser] = useState({
        email: '',
        password: ''
    })
    const firebase = new Firebase()

    useEffect(() => {
        let cu
        async function fetchCU(){
            cu = await firebase.getCurrentUser()
            if(cu.userType === "admin"){
                navigate("/survey")
            }
            else if (cu.userType === "user"){
                navigate("/surveyList")
            }
            
        }

        return () =>  {fetchCU()}
        
    },[firebase, navigate])
   

    const signIn = async (e) => {
        e.preventDefault()
        
        await firebase.signIn(user.email,user.password)
        let currentU = await firebase.getCurrentUser()
        if(currentU.userType === "admin"){
            navigate("/survey")
        }
        else if(currentU.userType === "user") {
            navigate("/surveyList")
        }
        
    }

    
    const routeToSignUp = () => {
        let path = "signup"
        navigate(path)
    }

    return <React.Fragment>
        <h1 style={{ textAlign: "center"}}>Sign In</h1>
        
        <form onSubmit={signIn}>
            <table className={classes.formWidth}>
                <tbody>
                <tr>
                    
                    <td>E-mail:</td>
                    <td><input type="email" placeholder="example@outlook.com" onChange={(e) => setUser({ ...user, email: e.target.value})}></input></td>
                    
                </tr>

                <tr>
                    <td>Password:</td> 
                    <td><input type="password" placeholder="**********" onChange={(e) => setUser({ ...user, password: e.target.value})}></input></td>
                </tr>

                <tr>
                   <td><button onClick={routeToSignUp}>Sign Up</button></td>
                   <td><input type="submit" value="SignIn"></input> </td>
                </tr>
                </tbody>
            </table>
        </form>
        
    </React.Fragment>
}

export default SignIn