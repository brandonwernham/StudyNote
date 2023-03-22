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

  const handleUserTypeSelect = (user_type) => {
    if (profile && profile.email != null && profile.id != null) {
      Axios.post("http://studynote.ca/api/signUp", {
        user_id: profile.id,
        email: profile.email,
        password: null,
        user_type: user_type
      })
        .then((response) => {
          console.log(response);
          setProfile((prevProfile) => ({ ...prevProfile, user_type }));
        })
        .catch((error) => console.log("Error: ", error.message));
    }
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
          Axios.post("http://studynote.ca/api/getUserType", {
            email: res.data.email
          })
            .then((response) => {
              if (response.data.user_type) {
                setProfile((prevProfile) => ({ ...prevProfile, user_type: response.data.user_type, user_id: response.data.user_id }));
                console.log(profile)
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

  const logOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    setUser(null);
    setProfile(null);
    googleLogout();
    window.location.reload();
  };

  return (
    <div>
      <nav className="navbar">
        <a href="/" className="title">
          StudyNote
        </a>
        <div className={`pages ${!profile || !profile.user_type ? 'disabled' : ''}`}>
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
            profile.user_type ? (
              <div className='google-profile'>
                <img className="google-image" src={profile.picture} alt="user image" />
                <button className='btn btn-logout' onClick={logOut}>Log Out</button>
              </div>
            ) : (
              <div className="overlay">
                <UserTypeSelection onSelect={handleUserTypeSelect} />
              </div>
            )
          ) : (
            <button className="btn btn-login" onClick={() => login()}>
              Log In with Google
            </button>
          )}
        </div>
      </nav>
    </div>
  );  
}
