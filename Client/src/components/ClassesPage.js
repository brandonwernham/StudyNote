import React from 'react';
import "./ClassesPage.css";
import Navbar from './Navbar';

export const ClassesPage = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className='container-page'>
                <div className='header'>
                    <h1 className='classes-title'>Your Classes</h1>
                </div>
                <div className='content'>
                    <div className='classes'>
                        <table>
                            <colgroup>
                                <col width='32%'></col>
                                <col width='17%'></col>
                                <col width='14%'></col>
                                <col width='37%'></col>
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Course Code</th>
                                    <th>Subject</th>
                                    <th>Professor</th>
                                </tr>
                                <tr>
                                    <td>Space Exploration</td>
                                    <td>2090</td>
                                    <td>GEOG</td>
                                    <td>Dr. Danny Bednar</td>
                                </tr>
                                <tr>
                                    <td>Artificial Intelligence 1</td>
                                    <td>3346</td>
                                    <td>COMPSCI</td>
                                    <td>Dr. Charles Ling</td>
                                </tr>
                                <tr>
                                    <td>Software Engineering Design</td>
                                    <td>4450</td>
                                    <td>SE</td>
                                    <td>Prof. Luiz Fernando Capretz</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='join-classes' align='center'>
                        <h2>Join A Class</h2>
                        <input type="text" placeholder="Choose a Subject" className='class-input' id='subject'></input>
                        <input type="text" placeholder="Course Code" className='class-input' id='code'></input>
                        <button type='submit' name='search' className='search-button'>Search</button>
                        <h6>Can't see your class?</h6>
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
                    </div>
                </div>
            </div>
            <div className='footer' align='center'>
            </div>
        </div>
    );
}

export default ClassesPage;