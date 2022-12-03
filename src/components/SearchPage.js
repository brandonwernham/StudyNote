import React from 'react';
import "./SearchPage.css";
import Navbar from './Navbar';

export const SearchPage = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <h1 className='search-title'>Search</h1>
            </div>
        </div>
    );
}

export default SearchPage;