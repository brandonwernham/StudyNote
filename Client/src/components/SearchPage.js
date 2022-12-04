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
                <h2 className='search-slogan-1'>Missed a class? Struggling with certain concepts?</h2>
                <h3 className='search-slogan-2'>StudyNote has you covered!</h3>
                <form className='search-form'>
                <input type="text" placeholder="Find A Note..." className='searchbar' id='theInput'></input>
                <button className='search-button' onClick={SearchNotes}>Search</button>
                </form>
            </div>
        </div>
    );
}

function SearchNotes() {
    var userInput = document.getElementById("theInput").value;
    
    // we need to search the note title and note tags to get accurate results

    // define some list to store the results (notes) in

    // search the db for if any note title contains our userInput or part of our userInput

    // search the db for if any note tags contains our userInput or part of our userInput

    // if yes to the past two queries, then add that note to the list

    // display the list
}

export default SearchPage;