import React from 'react';
import "./ClassesPage.css";
import Navbar from './Navbar';
import { useUserContext } from "./UserContext";
import { useEffect, useState } from "react";
import axios from 'axios';

export const ClassesPage = () => {

    const [courses, setCourses] = useState([]);
    const [coursesResults, getCourses] = useState([]);
    
    const { profile } = useUserContext();
    const [accountType, setAccountType] = useState("");

    const [className, setClassName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [courseCode, setCourseCode] = useState("");


    /*
    useEffect(() => {
        axios.get('/api/courses')
            .then(response => {
            setCourses(response.data);
        })
            .catch(error => {
            console.log(error);
        });
    }, []);
    */

    useEffect(() => {
        if (profile != null) {
            setAccountType(profile.user_type);
        }
    }, [profile]);

   



    const createClass = () => {

        // TEST VARIABLES DELETE LATER
        const classId = 1;
        const userId = 1;

        // Variables stored in database
        const formData = new FormData();
        formData.append("class_id", classId);
        formData.append("user_id", userId);
        formData.append("class_name", className);
        formData.append("subject_code", subjectCode);
        formData.append("course_code", courseCode);

        // testing (delete later)
        console.log(className);
        console.log(subjectCode);
        console.log(courseCode);

        /*
        // Axios Post to create class in database
        axios.post("http://localhost:3001/api/createClass", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);;
        });
        */
    };





    const findClass = () => {

        // Variables to look for, return all classes with matching subject and course code
        const formData = new FormData();
        formData.append("subject_code", subjectCode);
        formData.append("course_code", courseCode);

        // testing (delete later)
        console.log(subjectCode);
        console.log(courseCode);
        /*
        // Axios Post to find class in database
        axios.post("http://localhost:3001/api/findClass", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);;
        }); */
    }


    


    return (
        <div>
            <div>
                <Navbar/>
            </div>
            { accountType != "student" ? (
            // Student Page, change between == and != to test different pages
            <div className='container-page'>
            <div className='header'>
                <h1 className='classes-title'>Your Classes (Student): </h1>
            </div>
            <div className='content'>
            <div className='classes'>
            {courses.length > 0 ? (
                <table>
                    <colgroup>
                        <col width='32%' />
                        <col width='17%' />
                        <col width='14%' />
                        <col width='37%' />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>Course Name</th>
                            <th>Course Code</th>
                            <th>Subject</th>
                            <th>Professor</th>
                        </tr>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td>{course.name}</td>
                                <td>{course.code}</td>
                                <td>{course.subject}</td>
                                <td>{course.professor}</td>
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
                <div className='join-classes' align='center'>
                    <h2>Join a Class</h2>
                        <select
                            placeholder="Subject Code"
                            className="class-input"
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
                        <button type='submit' name='search' className='search-button' onClick={findClass}>Join Class</button>
                        <br></br>
                        {/* My Idea for joining a class: */}
                        {/* Student chooses subject through dropdown (Similar to Student Center, these results come from database) */}
                        {/* Student manually types in course code, these results comes from database) */}
                        {/* IF the database finds a match from both subject and the course code, the results will display as such:*/}
                            {/* 4472A SE */}
                            {/* Information Security */}
                            {/* Prof. Aleksander Essex */}
                            {/* Join Class */} 
                        {/* It will return the 4 paramters above (again, from the database), and the 'Join Class' will be ah hyperlink*/}
                        {/* ZUHAYR NOTE: */}
                        {/* still need to make it so that if there are no results, say that no class can be found. */}
                    </div>
                </div>
            </div>
            ) : (





                // Teacher Page
                <div className='container-page'>
                <div className='header'>
                    <h1 className='classes-title'>Your Classes (Teacher): </h1>
                </div>
                <div className='content'>
                <div className='classes'>
                {courses.length > 0 ? (
                    <table>
                        <colgroup>
                            <col width='32%' />
                            <col width='17%' />
                            <col width='14%' />
                            <col width='37%' />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Code</th>
                                <th>Subject</th>
                                <th>Professor</th>
                            </tr>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.name}</td>
                                    <td>{course.code}</td>
                                    <td>{course.subject}</td>
                                    <td>{course.professor}</td>
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
                                id="class_name"
                                placeholder="Class Name"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                            />
                            <select
                                placeholder="Subject Code"
                                className="class-input"
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
                            <button type='submit' name='search' className='search-button' onClick={createClass}>Create Class</button>
                            <br></br>
                        </div>
                    </div>
                </div>
            )}

            <div className='footer' align='center'>
            </div>

        </div>
    );
}

export default ClassesPage;

/*

*/