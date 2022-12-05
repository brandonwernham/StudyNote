import React from 'react';
import Axios from 'axios';
import "./UploadPage.css";
import Navbar from './Navbar';
import { useState } from 'react';
import FileUpload from './FileUpload';
import FileList from './FileList';

export const UploadPage = () => {
    const [files, setFiles] = useState([]);

    const removeFile = (filename) => {
        setFiles(files.filter(file => file.name !== filename));
    }

    console.log(files);

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
            <div className="file-upload">
                <FileUpload files={files} setFiles={setFiles} removeFile={removeFile}/>
            </div>
            <div className='file-list-box'>
                <FileList files={files} removeFile={removeFile} />
            </div>
        </div>
    );
}

//test button
function addTestUser(){
    Axios.post("http://localhost:3001/api/insert", {
        Email: "testuser2@gmail.com",
        UserPassword: "testuser2password"
    }).then(() => {
        console.log("success")
    })
}




export default UploadPage;