import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import "./UploadPage.css";
import axios, { Axios } from "axios";

const FileUpload = ({files, setFiles, removeFile}) => {
    const [tags, setTags] = useState("");
    const [cCode, setcCode] = useState("");


    const uploadHandler = (event) => {
        const file = event.target.files[0];
        setFiles([...files, file])
    }

    const submitFiles = () => {
        const file = files[0]; //this line needs to be changed eventually for multi file uploads
        file.isUploading = true;
        console.log(file);
        console.log(tags);
        console.log(file.name)
      
        const timestamp = Date.now();
        const noteName = file.name;
        const creatorId = 1;
      
        const formData = new FormData();
        formData.append("note_name", noteName);
        formData.append("note", file);
        formData.append("creator_id", creatorId);
        formData.append("tags", tags);
        formData.append("cCode", cCode);

        axios
          .post('https://studynote.ca/api/upload', formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            console.log(res);
            file.isUploading = false;
          })
          .catch((err) => {
            console.log(err);
            removeFile(file.name);
          });
    };
      

    return (
        <>
            <div className="file-box">
                <div className="file-input">
                    <input className="the-input" type="file" onChange={uploadHandler}/>
                    <button className="upload-button">
                        <i className="plus-icon">
                            <FontAwesomeIcon icon={faPlus} />
                        </i>
                        Upload
                    </button>
                </div>
                <p className="support">Supported File Types:</p>
                <p className="file-types">PDF, JPG, PNG</p>
                <div>
                    <p>Tags:</p>
                    <input className="input-tags" type="text" placeholder="Keywords to Help Find Your Note" id='tags' onChange={(e) => {setTags(e.target.value)}}></input>
                </div>
                <div>
                    <p>Course Code *if applicable*:</p>
                    <input className="input-tags" type="text" placeholder="Course Code" id='cCode' onChange={(e) => {setcCode(e.target.value)}}></input>
                </div>
                <button className="submit-files-button" onClick={submitFiles}>Submit</button>
            </div>
        </>
    );
}

export default FileUpload;