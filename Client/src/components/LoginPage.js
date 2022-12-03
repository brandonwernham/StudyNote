import React from 'react';
import "./LoginPage.css";
import Navbar from './Navbar';

export const LoginPage = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <h1 className='login-title'>Login Page</h1>
            <br></br>
            <br></br>
            <br></br>
            <div className='login-form' align='center'>
                <form>
                    <label for="username">Username: </label>
                    <input type="text" id="username" name="username"></input>
                    <br></br>
                    <br></br>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password"></input>
                </form>
            </div>
            <br></br>
            <br></br>
            <div className='form-button' align='center'>
                <button type='submit' name='login'>Log In</button>
                <button type='submit' name='register'>Register</button>
            </div>
        </div>
    );
}

export default LoginPage;