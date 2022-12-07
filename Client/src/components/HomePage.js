import React, { useEffect } from 'react';
import "./HomePage.css";
import Navbar from './Navbar';
import Axios from 'axios';


export const HomePage = () => {

    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get("https://studynote.ca/api/login").then((response) => {
            console.log(response);
        })
    }, []);

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <br></br>
                <br></br>
                <div>
                    <h2 className='welcome-text'>Welcome back, PLACEHOLDER!</h2>
                    <h4 className='accomplish-text'>What would you like to accomplish?</h4>
                    <br></br>
                </div>
                <div className='row'>
                    <div>
                        <button className='view-classes-button'>
                            <img src={require("./../images/view_classes.png")} 
                            alt="View Classes" className='view-classes-image'>
                            </img> 
                        </button>
                        <button className='browse-notes-button'>
                            <img src={require("./../images/browse_notes.png")} 
                            alt="View Classes" className='browse-notes-image'>
                            </img>
                        </button>
                        <button className='ask-question-button'>
                            <img src={require("./../images/ask_question.png")} 
                            alt="View Classes" className='ask-question-image'>
                            </img>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;