import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationHeader from './NavigationHeader';
import useAuth from '../../Auth/AuthContext'; // Adjust the path according to your project structure


const Profile = () => {
  useAuth(); // Check auth status
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const userData = await userResponse.json();
        if (userData.error) {
          setError(userData.error);
        } else {
          setUser(userData);
        }

        const postsResponse = await fetch(`http://localhost:5000/api/posts/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const postsData = await postsResponse.json();
        if (postsData.error) {
          setError(postsData.error);
        } else {
          setPosts(postsData);
        }
      } catch (error) {
        setError('Failed to fetch user details and posts');
        console.error('Error fetching user details and posts:', error);
      }
    };

    fetchUserAndPosts();
  }, [userId]);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handlePostClick = (postId) => {
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
        console.log('Post commented on:', data);
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

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Loading...</p>;
  
  return (
    <div>
      <NavigationHeader />
      <div className="container w-full mx-auto flex flex-col items-center mt-12 justify-center">
        <img src={user.profileImage} alt="" className="w-full items-center justify-center text-center mb-4 rounded" />
        <h1 className="text-4xl font-bold text-gray-800 my-4">{user.handle.toUpperCase()}</h1>
        <p className="text-gray-700 text-4l ">{user.bio}</p>
        { user.description && (
          <>
            <p className="text-lg font-bold text-gray-700 mt-6">Description:</p>
            <div className="border border-gray-300 pb-6 mb-6 rounded w-full max-w-xl sm:max-w-2xl mx-auto shadow-md hover:shadow-lg ">
              <p className="text-gray-700 text-4l ">{user.description}</p>
            </div>
          </>
        )}
        <div className=' flex flex-row justify-center  '>
          <div className=" m-4 flex flex-row justify-center text-center">
           <p className=""> <span className="text-lg font-bold text-gray-700">Email: </span>
            {user.email}</p>
          </div>
          { user.contact && (
          <div className=" m-4 flex flex-row">
            <p><span className="text-lg font-bold text-gray-700">Contact: </span>
            {user.contact}</p>
          </div>
          )}
        </div>

       <div className='text-left mb-8 flex flex-row'>
          <ul>
            {user.socialMedia.map((social, index) => (
              <li key={index}>
                <a href={social.link} target="_blank" rel="noopener noreferrer">
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        
        <div className="flex-grow items-center w-full  justify-center">
        <div className=" w-full max-w-full sm:max-w-3xl mx-auto ">
            <h2 className='text-2xl mb-2 font-bold text-gray-700 text-center sm:text-left mx-auto'>Posts</h2>
        </div>
          {posts.length === 0 ? (
            <div className=" w-full max-w-full  sm:max-w-3xl mx-auto ">
            <p>No posts available</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="border border-gray-300 pb-6 mb-6 rounded w-full max-w-full sm:max-w-3xl mx-auto shadow-md hover:shadow-lg">
                <div onClick={() => handleProfileClick(post.user)} className="flex items-center mb-4 py-2 px-8 bg-gray-200">
                  <img src={post.user.profileImage} alt="user profile image" className="w-12 h-12 rounded-full mr-16 sm:mr-12" />
                  <p className="text-center text-2xl font-bold">{post.user.handle}</p>
                </div>
                <div onClick={() => handlePostClick(post._id)} className="text-center">
                  {post.type === 'image' && <img src={post.media} alt={post.caption} className="w-full mb-4 rounded" />}
                  {post.type === 'video' && <video src={post.media} controls className="w-full mb-4 rounded" />}
                  {post.type === 'Event' && (
                    <p className="text-4l  mb-2">{post.description}</p>
                  )}
                  <h3 className="text-4l font-bold mb-2">{post.caption.toUpperCase()}</h3>
                  <p className="text-gray-600 mb-2">{post.likes.length} 👍</p>
                </div>
                <div className="text-center">
                  <button className="bg-gray-700 text-white px-4 py-2 rounded mt-2 mr-2" onClick={() => handleLikePost(post._id)}>Like</button>
                  {post.type === 'Event' && (
                    <>
                      {userType === 'Ambassador' && (
                        <button className="bg-green-700 text-white px-4 py-2 rounded mt-2" onClick={() => handleApply(post._id)}>Apply</button>
                      )}
                      {userType === 'company' && post.user._id === userId && (
                        <button className="bg-green-700 text-white px-4 py-2 rounded mt-2" onClick={() => handleViewApplications(post._id)}>View Applications</button>
                      )}
                    </>
                  )}
                </div>
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
                      <p className="text-gray-500 cursor-pointer" onClick={() => toggleCommentsVisibility(post._id)}>See Comments</p>
                    ) : (
                      <>
                        <p className="text-gray-500 cursor-pointer" onClick={() => toggleCommentsVisibility(post._id)}>Hide Comments</p>
                        {post.comments.map(comment => (
                          <div key={comment._id} className="mt-2">
                            <p className="text-gray-800">
                              <span className="cursor-pointer text-blue-600" onClick={() => handleProfileClick(post.user)}>
                                {/*comment.user*/}{comment.comment}
                              </span> 
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
