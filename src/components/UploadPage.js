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
    console.log("user added");
}




export default UploadPage;