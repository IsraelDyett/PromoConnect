import React, { useState, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from './Dual/NavigationHeader';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    //const { login } = useContext(AuthContext);
    const history = useNavigate();
    //const user = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // Handle successful login
                setSuccessMessage('Login successful');
                console.log('Login successful');
                 // Store the token
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.userType);
                localStorage.setItem('userID', data.userID);
                 //login();
                 history('/dashboard'); // Redirect to the protected route
            } else {
                // Handle failed login
                setErrorMessage(data.error || 'Login failed');
                console.error('Login failed');
            }
        })
        .catch(error => {
            console.error('Error logging in:', error);
            setErrorMessage('An error occurred. Please try again.');
        });
    }

    const handleRegister = () => {
        history(`/register`);
      };

    return (
            <div className="">
                <NavigationHeader />
                <div className=" border border-gray-200 max-w-md w-full mx-auto mt-20 p-6 bg-white rounded shadow-md hover:shadow-lg">
                    <h2 className="text-2xl mb-4 font-bold text-gray-700 text-center">Login</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-gray-700">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className="border border-gray-300 rounded px-3 py-2 mt-1"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-gray-700">Password:</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                className="border border-gray-300 rounded px-3 py-2 mt-1"
                            />
                        </div>
                        <div className='flex flex-row  justify-between'>
                            <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded mt-2">Login</button>
                            <button className="bg-green-800 text-white px-4 py-2 rounded mt-2 " onClick={() => handleRegister()}>Register</button>
                        </div>

                        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                        {successMessage && <div className="text-green-500">{successMessage}</div>}
                    </form>
                </div>
            </div>
        );
    }

export default Login;
