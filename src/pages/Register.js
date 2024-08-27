import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function Register() {

    let navigate=useNavigate()

    const [user,setUser] = useState({
        firstName:"",
        lastName:"",
        email:"",
        phoneNumber:"",
        password:"",
        role: "INNOVATOR"
    });


    const{firstName,lastName,email,phoneNumber,password,role} = user

    const [error, setError] = useState('');

    const onInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    };

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission

        try {
            await apiClient.post(`/api/user/register`, user);
            window.alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = 'Invalid input. Please check your data and try again.';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            setError(errorMessage);
            window.alert(errorMessage); // Show an alert with the error message
        }
    };

  return (
    <div className='container'>
        <div className='row'>
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h2 className='text-center m-4'>Register User</h2>

                <form onSubmit={(e)=> onSubmit(e)}>
                    <div className='mb-3 d-flex align-items-center'>
                        <label htmlFor = "FirstName" className='form-label col-sm-3'>First Name<span className="text-danger">*</span></label>
                        <input
                        type={"text"}
                        className="form-control"
                        placeholder='First Name'
                        value={firstName}
                        onChange={(e)=>onInputChange(e)}
                        name="firstName"/>
                    </div>
                    <div className='mb-3 d-flex align-items-center'>
                        <label htmlFor="LastName" className='form-label col-sm-3'>Last Name</label>
                        <input
                            type={"text"}
                            className="form-control"
                            placeholder='Last Name'
                            value={lastName}
                            onChange={(e) => onInputChange(e)}
                            name="lastName"
                        />
                     </div>
                    <div className='mb-3 d-flex align-items-center'>
                        <label htmlFor = "Email" className='form-label col-sm-3'>Email<span className="text-danger">*</span></label>
                        <input
                        type={"text"}
                        className="form-control"
                        placeholder='Email'
                        value={email}
                        onChange={(e)=>onInputChange(e)}
                        name="email"/>
                    </div>
                    <div className='mb-3 d-flex align-items-center'>
                        <label htmlFor = "PhoneNumber" className='form-label col-sm-3'>Phone Number</label>
                        <input
                        type={"text"}
                        className="form-control"
                        placeholder='Phone Number'
                        value={phoneNumber}
                        onChange={(e)=>onInputChange(e)}
                        name="phoneNumber"/>
                    </div>
                    <div className='mb-3 d-flex align-items-center'>
                        <label htmlFor = "Password" className='form-label col-sm-3'>Password<span className="text-danger">*</span></label>
                        <input
                        type="password"
                        className="form-control"
                        placeholder='Password'
                        value={password}
                        onChange={(e)=>onInputChange(e)}
                        name="password"/>
                    </div>
                    <div className='mb-3 d-flex align-items-center'>
                        <label htmlFor="Role" className='form-label col-sm-3'>Role<span className="text-danger">*</span></label>
                        <select
                            className="form-control"
                            value={role}
                            onChange={onInputChange}
                            name="role"
                        >
                            <option value="INNOVATOR">Innovator</option>
                            <option value="DONOR">Donor</option>
                        </select>
                        </div>
                    <button type="submit" className='btn btn-outline-primary'>Submit</button>
                    <Link className='btn btn-outline-danger mx-2' to="/login">Cancel</Link>
                </form>
            </div>
        </div>
    </div>
  )
}

