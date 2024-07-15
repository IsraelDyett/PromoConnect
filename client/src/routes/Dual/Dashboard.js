//Dashboard.js
import React, { useEffect, useState } from 'react';
import useAuth from '../../Auth/AuthContext'; // Adjust the path according to your project structure
import {  useParams, useNavigate } from 'react-router-dom';
import NavigationHeader from './NavigationHeader';


const Dashboard = () => {
  useAuth(); // Check auth status
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [userApplications, setUserApplications] = useState([]); 
  const [userEvents, setUserEvents] = useState([]); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');


  const navigate = useNavigate();
  const { postId } = useParams();

  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userID');

  console.log(userType);
  useEffect(() => {
    fetch('http://localhost:5000/api/posts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you're using Bearer token for authentication
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          const sortedPosts = data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
          setPosts(sortedPosts);
        }
      })
      .catch(err => {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      });
      const userId = localStorage.getItem('userID');
      console.log(userId,"for the current user");
      const userType = localStorage.getItem('userType');

      if(userType==="Ambassador"){
        //Fetch applications for the current user
        fetch(`http://localhost:5000/api/applications/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              setError(data.error);
            } else {
              setUserApplications(data);
            }
          })
          .catch(err => {
            setError('Failed to fetch user applications');
            console.error('Error fetching user applications:', err);
          });
      }

  }, []);

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handlePostClick  = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleApply = (postId) => {
    navigate(`/apply/${postId}`);
  };

  const handleViewApplications = (postId) => {
    console.log('Viewing applications for post:', postId);
    navigate(`/applications/${postId}`);
  };

  const handleInputChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = (postId, commentText) => {
    const userId = localStorage.getItem('userID');
    
    fetch('http://localhost:5000/api/posts/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ postId, userId, commentText })
    })
    .then(response => response.json())
    .then(data => {
      setCommentText('');
      if (data.error) {
        console.error('Error commenting on post:', data.error);
      } else {
        console.log('Post commenting on:', data);
        // Update the local state with the updated post data
        const updatedPosts = posts.map(post => {
          if (post._id === postId) {
            return { ...post, comments: data.comments }; 
          }
          return post;
        });
  
        // Update the state with the updatedPosts array
        setPosts(updatedPosts);
      }
    })
    .catch(err => {
      console.error('Error commenting on post:', err);
    });
  };

  const handleLikePost = (postId) => {
    const userId = localStorage.getItem('userID');
    
    fetch('http://localhost:5000/api/posts/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ postId, userId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Error liking post:', data.error);
      } else {
        console.log('Post liked:', data);
        // Update the local state with the updated post data
        const updatedPosts = posts.map(post => {
          if (post._id === postId) {
            return { ...post, likes: data.likes }; // Update only the likes array with data.likes
          }
          return post;
        });
  
        // Update the state with the updatedPosts array
        setPosts(updatedPosts);
       }
    })
    .catch(err => {
      console.error('Error liking post:', err);
    });
  };
  

  const toggleCommentsVisibility = (postId) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post._id === postId) {
        return { ...post, showComments: !post.showComments };
      }
      return post;
    }));
  };

  const filterPosts = () => {
    const currentDate = new Date();
    if (filterType === 'all') {
      return posts;
    }
    if(filterType === 'postOnly'){
      return posts.filter(post => post.type === 'image' || post.type === 'video');  
    }
    if(filterType === 'eventOnly'){
      return posts.filter(post => post.type === 'Event');  
    }
    if (filterType === 'upcomingEvents') {
      return posts.filter(post => post.type === 'Event' && new Date(post.timeAndDate) > currentDate);
    }
    if (filterType === 'myupcomingEvents') {
      return posts.filter(post =>  post.user._id === userId && post.type === 'Event' && new Date(post.timeAndDate) > currentDate);
    }
    if (filterType === 'userAppliedEvents') {
      const approvedApplications = userApplications.filter(application => application.status === 'pending');
      const appliedPostIds = userApplications.map(application => application.post._id);
      return posts.filter(post => post.type === 'Event' && appliedPostIds.includes(post._id) && new Date(post.timeAndDate) > currentDate);
    }
    if (filterType === 'neverAppliedToEvents') {
      const approvedApplications = userApplications.filter(application => application.status === 'pending' || application.status === 'approved' || application.status === 'rejected');
      const appliedPostIds = userApplications.map(application => application.post._id);
      return posts.filter(post => post.type === 'Event' && !appliedPostIds.includes(post._id) && new Date(post.timeAndDate) > currentDate);
    }
    if (filterType === 'userApprovedEvents') {
      const approvedApplications = userApplications.filter(application => application.status === 'approved');
      const approvedPostIds = approvedApplications.map(application => application.post._id);
      return posts.filter(post => post.type === 'Event' && approvedPostIds.includes(post._id)  && new Date(post.timeAndDate) > currentDate);
    }
    if (filterType === 'userRejectedEvents') {
      const approvedApplications = userApplications.filter(application => application.status === 'rejected');
      const approvedPostIds = approvedApplications.map(application => application.post._id);
      return posts.filter(post => post.type === 'Event' && approvedPostIds.includes(post._id)  && new Date(post.timeAndDate) > currentDate);
    }
    if (filterType === 'myEvents') {
      return posts.filter(post => post.user._id === userId && post.type === 'Event');
      //return userEvents;
    }
  };

  return (
    <div>
      <NavigationHeader />
      <div className="container w-full mx-auto flex flex-col items-center justify-center">
        
       
        
        <div className="mb-4 flex flex-col mt-12 sm:flex-row items-start">
          <div className="sm:hidden">
            <button 
              className="bg-gray-200 px-4 py-2 rounded mb-2 w-full" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Menu
            </button>
          </div>
         
          <div className={`${menuOpen ? 'block' : 'hidden'} flex flex-col sm:block items-center justify-center sm:mr-4 sm:w-1/4`}>
            <h1 className="hidden sm:block text-3xl sm:text-5xl md:text-6xl font-bold mb-8 items-center justify-center text-gray-700">Promo Connect</h1>
            <button className="bg-blue-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={handleCreatePost}>Create Post</button>
            
                  
            <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('all')}>All</button>
            <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('postOnly')}>Post</button>
            <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('eventOnly')}>Event</button>
            <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('upcomingEvents')}>All Upcoming Events</button>

            {userType === 'company'  && (
              <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('myEvents')}>My Events</button> 
              &&
              <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('myupcomingEvents')}>My Upcoming Events</button>
            )}

            {userType === 'Ambassador' && (
              <>
                <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('neverAppliedToEvents')}>Events to Apply</button>
                                
                <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('userApprovedEvents')}>Approved Events</button>
                
                <button className="bg-gray-200 px-2 sm:px-4 py-1 sm:py-2 rounded mb-1 sm:mb-2 w-24 sm:w-full" onClick={() => setFilterType('userRejectedEvents')}>Rejected Events</button>  
              </>
            )}

          </div>
          <div className="flex-grow items-center w-full justify-center">
            <div className="flex flex-col items-center w-full">
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {filterPosts().map(post => (
                <div key={post._id} className="border border-gray-300 pb-6 mb-6 rounded w-full max-w-xl sm:max-w-2xl mx-auto shadow-md hover:shadow-lg">
                  <div onClick={() => handleProfileClick(post.user._id)} className="flex items-center mb-4 py-2 px-8 bg-gray-200">
                    <img src={post.user.profileImage} alt="user profile image" className="w-12 h-12  rounded-full mr-16  sm:mr-12" />
                    <p className="text-center text-2xl font-bold">{post.user.handle}</p>
                  </div>
                  <div onClick={() => handlePostClick(post._id)} className="text-center">
                    {post.type === 'image' && <img src={post.media} alt={post.caption} className="w-full mb-4 rounded" />}
                    {post.type === 'video' && <video src={post.media} controls className="w-full mb-4 rounded" />}
                    { post.type === 'Event' && (
                    <p className="text-4l  mb-2">{post.description}</p>
                    )}
                    <h3 className="text-4l font-bold mb-2">{post.caption.toUpperCase()}</h3>
                    
                    <p className="text-gray-600 mb-2"> {post.likes.length}👍</p>
                    
                  
                  </div>
                  <div  className="text-center">
                  <button className="bg-gray-700 text-white px-4 py-2 rounded mt-2 mr-2" onClick={() => handleLikePost(post._id)}>Like</button>
                    {userType === 'Ambassador' && post.type === 'Event' && (
                      <button className="bg-green-700 text-white px-4 py-2 rounded mt-2" onClick={() => handleApply(post._id)}>Apply</button>
                    )}

                    {userType === 'company' && post.type === 'Event' && post.user._id === userId && (
                      <button className="bg-green-700 text-white px-4 py-2 rounded mt-2" onClick={() => handleViewApplications(post._id)}>View Applications</button>
                     )}
                 </div>
                  {/* Add comment input field and submit button */}
                  <div className="mt-4 flex justify-center">
                    <div className="w-3/4">
                      <div className="flex items-center">
                        <input
                           type="text"
                           placeholder="Add a comment..."
                           className="px-3 py-2 border border-gray-300 rounded w-full"
                           value={commentText}
                           onChange={handleInputChange}
                        />
                        <button
                          className="bg-gray-700 text-white px-4 py-2 rounded ml-2"
                          onClick={() => handleCommentSubmit(post._id, commentText)}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                  {post.comments.length > 0 && (
                    <div className="border-t border-gray-300 pt-4 mt-4 ml-4">
                      {!post.showComments ? (
                        <p className="text-gray-500 cursor-pointer " onClick={() => toggleCommentsVisibility(post._id)}>See Comments</p>
                      ) : (
                        <>
                          <p className="text-gray-500 cursor-pointer" onClick={() => toggleCommentsVisibility(post._id)}>Hide Comments</p>
                          {post.comments.map(comment => (
                            <div key={comment._id} className="mt-2">
                              <p className="text-gray-800"><span className="cursor-pointer text-blue-600" onClick={() => handleProfileClick(post.user._id)}> {comment.user.handle}</span>: {comment.comment}</p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;