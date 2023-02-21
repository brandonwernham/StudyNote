import React, {useState} from 'react';
import Axios from 'axios';
import "./LoginPage.css";
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const [invalidEmailError, setInvalidEmailError] = useState("");

    //posts entered info from signup form to server and database
    const submitLogin = () => {
        // Checks if email is valid
        if (!isValidEmail(email)) {
            setInvalidEmailError("Not a valid email");
            return;
        }
        Axios.post("https://studynote.ca/api/login", {
            email: email,
            password: password,
        }).then((response)=> {
            if (response.data.message){
                setLoginStatus(response.data.message)
                console.log(response.data.message)
            }
            else{
                navigate("/");
            }
        })
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };    
    
    const redirRegister = () => {
        navigate("/register")
    }
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <h1 className='login-title'>Login Page</h1>
            <br></br>
            <div className='login-form'>
                <form>
                    <input type="text" placeholder="Email" className='username' id='username' onChange={(e) => {setEmail(e.target.value); setInvalidEmailError("")}}></input>
                    <br></br>
                    <input type="password" placeholder="Password" className='password' id='password' onChange={(e) => {setPassword(e.target.value)}}></input>
                </form>
            </div>
            <h5 align="center">{loginStatus}</h5>
            <h5 align="center" style={{color: "red"}}>{invalidEmailError}</h5>

            <div className='form-button' align='center'>
                <button type='submit' name='login' className='login-button' onClick={submitLogin}>Log In</button>
                <button name='register' className='login-button' onClick={redirRegister}>Register</button>
            </div>
            <br></br>
            <h6 align="center">Don't have an account? Create one today!</h6>
        </div>
    );
}

export default LoginPage;