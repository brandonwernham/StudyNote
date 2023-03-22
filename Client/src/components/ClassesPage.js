import React from 'react';
import "./ClassesPage.css";
import Navbar from './Navbar';
import { useUserContext } from "./UserContext";
import { useEffect, useState } from "react";
import Axios from 'axios';

export const ClassesPage = () => {

    const [searched, setSearched] = useState(false);
    const [loadCourseListStudent, setLoadCourseListStudent] = useState([]);
    const [loadCourselistTeacher, setLoadCourseListTeacher] = useState([]);
    const [searchCourseList, setSearchCourseList] = useState([]);
    
    const { profile } = useUserContext();
    const [accountType, setAccountType] = useState("");
    const [accountID, setAccountID] = useState("");

    const [className, setClassName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [courseCode, setCourseCode] = useState("");


    useEffect(() => {
        if (profile != null) {
            setAccountType(profile.user_type);
            setAccountID(profile.user_id);
        }
    }, [profile]);

    // for classes page (only this page)
    const class_type = "class";

// CREATE CLASSES
    const createClass = () => {

        // PREVIOUS: TEST VARIABLES DELETE LATER
        // CURRENT: is it?
        const user_id = accountID;

        // Get variables
        const class_name = document.getElementById("create_class_name").value;
        const subject_code = document.getElementById("create_subject_code").value;
        const course_code = document.getElementById("create_course_code").value; 

        // testing (delete later)
        console.log(className);
        console.log(subjectCode);
        console.log(courseCode);
        
        // Axios Post to create class in database
        Axios.post("http://localhost:3001/api/createClass", {
            class_name: class_name,
            course_code: course_code,
            subject_code: subject_code,
            user_id: user_id,
            class_type: class_type
        }).then((res) => {
            console.log(res);
            window.location.reload(); // Refresh the page
        }).catch((err) => {
            console.log(err);
        }); 

    };

// SEARCH FOR CLASSES 
    const searchClass = () => {
        // Get variables
        const subject_code = document.getElementById("subject_code").value;
        const course_code = document.getElementById("course_code").value;
        setSearched(true);
      
        // testing (delete later)
        console.log(subject_code);
        console.log(course_code);
      
        Axios.post("http://localhost:3001/api/searchClass", {
          course_code: course_code,
          subject_code: subject_code,
          class_type: class_type
        })
        .then((response) => {
          if (response.data != "No classes found.") {
            setSearchCourseList(response.data);
          } else {
            setSearchCourseList([]);
          }
        })
        .catch((error) => console.log("Error: ", error.message));

      };

// JOIN CLASSES
    function joinClass(classID) {

        const class_id = classID;
        
        Axios.post("http://localhost:3001/api/joinClass", {
            class_id: class_id,
            user_id: accountID,
        })
        .then((response) => {
            if (response.data != "No classes found.") {
                setSearchCourseList(response.data);
            } else {
                setSearchCourseList([]);
            }
            window.location.reload(); // Refresh the page
        })
        .catch((error) => console.log("Error: ", error.message));

        }

    // DROP CLASSES
    function dropClass(classID) {

        const class_id = classID;
        
        Axios.post("http://localhost:3001/api/dropClass", {
            class_id: class_id,
            user_id: accountID,
        })
        .then((response) => {
            window.location.reload(); // Refresh the page
        })
        .catch((error) => console.log("Error: ", error.message));

    }

    // DELETE CLASSES
    function deleteClass(classID) {

        const class_id = classID;
        
        Axios.post("http://localhost:3001/api/deleteClass", {
            class_id: class_id,
        })
        .then((response) => {
            window.location.reload(); // Refresh the page
        })
        .catch((error) => console.log("Error: ", error.message));

    }

    
// LOAD CLASSES
    const loadClassesStudent = () => {

        const user_id = accountID;

        Axios.post("http://localhost:3001/api/loadClassesStudent", {
            user_id: user_id,
          })
          .then((response) => {
            if (response.data != "No classes found.") {
                setLoadCourseListStudent(response.data);
            } else {
                setLoadCourseListStudent([]);
            }
          })
          .catch((error) => console.log("Error: ", error.message));
    }

    const loadClassesTeacher = () => {

        const user_id = accountID;

        Axios.post("http://localhost:3001/api/loadClassesTeacher", {
            user_id: user_id,
          })
          .then((response) => {
            if (response.data != "No classes found.") {
                setLoadCourseListTeacher(response.data);
            } else {
                setLoadCourseListTeacher([]);
            }
          })
          .catch((error) => console.log("Error: ", error.message));
    }

    function loadAllClasses() {
        loadClassesStudent();
        loadClassesTeacher();
    }

    
    const [noteList, setNoteList] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    function loadNotesForClass(classCode){
        setSearchPerformed(true);

        Axios.post("http://localhost:3001/api/getNote", {
            isCC: true,
            class_code: classCode,
            tags: ""
          })
          .then((response) => {
            console.log(response)
            if (response.data != "No matching notes found.") {
                setNoteList(response.data);
            } else {
                setNoteList([]);
            }
          })
          .catch((error) => console.log("Error: ", error.message));
    }

    function handleDownloadClick(note) {
        const downloadLink = document.createElement('a');
        downloadLink.href = note.file_url;
        downloadLink.download = note.note_name;
        downloadLink.target = '_blank';
        downloadLink.className = 'btn download-button';
        downloadLink.innerHTML = 'Download';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

    return (
        <div onLoad={loadAllClasses}>
            <div>
                <Navbar/>
            </div>
            { accountType == "student" ? (
            // Student Page, change between == and != to test different pages
            <div className='container-page'>
                <div className='header'>
                    <h1 className='classes-title'>Your Classes (Student): </h1>
                </div>
            <div className='content'>
                <div className='classes'>
            {loadCourseListStudent.length > 0 ? (
                <table>
                    <colgroup>
                        <col width='18%' />
                        <col width='28%' />
                        <col width='49%' />
                        <col width='5%' />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Class Code</th>
                            <th>Class Name</th>
                            <th>Professor</th>
                            <th></th>
                        </tr>
                        {loadCourseListStudent.map(course => (
                            <tr key={course.user_id}>
                                <td onClick={() => loadNotesForClass(course.class_code)}>{course.class_code}</td>
                                <td onClick={() => loadNotesForClass(course.class_code)}>{course.class_name}</td>
                                <td>{course.user_name}</td>
                                <td><button onClick={() => dropClass(course.class_id)}>Drop</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className='no-classes'>
                    <p>You have no classes yet, join a class now!</p>
                </div>
            )}
            </div>
                <div className='create-classes' align='center'>
                    <h2>Join a Class</h2>
                        <select
                            placeholder="Subject Code"
                            className="class-dropdown"
                            id="subject_code"
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}>

                            <option value="">Select Subject Code</option>
                            <option value="CHEM">CHEM</option>
                            <option value="COMPSCI">COMPSCI</option>
                            <option value="GEOG">GEOG</option>
                            <option value="LAW">LAW</option>
                            <option value="MATH">MATH</option>
                            <option value="PATHOL">PATHOL</option>
                            <option value="SE">SE</option>
                        </select>
                        <input
                            className="class-input"
                            type="text"
                            id="course_code"
                            placeholder="Course Code"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                        />
                        <button type='submit' name='search' className='btn btn-create-class' onClick={searchClass}>
                            Search Class
                        </button>
                        <br></br>
                    </div>
                </div>
                <br></br>
                {searched && searchCourseList.length > 0 ? (
                <div className='search-results'>
                    {searchCourseList.map(searchCourse => (
                        <div key={searchCourse.class_id} className='search-result'>
                            <p>{searchCourse.class_name}</p>
                            <p>{searchCourse.class_code}</p>
                            <button type="submit" name='join-class' className='btn btn-create-class' onClick={() => joinClass(searchCourse.class_id)}>Join</button>
                        </div>
                    ))}
                </div> 
                ) : (searched && searchCourseList.length <= 0) ? (
                    <div>
                        <h1>No classes found.</h1>
                    </div>
                ) : !searched ? (
                    <div>
                    </div>
                ) : (
                    <div>
                    </div>
                )}
            </div>
            ) : accountType == "teacher" ? (
                // Teacher Page
                <div className='container-page'>
                    <div className='header'>
                        <h1 className='classes-title'>Your Classes (Teacher): </h1>
                    </div>
                    <div className='content'>
                        <div className='classes'>
                            {loadCourselistTeacher.length > 0 ? (
                                <table>
                                    <colgroup>
                                        <col width='18%' />
                                        <col width='28%' />
                                        <col width='49%' />
                                        <col width='5%' />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>Class Code</th>
                                            <th>Class Name</th>
                                            <th>Professor Name</th>
                                            <th></th>
                                        </tr>
                                        {loadCourselistTeacher.map(course => (
                                            <tr key={course.user_id}>
                                                <td onClick={() => loadNotesForClass(course.class_code)}>{course.class_code}</td>
                                                <td onClick={() => loadNotesForClass(course.class_code)}>{course.class_name}</td>
                                                <td>{course.user_name}</td>
                                                <td><button onClick={() => deleteClass(course.class_id)}>Delete</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className='no-classes'>
                                    <p>You have no classes yet, create a class now!</p>
                                </div>
                            )}
                        </div>
                        <div className='create-classes' align='center'>
                            <h2>Create a Class</h2>
                            <input
                                className="class-input"
                                type="text"
                                id="create_class_name"
                                placeholder="Class Name"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                            />
                            <select
                                placeholder="Subject Code"
                                className="class-dropdown"
                                id="create_subject_code"
                                value={subjectCode}
                                onChange={(e) => setSubjectCode(e.target.value)}>

                                <option value="">Select Subject Code</option>
                                <option value="CHEM">CHEM</option>
                                <option value="COMPSCI">COMPSCI</option>
                                <option value="GEOG">GEOG</option>
                                <option value="LAW">LAW</option>
                                <option value="MATH">MATH</option>
                                <option value="PATHOL">PATHOL</option>
                                <option value="SE">SE</option>
                            </select>
                            <input
                                className="class-input"
                                type="text"
                                id="create_course_code"
                                placeholder="Course Code"
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                            />
                            <button type='submit' name='search' className='btn btn-create-class' onClick={createClass}>
                                Create Class
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Not logged in</h1>
                </div>
            )}
            

            {searchPerformed ? (
            noteList.length > 0 ? (
                <div className="note-list-wrapper">
                <div className="note-list">
                    {noteList.map((note, index) => (
                    <div key={index} className="note-box" onClick={() => handleDownloadClick(note)}>
                        <div className="note-box-bottom">
                        <div className="note-name">{note.note_name}</div>
                        <div className="note-code">{note.class_code}</div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            ) : (
                <div>No matching notes found.</div>
            )
            ) : null}

            <div className='footer' align='center'>
            </div>

        </div>
    );
}

export default ClassesPage;