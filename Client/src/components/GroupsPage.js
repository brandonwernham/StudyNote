import React, {useState} from 'react';
import Axios from 'axios';
import "./GroupsPage.css";
import Navbar from './Navbar';

export const GroupsPage = () => {
    const [dbData, setdbData] = useState([]);


    const showDB = () =>{
        Axios.get("http://localhost:3001/api/showDB", {
        }).then((response)=> {
            if (response.data.message){
                setdbData(response.data.message)
            }else{
                setdbData(response.data);
                console.log(response);
            }
        })
    }
    const getAllNotes = () =>{
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
            <div>
                <button onClick={showDB}>See DB</button>
                
            </div>
            <div>
            <button onClick={getAllNotes}>Get All Notes</button>
            </div>
        </div>
    );
}

export default GroupsPage;