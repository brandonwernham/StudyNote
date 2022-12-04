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
            <div className='login-form'>
                <form>
                    <input type="text" placeholder="Username" className='username' id='username'></input>
                    <br></br>
                    <input type="password" placeholder="Password" className='password' id='password'></input>
                </form>
            </div>
            <div className='form-button' align='center'>
                <button type='submit' name='login' className='login-button'>Log In</button>
                <button type='submit' name='register' className='login-button'>Register</button>
            </div>
            <br></br>
            <h6 align="center">Don't have an account? Create one today!</h6>
        </div>
    );
}

export default LoginPage;