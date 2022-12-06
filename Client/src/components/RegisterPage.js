import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import "./RegisterPage.css";
import Navbar from './Navbar';

export const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");

    //posts entered info from signup form to server and database
    const submitSignUp = () => {
        Axios.post("http://127.0.0.1:3001/api/signUp", {
            email: email,
            password: password,
            userType: userType
        }).then(()=> {
            console.log("user successfully registered")
        })
    };

    //gets if user info exists in userbase


    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
               <h1 className='register-title'>Register</h1> 
            </div>
            <div className = "form">
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        name="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <label>User Type:</label>
                    <div>
                        <label for="student">Student</label>
                        <input
                            type="radio"
                            name="userType"
                            id="student"
                            value="student"
                            onChange={(e) => {
                            setUserType(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label for ="instructor">Instructor</label>
                        <input
                            type="radio"
                            name="userType"
                            id="instructor"
                            value="instructor"
                            onChange={(e) => {
                            setUserType(e.target.value);
                            }}
                        />
                    </div>
                    <button onClick={submitSignUp}>Register</button>
                </div>

            </div>
        </div>
    );
}





export default RegisterPage;