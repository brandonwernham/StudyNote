import { useLocation } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import "./Navbar.css";
import Axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

export default function Navbar() {
  const { pathname } = useLocation();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('profile')) || null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
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
          })
          .catch((err) => console.log(err));
      }
    },
    [ user ]
  );

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [user, profile]);

  useEffect(() => {
    if (profile && profile.email != null) {
      Axios.post("https://studynote.ca/api/signUp", {
        email: profile.email,
        password: null, // Leaving these null for now since Google is now handling password storage and such
        userType: null
      }).then((response)=> {
        console.log(response);
      }).catch(error => console.log('Error: ', error.message));
    }
  }, [profile]);

  const logOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    setUser(null);
    setProfile(null);
    googleLogout();
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
          {profile ? (
            <div className='google-profile'>
              <img className="google-image" src={profile.picture} alt="user image" />
              <button className='btn btn-logout' onClick={logOut}>Log Out</button>
            </div>
          ) : (
            <button className='btn btn-login' onClick={() => login()}>Log In with Google</button>
          )}          
        </div>
    </nav>
  );
}
