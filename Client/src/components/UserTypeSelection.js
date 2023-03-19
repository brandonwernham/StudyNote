import React, { useState } from 'react';

export default function UserTypeSelection({ onSelect, onSkip }) {
  const [user_type, setUserType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user_type) {
      onSelect(user_type);
    }
  };

  return (
    <div>
      <h2>Select user type</h2>
      {onSkip && <button onClick={onSkip}>Skip</button>}
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            value="student"
            checked={user_type === 'student'}
            onChange={(e) => setUserType(e.target.value)}
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            value="teacher"
            checked={user_type === 'teacher'}
            onChange={(e) => setUserType(e.target.value)}
          />
          Teacher
        </label>
        <button type="submit" disabled={!user_type}>
          Submit
        </button>
      </form>
    </div>
  );
}