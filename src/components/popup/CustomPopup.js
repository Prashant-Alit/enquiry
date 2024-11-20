

import React, { useState } from "react";

export default function CustomPopup({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData); // Call the save function passed as a prop
  };

  return (
    <div className="custom-popup">
      <div><h2>Edit Speciality</h2></div>
      <div>
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Close</button>
      </div>
      <form>
        <label>
          Speciality Name:
          <input
            name="SpecialityName"
            value={formData.SpecialityName}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <input
            name="Description"
            value={formData.Description}
            onChange={handleChange}
          />
        </label>
        
      </form>
    </div>
  );
}
