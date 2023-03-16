import React from "react";
import "./UploadPage.css";
import FileItem from "./FileItem";
import axios from "axios";

const FileList = ({files, removeFile}) => {
    const deleteFileHandler = (_name) => {
        console.log(files);
        axios.delete(`http://localhost:3001/api/upload?name=${_name}`)
        .then((res) => removeFile(_name))
        .catch((err) => console.error(err))
    }

    return (
        <ul className="file-list">
            {
                files &&
                files.map(f => <FileItem 
                    key = {f.name}
                    file = {f}
                    deleteFile = {deleteFileHandler}
                />)
            }
        </ul>
    );
}

export default FileList;