import React, {useState} from 'react';
import Axios from 'axios';
import "./GroupsPage.css";
import Navbar from './Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const GroupsPage = () => {
    const [dbData, setdbData] = useState([]);


    const showDB = () =>{
        Axios.get("https://studynote.ca/api/showDB", {
        }).then((response)=> {
            if (response.data.message){
                setdbData(response.data.message)
            }else{
                setdbData(response.data);
                console.log(response);
            }
        })
    }
    const test = () =>{
        Axios.get("http://localhost:3001/api/test", {
        }).then((response)=> {
            if (response.data.message){
                console.log(response);
                setdbData(response.data.message)
            }else{
                setdbData(response.data);
                console.log(response);
            }
        })
    }


    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <h1 className='groups-title'>Groups</h1>
            </div>
            {/* <div>
                <button onClick={showDB}>See DB</button>
                
            </div>
            <div>
            <button onClick={test}>Test</button>
            </div> */}

            <div className='groups-content'>
                <div className='groups-side-bar'>
                    <div className='groups-row'>
                        <button className='btn btn-groups-row'>
                            <i className="groups-plus-icon">
                                <FontAwesomeIcon icon={faPlus} />
                            </i>
                            Create StudyGroup
                        </button>
                    </div>
                    <div className='groups-row'>
                        <button className='btn btn-groups-row'>Group 1</button>
                    </div>
                    <div className='groups-row'>
                        <button className='btn btn-groups-row'>Group 1</button>
                    </div>
                    <div className='groups-row'>
                        <button className='btn btn-groups-row'>Group 1</button>
                    </div>
                    <div className='groups-row'>
                        <button className='btn btn-groups-row'>Group 1</button>
                    </div>
                </div>
                <div className='groups-group-container'>
                    <div>This is where each group will display</div>
                </div>
            </div>

        </div>
    );
}

export default GroupsPage;