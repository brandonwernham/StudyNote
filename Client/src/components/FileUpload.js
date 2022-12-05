import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import "./UploadPage.css";

const FileUpload = ({files, setFiles}) => {
    const uploadHandler = () => {}
    return (
        <>
            <div className="file-box">
                <div className="file-input">
                    <input className="the-input" type="file" />
                    <button className="upload-button">
                        <i className="plus-icon">
                            <FontAwesomeIcon icon={faPlus} />
                        </i>
                        Upload
                    </button>
                </div>
                <p className="support">Supported File Types:</p>
                <p className="file-types">PDF, JPG, PNG</p>
            </div>
        </>
    );
}

export default FileUpload;