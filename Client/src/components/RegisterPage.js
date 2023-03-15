import React, {useState, useEffect} from 'react';
import "./RegisterPage.css";
import Navbar from './Navbar';
import Axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

export const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [invalidEmailError, setInvalidEmailError] = useState("");

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('profile')) || null);

    //posts entered info from signup form to server and database
    const submitSignUp = () => {
        // Checks if email is valid
        if (!isValidEmail(email)) {
            setInvalidEmailError("Not a valid email");
            return;
        }

        if(userType == "student" || userType == "instructor") {
            Axios.post("https://studynote.ca/api/signUp", {
                email: email,
                password: password,
                userType: userType
            }).then((response)=> {
                console.log(response);
            }).catch(error => console.log('Error: ', error.message));
        } else {
            alert("Please select a user type.");
        }
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };   

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

    const logOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
        setUser(null);
        setProfile(null);
        googleLogout();
    };
      
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className='register-title'>
                <h1>Create a StudyNote account today!</h1>
            </div>

            {profile ? (
                <div className='google-profile'>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged In</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button className='google-logout-button' onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button className='google-signin-button' onClick={() => login()}>Sign in with Google</button>
            )}


            {/* <div className = "form">
                <div className='form-box' align='center'>
                    <label>Email: </label>
                    <input

                        className='input-box'
                        type="text"
                        name="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setInvalidEmailError("")
                        }}
                    />
                    <h5 align="center" style={{color: "red"}}>{invalidEmailError}</h5>
                    <br></br>
                    <label>Password: </label>
                    <input
                        className='password-box'
                        type="password"
                        id='passwordBox'
                        name="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <input
                        type='checkbox' onChange={showPassword} className='show-password'>
                    </input>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className='user-type'>
                        
                    <label>User Type:</label>
                    </div>
                    <row>
                    <div>
                        <label for="student" className='student-type'>Student</label>
                        <input 
                            className='student-type-button'
                            type="radio"
                            name="userType"
                            id="student"
                            value="student"
                            //checked='true'
                            onChange={(e) => {
                            setUserType(e.target.value);
                            }}
                        />
                        <label for ="instructor" className='instructor-type'>Instructor</label>
                        <input
                            className='instructor-type-button'
                            type="radio"
                            name="userType"
                            id="instructor"
                            value="instructor"
                            onChange={(e) => {
                            setUserType(e.target.value);
                            }}
                        />
                    </div>
                    </row>
                    <button className='register-button' onClick={submitSignUp}>Register</button>
                </div>
            </div> */}
        </div>
    );
}

function showPassword() {
    var x = document.getElementById('passwordBox');
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

export default RegisterPage;