import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../Auth/AuthContext'; // Adjust the path according to your project structure
import NavigationHeader from '../Dual/NavigationHeader';


const ApplicationDetails = () => {
  useAuth(); // Check auth status
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/applications/${applicationId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setApplication(data);
        }
        
      })
      .catch(err => {
        setError('Failed to fetch application details');
        console.error('Error fetching application details:', err);
      });
  }, [applicationId]);

  const updateStatus = (status) => {
    console.log(`Updating status to: ${status}`);
    fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          console.log('Application updated:', data);
          setApplication(data);
        }
      })
      .catch(err => {
        setError(`Failed to update application status to ${status}`);
        console.error(`Error updating application status to ${status}:`, err);
      });
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!application) {
    return <p className="text-gray-700">Loading application details...</p>;
  }

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div>
      <NavigationHeader />
      <div className='container items-center text-center justify-between mb-20 lg:max-w-none lg:px-0 text-center '>
        <h1 className="text-2xl font-bold mb-8 mt-16">Application Details</h1>
        <div className="border items-center text-center border-gray-300 rounded w-full pb-8 max-w-xl shadow-md hover:shadow-lg mx-auto">
          
          <div onClick={() => handleProfileClick(application.user)} className="flex items-center mb-4 py-6 px-8 bg-gray-300">
            <img src={application.user.profileImage} alt="user profile image" className="w-12 h-12  rounded-full mr-16  sm:mr-12" />
            <p className="text-center text-xl font-bold text-gray-800">{application.user.handle}</p>
          </div>
         
          <p className="mb-2"><span className="font-bold">Status:</span> {application.status}</p>

          <div className='flex flex-row justify-center my-6'>
            {application.documents.length > 0 && (
              <div className="mr-4">
                <span className="font-bold">Documents:</span>
                {application.documents.map(doc => (
                  <div key={doc._id} className="mt-2">
                    <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline"><p className="mb-1"> {doc.name}</p></a>
                  </div>
                ))}
              </div>
            )}

            {application.note && (
              <div className="mx-4">
                <p className="mb-2"><span className="font-bold">Note:</span></p>
                <p>{application.note}</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <button onClick={() => updateStatus('approved')} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded mr-2">Approve</button>
            <button onClick={() => updateStatus('rejected')} className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
