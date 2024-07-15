import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../Auth/AuthContext';
import NavigationHeader from '../Dual/NavigationHeader';

const Applications = () => {
  useAuth(); // Check auth status
  const { postId } = useParams();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${postId}/applications`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setApplications(data);
        }
      })
      .catch(err => {
        setError('Failed to fetch applications');
        console.error('Error fetching applications:', err);
      });
  }, [postId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!applications.length) {
    return <div>
      <NavigationHeader />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4 sm:text-left text-center">Applications for Event {}</h1>
        <div className="flex justify-center sm:justify-start space-x-4 mb-4 ">
          <button className={`btn ${filterType === 'all' && 'btn-active'}`} onClick={() => setFilterType('all')}>
             <span className="hover:underline">All</span>
             </button>
          <button className={`btn ${filterType === 'approved' && 'btn-active'}`} onClick={() => setFilterType('approved')}>
          <span className="hover:underline">Approved</span>
          </button>
          <button className={`btn ${filterType === 'rejected' && 'btn-active'}`} onClick={() => setFilterType('rejected')}>
          <span className="hover:underline">Rejected</span>
          </button>
          <button className={`btn ${filterType === 'pending' && 'btn-active'}`} onClick={() => setFilterType('pending')}>
          <span className="hover:underline">Pending</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <p className="border border-gray-300 rounded p-6 pl-8 cursor-pointer bg-gray-300 shadow-md mb-2 hover:bg-gray-800 hover:text-gray-200">No applications found for this event.</p>
       </div>
       </div>;
       </div>;
  }

  const handleApplicationClick = (applicationId) => {
    navigate(`/ApplicationDetails/${applicationId}`);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const filterApplications = () => {
    if (filterType === 'all') {
      return applications;
    } else {
      return applications.filter(application => application.status === filterType);
    }
  };

  return (
    <div>
      <NavigationHeader />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4 sm:text-left text-center">Applications for Event {}</h1>
        <div className="flex justify-center sm:justify-start space-x-4 mb-4 ">
          <button className={`btn ${filterType === 'all' && 'btn-active'}`} onClick={() => setFilterType('all')}>
             <span className="hover:underline">All</span>
             </button>
          <button className={`btn ${filterType === 'approved' && 'btn-active'}`} onClick={() => setFilterType('approved')}>
          <span className="hover:underline">Approved</span>
          </button>
          <button className={`btn ${filterType === 'rejected' && 'btn-active'}`} onClick={() => setFilterType('rejected')}>
          <span className="hover:underline">Rejected</span>
          </button>
          <button className={`btn ${filterType === 'pending' && 'btn-active'}`} onClick={() => setFilterType('pending')}>
          <span className="hover:underline">Pending</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filterApplications().map(application => (
            <div key={application._id} onClick={() => handleApplicationClick(application._id)} 
            className="border border-gray-300 rounded p-6 pl-8 cursor-pointer bg-gray-300 shadow-md mb-2 hover:bg-gray-800 hover:text-gray-200">
              <div className="flex items-center mb-2" >
                <img src={application.user.profileImage} alt="user profile" className="w-10 h-10 rounded-full mr-2" />
                <p className="font-bold ml-4">{application.user.handle}</p>
              </div>
              <div onClick={() => handleApplicationClick(application._id)}>
                <p className="mb-2">Status: {application.status}</p>
                <p className="mb-2">Date: {new Date(application.date).toLocaleString()}</p>
                {/* <div>
                  {application.documents.map(doc => (
                    <div key={doc._id} className="mb-2">
                      <p>Document: {doc.name}</p>
                      <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Document</a>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;
