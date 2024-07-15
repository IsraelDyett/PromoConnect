import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import NavigationHeader from './Dual/NavigationHeader';


const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            // Send form data to backend for user registration
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log(data);
            if (response.ok) {
                // Registration successful, redirect to login page or handle appropriately
                console.log('Registration successful');
                // Redirect to login page or other appropriate page
                window.location.href = '/login';
            } else {
                // Registration failed, display error message
                const errorData = await response.json();
                setErrorMessage(errorData.message);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setErrorMessage('An error occurred while registering. Please try again.');
        }
    };

    return (
        <div>
              
            <NavigationHeader />
            <div className="max-w-md w-full mx-auto mt-20 p-6 bg-white rounded shadow-md hover:shadow-lg">
                <h2 className="text-2xl mb-4 font-bold text-gray-700 text-center">Register</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="type" className="text-gray-700">User Type:</label>
                        <select name="type" {...register('type', { required: true })} className="border border-gray-300 rounded px-3 py-2 mt-1">
                            <option value="Ambassador">Promo Personnel</option>
                            <option value="company">Company</option>
                        </select>
                        {errors.type && <span className="text-red-500">User type is required</span>}
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700">Email:</label>
                        <input type="email" name="email" {...register('email', { required: true })} className="border border-gray-300 rounded px-3 py-2 mt-1" />
                        {errors.email && <span className="text-red-500">Email is required</span>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-gray-700">Password:</label>
                        <input type="password" name="password" {...register('password', { required: true })} className="border border-gray-300 rounded px-3 py-2 mt-1" />
                        {errors.password && <span className="text-red-500">Password is required</span>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="handle" className="text-gray-700">Name:</label>
                        <input type="text" name="handle" {...register('handle', { required: true })} className="border border-gray-300 rounded px-3 py-2 mt-1" />
                        {errors.handle && <span className="text-red-500">Handle is required</span>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="contact" className="text-gray-700">Contact:</label>
                        <input type="text" name="contact" {...register('contact', { required: true })} className="border border-gray-300 rounded px-3 py-2 mt-1" />
                        {errors.contact && <span className="text-red-500">Contact is required</span>}
                    </div>
                    {/* <div className="flex flex-col">
                        <label htmlFor="firstname" className="text-gray-700">First Name:</label>
                        <input type="text" name="firstname" {...register('firstname', { required: true })} className="border border-gray-300 rounded px-3 py-2 mt-1" />
                        {errors.firstname && <span className="text-red-500">First Name is required</span>}
                    </div> */}
                    {/* Add input fields for other user attributes */}
                    <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded mt-2 hover:bg-green-700">Register</button>
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                </form>
            </div>
            </div >
            
    );
};
export default Register;
