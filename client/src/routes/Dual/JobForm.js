import React, { useState } from 'react';

const JobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    timeAndDate: '',
    hourlyRate: '',
    requirements: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Form Data Submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="timeAndDate">Time and Date:</label>
        <input
          type="datetime-local"
          id="timeAndDate"
          name="timeAndDate"
          value={formData.timeAndDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="hourlyRate">Hourly Rate:</label>
        <input
          type="number"
          id="hourlyRate"
          name="hourlyRate"
          value={formData.hourlyRate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="requirements">Requirements:</label>
        <textarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
        ></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default JobForm;
