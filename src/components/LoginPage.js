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
            <div className='login-form'>
                <form>
                    <label for="username">Username: </label>
                    <input type="text" id="username" name="username"></input>
                    <br></br>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password"></input>
                    <br></br>
                    <br></br>
                    <input type="submit" value="Submit"></input>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <input type="submit" value="Register"></input>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;