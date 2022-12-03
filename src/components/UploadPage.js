import React from 'react';
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
        </div>
    );
}

export default UploadPage;