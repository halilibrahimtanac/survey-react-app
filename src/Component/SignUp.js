import React, { useEffect, useState } from "react";
import classes from './SignUp.module.css'
import Firebase from "../store/Firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        usertype: 'user'
    })
    const navigate = useNavigate()

    useEffect(() => {
        const firebase = new Firebase()
        async function getCU(){
            let cu = await firebase.getCurrentUser()
            if(cu){
                navigate("survey")
            }
        }

        getCU()
        
    },[navigate])

    const userRegister = (e) => {
        e.preventDefault()
        const firebase = new Firebase()
        if(user.name !== "" && user.email !== "" && user.password !== ""){
            firebase.signUp(user.name,user.email,user.password,user.usertype)
            navigate("/")
        }
        else {
            alert("Don't left empty area")
        }
        
    }

    const signInNav = () => {
        navigate("/")
    }

    return <React.Fragment>
        <h1 style={{ textAlign: "center"}}>Sign Up</h1>
        <form>
        <table className={classes.formWidth}>
            <tbody>
            <tr>
                <td>User Type: </td>
                <td><label>User</label><input type="radio" name="userType" value="User" onChange={() => setUser({...user, usertype: 'user'})}></input></td>
                <td><label>Admin</label><input type="radio" name="userType" value="Admin" onChange={() => setUser({...user, usertype: 'admin'})}></input></td>
            </tr>
            </tbody>
        </table>
        </form>
        
        <form onSubmit={userRegister}>
            <table className={classes.formWidth}>
                <tbody>
                <tr>
                   <td>{user.usertype === "user" ? "Username:" : "Admin name:"}</td>
                    <td><input type="text" placeholder="name_123" onChange={(e) => setUser({ ...user, name: e.target.value})}></input></td>
                </tr>
                
                <tr>
                    
                    <td>E-mail:</td>
                    <td><input type="email" placeholder="example@outlook.com" onChange={(e) => setUser({ ...user, email: e.target.value})}></input></td>
                    
                </tr>

                <tr>
                    <td>Password:</td> 
                    <td><input type="password" placeholder="**********" onChange={(e) => setUser({ ...user, password: e.target.value})}></input></td>
                </tr>

                <tr>
                   <td><button onClick={signInNav}>Sign In</button></td>
                   <td><input type="submit" value="SignUp"></input> </td>
                </tr>
                </tbody>
            </table>
            
        </form>
    </React.Fragment>
}

export default SignUp