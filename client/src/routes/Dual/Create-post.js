import React, { useState } from 'react';
import NavigationHeader from './NavigationHeader';
import useAuth from '../../Auth/AuthContext'; // Adjust the path according to your project structure
import { useParams, useNavigate } from 'react-router-dom';

const CreatePost = ({ userType }) => {
  useAuth();
  const userId = localStorage.getItem('userID');
  const navigate = useNavigate();
  
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null);
  const [type, setType] = useState('image'); // 'image', 'video', 'Event'
  const [eventDate, setEventDate] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    timeAndDate: '',
    hourlyRate: '',
    requirements: '',
  });

  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  
  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('user', userId);
    postData.append('caption', caption);
    postData.append('media', media);
    postData.append('type', type);
    if (type === 'Event') {
      postData.append('title', formData.title);
      postData.append('description', formData.description);
      postData.append('location', formData.location);
      postData.append('timeAndDate', formData.timeAndDate);
      postData.append('hourlyRate', formData.hourlyRate);
      postData.append('requirements', formData.requirements);
    }

    for (let pair of postData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await fetch('https://promoconnect.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: postData
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      console.log('Post created:', data);
      navigate('/'); // Redirect or handle success as needed
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post');
    }
  };

  return (
    <div>
      <NavigationHeader />
      <div className="container flex items-center justify-between mb-20 lg:max-w-none lg:px-0 text-center">
        <div className="border border-gray-300 pb-6 sm:mt-20 rounded w-full max-w-xl sm:max-w-2xl mx-auto shadow-md hover:shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 my-4">Create Post</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit} className="px-8">
            <div className="mb-4">
              <label className="block text-left mb-1">
                <span className="text-gray-700">Caption:</span>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                  required
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-left mb-1">
                <span className="text-gray-700">Media:</span>
                <input
                  type="file"
                  onChange={handleMediaChange}
                  className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                  required
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-left mb-1">
                <span className="text-gray-700">Type:</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                  required
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="Event">Event</option>
                </select>
              </label>
            </div>
            {type === 'Event' && (
              <>
                <div className="mb-4">
                  <label className="block text-left mb-1" htmlFor="title">
                    <span className="text-gray-700">Title of Event:</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-left mb-1">
                    <span className="text-gray-700">Description:</span>
                  </label>
                  <textarea
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-left mb-1">
                    <span className="text-gray-700">Requirements:</span>
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                    value={formData.requirements}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-left mb-1">
                    <span className="text-gray-700">Location/Area:</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-left mb-1">
                    <span className="text-gray-700">Date and Time:</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="timeAndDate"
                    name="timeAndDate"
                    className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                    value={formData.timeAndDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-left mb-1" htmlFor="hourlyRate">
                    <span className="text-gray-700">Hourly Rate:</span>
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
            >
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
