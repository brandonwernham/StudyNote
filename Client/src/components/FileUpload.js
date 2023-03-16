import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./UploadPage.css";
import axios from "axios";

const FileUpload = ({ files, setFiles, removeFile }) => {
  const [tags, setTags] = useState("");
  const [courseCode, setCourseCode] = useState("");

  const uploadHandler = (event) => {
    const file = event.target.files[0];
    setFiles([...files, file]);
  };

  const submitFiles = () => {
    const file = files[0];
    file.isUploading = true;
    console.log(file);

    const timestamp = Date.now();
    const noteId = `${timestamp}`;
    const noteName = `Note ${timestamp}`;
    const creatorId = `creator_${timestamp}`;

    console.log("tags", tags); // add this line to check the value of tags
    console.log("courseCode", courseCode); // add this line to check the value of courseCode

    const formData = new FormData();
    formData.append("note_id", noteId);
    formData.append("note_name", noteName);
    formData.append("tags", tags);
    formData.append("course_code", courseCode);
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
          <input className="the-input" type="file" onChange={uploadHandler} />
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
          <input
            className="input-tags"
            type="text"
            id="tags"
            placeholder="Keywords to Help Find Your Note"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <p>Course Code *if applicable*:</p>
          <input
            className="input-tags"
            type="text"
            id="course_code"
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
        </div>
        <button className="btn btn-submit" onClick={submitFiles}>
          Submit
        </button>
      </div>
    </>
  );
};

export default FileUpload;