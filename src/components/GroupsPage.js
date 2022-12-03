import React from 'react';
import "./GroupsPage.css";
import Navbar from './Navbar';

export const GroupsPage = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <h1 className='groups-title'>Groups</h1>
            </div>
        </div>
    );
}

export default GroupsPage;