import React from 'react';
import "./HomePage.css";
import Navbar from './Navbar';

export const HomePage = () => {
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
                        <img src={require("./../images/view_classes.png")} alt="View Classes" width="400px" style={{padding: '50px'}}></img>
                        <img src={require("./../images/browse_notes.png")} alt="View Classes" width="400px" style={{padding: '50px'}}></img>
                        <img src={require("./../images/ask_question.png")} alt="View Classes" width="400px" style={{padding: '50px'}}></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;