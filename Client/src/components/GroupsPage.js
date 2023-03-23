import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './GroupsPage.css';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const GroupsPage = () => {
  const [dbData, setdbData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    // Function to search for registered emails
    const searchEmails = async () => {
      if (emailInput.length > 2) {
        try {
            const response = await Axios.get(`https://studynote.ca/api/searchEmails?email=${emailInput}`);
            setUsersToAdd(response.data);
        } catch (error) {
            console.error(error);
        }
      }
    };

    searchEmails();
  }, [emailInput]);

  const createStudyGroup = async () => {
    try {
      const response = await Axios.post('https://studynote.ca/api/CreateGroup', { groupName, usersToAdd });
      console.log(response);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    createStudyGroup();
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

export default GroupsPage;