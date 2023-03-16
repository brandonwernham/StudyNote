import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import "./UploadPage.css";
import axios, { Axios } from "axios";

const FileUpload = ({files, setFiles, removeFile}) => {

    const uploadHandler = (event) => {
        const file = event.target.files[0];
        setFiles([...files, file])
    }

    const submitFiles = () => {
        const file = files[0];
        file.isUploading = true;
        console.log(file);
      
        const timestamp = Date.now();
        const noteId = `${timestamp}`;
        const noteName = `Note ${timestamp}`;
        const creatorId = `creator_${timestamp}`;
      
        const formData = new FormData();
        formData.append("note_id", noteId);
        formData.append("note_name", noteName);
        formData.append("note", file);
        formData.append("creator_id", creatorId);
      
        axios
          .post("http://localhost:3001/api/upload", formData, {
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
                    <button className="btn btn-upload">
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
                    <input className="input-tags" type="text" placeholder="Keywords to Help Find Your Note"></input>
                </div>
                <div>
                    <p>Course Code *if applicable*:</p>
                    <input className="input-tags" type="text" placeholder="Course Code"></input>
                </div>
                <button className="btn btn-submit" onClick={submitFiles}>Submit</button>
            </div>
        </>
    );
}

export default FileUpload;