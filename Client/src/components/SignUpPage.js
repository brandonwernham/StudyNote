import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import "./SignUpPage.css";
import Navbar from './Navbar';

export const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");

    const submitSignUp = () => {
        Axios.post("http://localhost:3001/api/signUp", {
            email: email,
            password: password,
            userType: userType
        }).then(()=> {console.log("user successfully signed up")})
    };

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
               <h1 className='signup-title'>Sign Up</h1> 
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
                    <button onClick={submitSignUp}>Sign Up</button>
                </div>

            </div>
        </div>
    );
}





export default SignUpPage;