import React from 'react';
import Axios from 'axios';
import "./UploadPage.css";
import Navbar from './Navbar';



export const UploadPage = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
               <h1 className='upload-title'>Upload A File</h1> 
            </div>
            <div>
                <button onClick = {addTestUser}>Add Test User</button>
            </div>
        </div>
    );
}

//test button
function addTestUser(){
    Axios.post("http://localhost:3001/api/insert", {
        User_ID: 2, 
        Username: "FTM",
        UserPassword: "FTMPassword"
    }).then(() => {
        console.log("success")
    })
}




export default UploadPage;