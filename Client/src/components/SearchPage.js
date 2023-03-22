import React, { useState } from "react";
import "./SearchPage.css";
import Navbar from "./Navbar";
import Axios from "axios";

export const SearchPage = () => {
  const [tags, setTags] = useState("");
  const [noteList, setNoteList] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const getNote = () => {
    const tags = document.getElementById("tags").value;
    const course_code = document.getElementById("course_code").value;
    const subject_code = document.getElementById("subject").value;
    
    setSearchPerformed(true);

    Axios.post("https://studynote.ca/api/getNote", {
      tags: tags,
      course_code: course_code,
      subject_code: subject_code,
    })
      .then((response) => {
        if (response.data != "No matching notes found.") {
          setNoteList(response.data);
        } else {
          setNoteList([]);
        }
      })
      .catch((error) => console.log("Error: ", error.message));
      
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="search-content">
        <h2 className="search-slogan-1">
          Missed a class? Struggling with certain concepts?
        </h2>
        <h3 className="search-slogan-2">StudyNote has you covered!</h3>
        <form className="search-form">
          <input
            type="text"
            placeholder='Type a "keyword" (ex: Artificial Intelligence, Biology, etc)'
            className="keyword-input"
            id="tags"
            onChange={(e) => {
              setTags(e.target.value);
            }}
          ></input>
          <input
            type="text"
            placeholder="Course Code"
            className="course-code-input"
            id="course_code"
          ></input>
          <select type="text" className="subject-dropdown" id="subject">
            <option value="" selected>
              ANY
            </option>
            <option value="chem">CHEM</option>
            <option value="compsci">COMPSCI</option>
            <option value="geog">GEOG</option>
            <option value="law">LAW</option>
            <option value="math">MATH</option>
            <option value="pathol">PATHOL</option>
            <option value="se">SE</option>
            {/* FILL IN ALL SUBJECTS, USE SHORT FORM FOR CODES, SORT ALPHABETICALLY */}
          </select>
          <button
            type="button"
            className="btn searchPage-search-button"
            onClick={getNote}
          >
            Search
          </button>
        </form>
        
        {/* section for the note result list */}
        {searchPerformed ? (
          noteList.length > 0 ? (
            <div className="note-list-wrapper">
              <div className="note-list">
                {noteList.map((note, index) => (
                  <div key={index} className="note-box">
                    <div className="note-box-bottom">
                      <div className="note-name">{note.note_name}</div>
                      <div className="note-code">{note.class_code}</div>
                      <a href={note.file_url} download={`${note.note_name}.pdf`} className="btn download-button">Download</a>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No matching notes found.</div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;