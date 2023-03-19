import React, { useEffect, useState } from "react";
import "./HomePage.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useUserContext } from "./UserContext";

export const HomePage = () => {
    const { profile } = useUserContext();
    const [accountName, setAccountName] = useState("");

    useEffect(() => {
        if (profile != null) {
            setAccountName(profile.name);
        }
    }, [profile]);

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <br></br>
                <br></br>
                <div>
                    <h2 className="welcome-text">
                        Welcome back{accountName ? ", " + accountName : ""}!
                    </h2>
                    <h4 className="accomplish-text">What would you like to accomplish?</h4>
                    <br></br>
                </div>
                <div className="row">
                    <div>
                        <Link className="btn btn-task" to="/classes">
                            <img
                                src={require("./../images/view_classes.png")}
                                alt="View Classes"
                                className="task-image"
                            ></img>
                        </Link>
                        <Link className="btn btn-task" to="/search">
                            <img
                                src={require("./../images/browse_notes.png")}
                                alt="Browse Notes"
                                className="task-image"
                            ></img>
                        </Link>
                        <Link className="btn btn-task" to="/groups">
                            <img
                                src={require("./../images/ask_question.png")}
                                alt="Ask A Question"
                                className="task-image"
                            ></img>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;