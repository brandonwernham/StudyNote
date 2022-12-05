import React from "react";
import "./UploadPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";

const FileItem = ({file, deleteFile}) => {
    return (
        <li className="list-item" key={file.name}>
            <FontAwesomeIcon icon={faFileAlt}/>
            <p>{file.name}</p>
            <div className="actions">
                {file.isUploading && 
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                }
                {!file.isUploading && 
                    <FontAwesomeIcon icon={faTrash} 
                    onClick={() => deleteFile(file.name)} />
                }
            </div>
        </li>
    );
}

export default FileItem;