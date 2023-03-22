import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './GroupsPage.css';
import Navbar from './Navbar';
import { useUserContext } from "./UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const GroupsTestPage = () => {
    const [dbData, setdbData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [usersToAdd, setUsersToAdd] = useState([]);
    const [emailInput, setEmailInput] = useState('');
    const { profile } = useUserContext();
    const [accountID, setAccountID] = useState("");

    /*useEffect(() => {
        // Function to search for registered emails
        const searchEmails = async () => {
            if (emailInput.length > 2) {
                try {
                    const response = await Axios.get(`http://localhost:3001/api/searchEmails?email=${emailInput}`);
                    setUsersToAdd(response.data);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        searchEmails();
    }, [emailInput]);*/

    useEffect(() => {
        if (profile != null) {
            setAccountID(profile.user_id);
        }
    }, [profile]);

    const class_type = "group";

    const createClass = () => {

        // PREVIOUS: TEST VARIABLES DELETE LATER
        // CURRENT: is it?
        const user_id = accountID;

        // Get variables
        const class_name = document.getElementById("groupName").value;
        const subject_code = "";
        const course_code = document.getElementById("groupName").value; 

        // testing (delete later)
        console.log(class_name);
        console.log(course_code);
        console.log(subject_code);
        console.log(user_id);
        console.log(class_type);
    
        // Axios Post to create class in database
        Axios.post("http://localhost:3001/api/createClass", {
            class_name: class_name,
            course_code: course_code,
            subject_code: subject_code,
            user_id: user_id,
            class_type: class_type
        }).then((res) => {
            console.log(res);
            const class_id = res.data.data[0].insertId;

            Axios.post("http://localhost:3001/api/joinClass", {
                class_id: class_id,
                user_id: accountID,
            })
            .then((response) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            }); 
        }).catch((err) => {
            console.log(err);
        }); 
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        createClass();
    };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <h1 className="groups-title">Groups</h1>
      </div>
      <div className="groups-content">
        <div className="groups-side-bar">
          <div className="groups-row">
            <button className="btn btn-groups-row" onClick={() => setShowForm(!showForm)}>
              <i className="groups-plus-icon">
                <FontAwesomeIcon icon={faPlus} />
              </i>
              Create StudyGroup
            </button>
          </div>
          {/* Other group rows */}
        </div>
        <div className="groups-group-container">
          {showForm ? (
            <form onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="groupName">Group Name:</label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="usersToAdd">Users to Add:</label>
                <input
                  type="email"
                  id="usersToAdd"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
                {usersToAdd.length > 0 && (
                  <ul>
                    {usersToAdd.map((user) => (
                      <li key={user.email}>{user.email}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit">Create</button>
            </form>
          ) : (
            <div>This is where each group will display</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsTestPage;