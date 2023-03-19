import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./UploadPage.css";
import axios from "axios";

const FileUpload = ({ files, setFiles, removeFile }) => {
  const [tags, setTags] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [noteName, setNoteName] = useState("");

  const uploadHandler = (event) => {
    const file = event.target.files[0];
    setFiles([...files, file]);
  };

  const submitFiles = () => {
    const file = files[0]; //apparently needs to be changed for multi file uploads?
    file.isUploading = true;

    console.log(file);
    console.log(tags);
    console.log(subjectCode);
    console.log(courseCode);

    const timestamp = Date.now();
    const creatorId = 1; //needs to be changed eventually to actual account that submitted note
    //const creatorId = `creator_${timestamp}`;

    const formData = new FormData();
    formData.append("note_name", noteName);
    formData.append("tags", tags);
    formData.append("subject_code", subjectCode);
    formData.append("course_code", courseCode);
    formData.append("note", file);
    formData.append("creator_id", creatorId);

    axios.post("http://localhost:3001/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      console.log(res);
      file.isUploading = false;
    }).catch((err) => {
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
          <p>File Name:</p>
          <input
            className="input-tags"
            type="text"
            id="note_name"
            placeholder="Note Name"
            value={noteName}
            onChange={(e) => setNoteName(e.target.value)}
          />
        </div>
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
        <p>Subject Code:</p>
        <select
            className="input-tags"
            id="subject_code"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
        >
            <option value="">Select Subject Code</option>
            <option value="CHEM">CHEM</option>
            <option value="COMPSCI">COMPSCI</option>
            <option value="GEOG">GEOG</option>
            <option value="LAW">LAW</option>
            <option value="MATH">MATH</option>
            <option value="PATHOL">PATHOL</option>
            <option value="SE">SE</option>
        </select>
        </div>
        <div>
          <p>Course Code:</p>
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