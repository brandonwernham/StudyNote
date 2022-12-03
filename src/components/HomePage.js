import React from 'react';
import "../App.css";
import Navbar from './Navbar';

export const HomePage = () => {
    return (
        <div>
            <Navbar />
            <br></br>
            <br></br>
            <div align="center">
                <h2>Welcome back, PLACEHOLDER!</h2>
                <h4>What would you like to accomplish?</h4>
                <br></br>
            </div>
            <div class="row" align="center">
                <div>
                    <img src={require("./../images/view_classes.png")} alt="View Classes" width="400px" style={{padding: '50px'}}></img>
                    <img src={require("./../images/browse_notes.png")} alt="View Classes" width="400px" style={{padding: '50px'}}></img>
                    <img src={require("./../images/ask_question.png")} alt="View Classes" width="400px" style={{padding: '50px'}}></img>
                </div>
            </div>
        </div>
    );
}

export default HomePage;