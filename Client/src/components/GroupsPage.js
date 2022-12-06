import React, {useState} from 'react';
import Axios from 'axios';
import "./GroupsPage.css";
import Navbar from './Navbar';

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
        Axios.get("https://studynote.ca/api/test", {
        }).then((response)=> {
            if (response.data.message){
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
            <div>
                <button onClick={showDB}>See DB</button>
                <button onClick={test}>Test</button>
            </div>
        </div>
    );
}

export default GroupsPage;