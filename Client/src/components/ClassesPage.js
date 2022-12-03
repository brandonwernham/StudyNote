import React from 'react';
import "./ClassesPage.css";
import Navbar from './Navbar';

export const ClassesPage = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <h1 className='classes-title'>Classes</h1>
            </div>
        </div>
    );
}

export default ClassesPage;