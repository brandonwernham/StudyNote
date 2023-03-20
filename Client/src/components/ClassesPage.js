import React from 'react';
import "./ClassesPage.css";
import Navbar from './Navbar';
import { useUserContext } from "./UserContext";
import { useEffect, useState } from "react";
import Axios from 'axios';

export const ClassesPage = () => {

    const [loadCourselist, setLoadCourseList] = useState([]);
    const [searchCourseList, setSearchCourseList] = useState([]);
    
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
        const class_id = 4;
        const user_id = 1;

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
            class_id: class_id,
            user_id: user_id,
            class_name: class_name,
            course_code: course_code,
            subject_code: subject_code,

        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        }); 

    };


    const searchClass = () => {
        // Get variables
        const subject_code = document.getElementById("subject_code").value;
        const course_code = document.getElementById("course_code").value;
      
        // testing (delete later)
        console.log(subject_code);
        console.log(course_code);
      
        Axios.post("http://localhost:3001/api/searchClass", {
          course_code: course_code,
          subject_code: subject_code,
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

    /*
    

    const joinClass = () => {

        // Get variables
        const user_id = profile.user_id;
        const class_id = 
        
        
    }

    const loadClass = () => {

        const user_id = profile.user_id;

        Axios.post("http://localhost:3001/api/loadClass", {
            user_id: user_id,
        })
        .then((response) => {
            if (response.data != "No matching notes found.") {
                setLoadCourseList(response.data);
            } else {
                setLoadCourseList([]);
            }
        })
        .catch((error) => console.log("Error: ", error.message));
    }
*/

    


    return (
        <div>
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
            {loadCourselist.length > 0 ? (
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
                        {loadCourselist.map(course => (
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
                        <button type='submit' name='search' className='search-button' onClick={searchClass}>
                            Search Class
                        </button>
                        <br></br>
                    </div>
                </div>
                <br></br>
                {searchCourseList.length > 0 ? (
                    <div className='search-results'>
                        {searchCourseList.map(searchCourse => (
                        <div key={searchCourse.class_code} className='search-result'>
                            <h3>{searchCourse.class_name}</h3>
                            <p>{searchCourse.class_code}</p>
                        </div>
                        ))}
                    </div> 
                ) : (
                    <div>
                        <h1>hello</h1>
                    </div>
                )}
            </div>
            ) : (
                // Teacher Page
                <div className='container-page'>
                    <div className='header'>
                        <h1 className='classes-title'>Your Classes (Teacher): </h1>
                    </div>
                    <div className='content'>
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
                        {loadCourselist.length > 0 ? (
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
                                    {loadCourselist.map(course => (
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
                </div>
            )}

            <div className='footer' align='center'>
            </div>

        </div>
    );
}

export default ClassesPage;

/*


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

*/