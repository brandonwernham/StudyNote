import React, {useState} from 'react';
import "./SearchPage.css";
import Navbar from './Navbar';
import Axios from 'axios';

export const SearchPage = () => {
    const [tags, setTags] = useState("");
    const [imageURL, setImageUrl] = useState("http://localhost:3001/notes/placeholder.jpg");

    //redirects to page with first note in database
    const getNote = () => {
        Axios.post("http://localhost:3001/api/getNote", {
            tags: tags
        }).then((response)=> {
            setImageUrl("http://localhost:3001/" + response.data);
        }).catch(error => console.log('Error: ', error.message));
        
        
        
    };

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
                <input type="text" placeholder='Type a "keyword" (ex: Artificial Intelligence, Biology, etc)' className='keyword-input' id='keyword' onChange={(e) => {setTags(e.target.value)}}></input>
                <input type="text" placeholder="Course Code" className='course-code-input' id='course-code'></input>
                <select type='text' className='subject-dropdown' id='subject'>
                    <option value="" disabled selected hidden>Subject</option>
                    <option value="chem">CHEM</option>
                    <option value="compsci">COMPSCI</option>
                    <option value="geog">GEOG</option>
                    <option value="law">LAW</option>
                    <option value="math">MATH</option>
                    <option value="pathol">PATHOL</option>
                    <option value="se">SE</option>
                    {/* FILL IN ALL SUBJECTS, USE SHORT FORM FOR CODES, SORT ALPHABETICALLY */}
                </select>
                <button type ="button" className='searchPage-search-button' onClick={getNote}>Search</button>
                </form>
                <img src ={imageURL} style = {{width: 500, height: 500}}></img>
            </div>
        </div>
    );
}

function SearchNotes() {
    // GET KEYWORDS FROM THE BIG LINE
    // BREAK THEIR ENTRIES INTO INDIVIDUAL WORDS
    // SEARCH WORDS AND BRING UP ANY MATCHES

    // GET COURSE CODE FROM THE SECOND INPUT BOX
    // SEARCH COURSE CODE AND BRING UP ANY MATCHES
    
    // GET SUBJECT FROM DROP DOWN BOX
    // SEARCH SUBJECT AND BRING UP ANY MATCHES

    // IF MULTIPLE INPUTS ARE USED, SHOW RESULTS WHICH CONTAIN ALL 3






    // outdated but still useful below

    
    var userInput = document.getElementById("keyword").value;
    
    // we need to search the note title and note tags to get accurate results

    // define some list to store the results (notes) in

    // search the db for if any note title contains our userInput or part of our userInput

    // search the db for if any note tags contains our userInput or part of our userInput

    // if yes to the past two queries, then add that note to the list

    // display the list
}

export default SearchPage;