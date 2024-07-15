import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../Auth/AuthContext';
import NavigationHeader from '../Dual/NavigationHeader';

const ApplicationForm = () => {
  useAuth(); // Check auth status
  const { postId } = useParams();
  const [documents, setDocuments] = useState([{ name: '', file: '' }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [note, setNote] = useState("");

  console.log("postID: ",postId);
  
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setDocuments(prevDocs => {
      const newDocs = [...prevDocs];
      newDocs[index].file = fileUrl;
      return newDocs;
    });
  };

  const handleNameChange = (e, index) => {
    const name = e.target.value;
    setDocuments(prevDocs => {
      const newDocs = [...prevDocs];
      newDocs[index].name = name;
      return newDocs;
    });
  };

  const addFileInput = () => {
    setDocuments([...documents, { name: "", file: "" }]);
  };

  const removeFileInput = (index) => {
    setDocuments(prevDocs => prevDocs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(postId);
    fetch(`http://localhost:5000/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        documents,
        note,
        post: postId,
        user: localStorage.getItem('userID') // Assuming user ID is stored in local storage
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          navigate(`/post/${postId}`); // Navigate back to post details page after successful application
        }
      })
      .catch(err => {
        setError('Failed to submit application');
        console.error('Error submitting application:', err);
      });
  };

  return (
    <div>
      <NavigationHeader />
      <div className="container flex items-center justify-between mb-20 lg:max-w-none lg:px-0 text-center">
        <div className="border border-gray-300 pb-6 sm:mt-20 rounded w-full max-w-xl sm:max-w-2xl mx-auto shadow-md hover:shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 my-4">Apply for Event</h1>
          <p className="text-xl text-gray-800 my-4">Add the required documents and information for this event</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit} className="px-8">
            <div className="mb-4">
              {documents.map((doc, index) => (
                <div key={index} className="mb-2">
                  <label className="block text-left mb-1">
                    <span className="text-gray-700">Name of Document:</span>
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => handleNameChange(e, index)}
                      className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                      required
                    />
                  </label>
                  <label className="block text-left mb-1">
                    <span className="text-gray-700">Document {index + 1} File:</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, index)}
                      className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                      required
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeFileInput(index)}
                    className="bg-red-800 text-white px-4 py-2 rounded mt-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFileInput}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Document
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-left mb-1">
                <span className="text-gray-700">Note:</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 block w-full text-gray-900 border border-gray-300 rounded py-2 px-3"
                  
                />
              </label>
            </div>
            <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
