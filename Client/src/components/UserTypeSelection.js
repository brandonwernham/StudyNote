import React, { useState } from 'react';
import "./UserTypeSelection.css";

export default function UserTypeSelection({ onSelect }) {
  const [user_type, setUserType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user_type) {
      onSelect(user_type);
    }
  };

  return (
    <div className='user-type-container'>
      <h3 className='select-text'>Select User Type:</h3>
      <form onSubmit={handleSubmit} className='form-type'>
        <label className='label-type'>
          <input
            type="radio"
            value="student"
            checked={user_type === 'student'}
            onChange={(e) => setUserType(e.target.value)}
            className='input-type'
          />
          Student
        </label>
        <label className='label-type'>
          <input
            type="radio"
            value="teacher"
            checked={user_type === 'teacher'}
            onChange={(e) => setUserType(e.target.value)}
            className='input-type'
          />
          Teacher
        </label>
        <button type="submit" disabled={!user_type} className='btn btn-submit-type'>
          Submit
        </button>
      </form>
    </div>
  );
}