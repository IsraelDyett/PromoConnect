// PostDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import useAuth from '../../Auth/AuthContext'; 
import NavigationHeader from './NavigationHeader';





const PostDetails = () => {
  useAuth(); // Check auth status
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userID');
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [userApplication, setUserApplication] = useState([]);
  const [approvedApplication, setApprovedApplication] = useState([]);


  //console.log(userType);
  useEffect(() => {
    fetch(`https://promoconnect.onrender.com/api/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setPost(data);
        }
      })
      .catch(err => {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      });

      const userId = localStorage.getItem('userID');
      console.log(userId,"for the current user");
      const userType = localStorage.getItem('userType');

      if(userType==="Ambassador"){
        //Fetch applications for the current user
        fetch(`https://promoconnect.onrender.com/api/applications/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              setError(data.error);
            } else {
              const filteredApprovedApplications = data.filter(application => application.post._id === postId && application.status === 'approved');
              
              if(filteredApprovedApplications.length>0){
                setApprovedApplication(filteredApprovedApplications);
              
              }

              const filteredExistingApplications = data.filter(application => application.post._id === postId);

              if(filteredExistingApplications.length>0){
                setUserApplication(filteredExistingApplications);
              }
             
            }
          })
          .catch(err => {
            setError('Failed to fetch user applications');
            console.error('Error fetching user applications:', err);
          });
      }
  }, [postId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  const handleApply = () => {
    navigate(`/apply/${postId}`);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
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
    
    fetch('https://promoconnect.onrender.com/api/posts/comment', {
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
    
    fetch('https://promoconnect.onrender.com/api/posts/like', {
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
  

  const toggleCommentsVisibility = () => {
    setPost(prevPost => ({
      ...prevPost,
      showComments: !prevPost.showComments
    }));
  };
  


  return (
    <div>
      <NavigationHeader />
      <div className='container flex items-center justify-between mb-20 lg:max-w-none lg:px-0 text-center '>
        <div key={post._id} className="border border-gray-300 pb-6 sm:mt-20 rounded w-full max-w-xl sm:max-w-2xl mx-auto shadow-md hover:shadow-lg">
          <div onClick={() => handleProfileClick(post.user._id)} className="flex items-center mb-4 py-2 px-8 bg-gray-200">
            <img src={post.user.profileImage} alt="user profile image" className="w-12 h-12  rounded-full mr-16  sm:mr-12" />
            <p className="text-center text-xl font-bold text-gray-800">{post.user.handle}</p>
          </div>
          <div className="text-center items-center">
            <h1 className='text-2xl font-bold text-gray-800'>{post.title}</h1>
            
            {post.type === 'image' && <img src={post.media} className="w-full mb-4 rounded" />}
            {post.type === 'video' && <video src={post.media} controls className="w-full mb-4 rounded" />}
            { post.type === 'Event' && (
            <>
            <div className='mt-12'>
              <div className=' flex flex-col justify-center  '>
                <div className=" m-4">
                  <p className="text-lg font-bold text-gray-700">Description:</p>
                  <p className="">{post.description}</p>
                </div>
                <div className=" m-4">
                  <p className="text-lg font-bold text-gray-700">Application Requirements:</p>
                  <p>{post.requirements}</p>
                </div>
              </div>
              <div className=' flex flex-row justify-center my-6'>
                <div className=" m-4">
                  <p className="text-lg font-bold text-gray-700">Location:</p>
                  <p className="">{post.location}</p>
                </div>
                <div className=" m-4">
                  <p className="text-lg font-bold text-gray-700">Date:</p>
                  <p>{new Date(post.timeAndDate).toLocaleString()}</p>
                </div>
              </div>
              <div className=' flex flex-row justify-center my-6'>
                <div className=" my-4 mx-12">
                  <p className="text-lg font-bold text-gray-700">Rate:</p>
                  <p>{post.hourlyRate}</p>
                </div>
                <div className=" my-4 mx-4">
                  <p>This is a verified event <br/>Apply to be considered</p>
                </div>
              </div>
              <div className=' flex flex-col justify-center my-6'>
                {(approvedApplication.length >0) && (
                  <div className="my-4 mx-12">
                    <p className="text-lg font-bold text-gray-700">WhatsApp Group:</p>
                    <p>{post.whatsappGroupLink}</p>
                  </div>
                )}
              </div>
              <div className=' flex flex-col justify-center mt-6'>
                {(approvedApplication.length >0) && post.Links && (
                  <div className="mt-4">
                    <p className="text-lg font-bold text-gray-700">Group Links:</p>
                    <ul>
                      {post.Links.map((link, index) => (
                        <li key={index}>
                          <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
               )}
              </div>
          </div>

            </>
            )}
            <h3 className="text-4l font-bold text-gray-600 mb-4">{post.caption.toUpperCase()}</h3>
            
            <p className="text-gray-600 mb-2"> {post.likes.length}👍</p>
            
          
          </div>
          <div  className="text-center">
          <button className="bg-gray-700 text-white px-4 py-2 rounded mt-2 mr-2" onClick={() => handleLikePost(post._id)}>Like</button>
            {userType === 'Ambassador' && post.type === 'Event' && userApplication.length ===0 && (
              <button className="bg-green-700 text-white px-4 py-2 rounded mt-2" onClick={() => handleApply(post._id)}>Apply</button>
            )}

            {userType === 'Ambassador' && post.type === 'Event' && userApplication.length >0 && !approvedApplication.length >0 && (
              <p className="px-4 py-2 rounded mt-2" >Already Applied</p>
            )}

            {userType === 'Ambassador' && post.type === 'Event' && userApplication.length >0 && approvedApplication.length >0 && (
              <p className="px-4 py-2 rounded mt-2" >Congratulations you are hired for this event</p>
            )}

            {userType === 'company' && post.type === 'Event' && post.user._id === userId && (
              <button className="bg-green-700 text-white px-4 py-2 rounded mt-2" onClick={() => handleViewApplications(post._id)}>View Applications</button>
              )}
          </div>
          {/* Add comment input field and submit button */}
          <div className="mt-4 mb-8 flex justify-center">
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
      </div>
    </div>
  );
};

export default PostDetails;
