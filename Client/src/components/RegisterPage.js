import React, {useState} from 'react';
import "./RegisterPage.css";
import Navbar from './Navbar';

export const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");

    //posts entered info from signup form to server and database
    const submitSignUp = () => {

        // fetch POST request that should work, use as basis for future POST requests instead of axios
        fetch('http://localhost:3001/api/signUp', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
                userType: userType
            })
        }).then(function(response) {
            return response.text() //message from server
        }).then(function(data) {
            console.log(data ? JSON.parse(data) : {}) //no idea what this does
        }).catch(error => console.error('Error: ', error));
    };

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className='register-title'>
                <h1>Create a StudyNote account today!</h1>
            </div>
            <div className = "form">
                <div className='form-box' align='center'>
                    {/* EMAIL */}
                    <label>Email: </label>
                    <input

                        className='input-box'
                        type="text"
                        name="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <br></br>
                    {/* PASSWORD */}
                    <label>Password: </label>
                    <input
                        className='password-box'
                        type="password"
                        id='passwordBox'
                        name="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <input
                        type='checkbox' onChange={showPassword} className='show-password'>
                    </input>
                    <br></br>
                    <br></br>
                    <br></br>
                    {/* USERTYPE */}
                    <div className='user-type'>
                        
                    <label>User Type:</label>
                    </div>
                    <row>
                    <div>
                        <label for="student" className='student-type'>Student</label>
                        <input 
                            className='student-type-button'
                            type="radio"
                            name="userType"
                            id="student"
                            value="student"
                            //checked='true'
                            onChange={(e) => {
                            setUserType(e.target.value);
                            }}
                        />
                        <label for ="instructor" className='instructor-type'>Instructor</label>
                        <input
                            className='instructor-type-button'
                            type="radio"
                            name="userType"
                            id="instructor"
                            value="instructor"
                            onChange={(e) => {
                            setUserType(e.target.value);
                            }}
                        />
                    </div>
                    </row>
                    <button className='register-button' onClick={submitSignUp}>Register</button>
                </div>
            </div>
        </div>
    );
}

function showPassword() {
    var x = document.getElementById('passwordBox');
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

export default RegisterPage;