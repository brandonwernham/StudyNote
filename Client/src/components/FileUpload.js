import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import "./UploadPage.css";
import axios from "axios";

const FileUpload = ({files, setFiles, removeFile}) => {
    const uploadHandler = (event) => {
        const file = event.target.files[0];
        file.isUploading = true;
        setFiles([...files, file])

        this.setState({file: file});
        console.log(files);

        const formData = new FormData();
        formData.append(
            file.name,
            file,
            file.name
        )

        axios.post('https://studynote.ca/api/upload', formData)
        .then((res) => {
            file.isUploading = false;
            setFiles([...files, file]);
        })
        .catch((err) => {
            console.log(err);
            removeFile(file.name);
        })
    }

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
            </div>
        </>
    );
}

export default FileUpload;