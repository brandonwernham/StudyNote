import React from 'react';
import "../App.css";
import Navbar from './Navbar';

export const LoginPage = () => {
    return (
        <div>
            <Navbar />
            <h1>Login Page</h1>
            <br></br>
            <br></br>
            <br></br>
            <div align="center">
                <div>
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
        </div>
    );
}

export default LoginPage;