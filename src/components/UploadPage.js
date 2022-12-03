import React from 'react';
import "./UploadPage.css";
import Navbar from './Navbar';
import database from '../database/dbConfig';


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
    //database.query("INSERT INTO UserInfo (User_ID, Username, UserPassword) VALUES (2, FTM, FTMPassword)");
    console.log("user added");
}




export default UploadPage;