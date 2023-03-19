import { useLocation } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import "./Navbar.css";
import Axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useUserContext } from "./UserContext";
import UserTypeSelection from './UserTypeSelection';

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, setUser, profile, setProfile } = useUserContext();
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleUserTypeSelect = (user_type) => {
    setSelectedUserType(user_type);
    login();
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    if (user) {
      Axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile(res.data);
          Axios.get(`http://localhost:3001/api/getUserType/${res.data.id}`)
            .then((response) => {
              if (response.data.user_type) {
                setSelectedUserType(response.data.user_type);
              }
            })
            .catch((error) => console.log('Error fetching user type:', error.message));
        })
        .catch((err) => console.log(err));
    }
  }, [user]);  

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [user, profile]);

  useEffect(() => {
    if (profile && profile.email != null && profile.id != null && selectedUserType != null) {
      Axios.post("http://localhost:3001/api/signUp", {
        user_id: profile.id, // VARCHAR(255) is the only type that works with this it seems
        email: profile.email,
        password: null, // Leaving this null for now since Google is now handling password storage and such
        user_type: selectedUserType
      }).then((response)=> {
        console.log(response);
      }).catch(error => console.log('Error: ', error.message));
    }
  }, [profile, selectedUserType]);

  const logOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    setUser(null);
    setProfile(null);
    googleLogout();
    window.location.reload();
  };

  return (
    <nav className="navbar">
        <a href="/" className="title">
            StudyNote
        </a>
        <div className="pages">
            <a href="/search" className={pathname === "/search" ? "active" : ""}>
            Search
            </a>
            <a href="/classes" className={pathname === "/classes" ? "active" : ""}>
            Classes
            </a>
            <a href="/groups" className={pathname === "/groups" ? "active" : ""}>
            Groups
            </a>
            <a href="/upload" className={pathname === "/upload" ? "active" : ""}>
            Upload
            </a>
        </div>

        <div className="login">
          {user && profile ? (
            <div className='google-profile'>
              <img className="google-image" src={profile.picture} alt="user image" />
              <button className='btn btn-logout' onClick={logOut}>Log Out</button>
            </div>
          ) : selectedUserType ? (
            <button className='btn btn-login' onClick={() => login()}>Log In with Google as {selectedUserType}</button>
          ) : (
            !user && <UserTypeSelection onSelect={handleUserTypeSelect} />
          )}       
        </div>
    </nav>
  );
}
