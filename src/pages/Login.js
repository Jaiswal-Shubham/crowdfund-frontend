import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function Login({ setIsLoggedIn,setUserId, setUserRole }) {

    let navigate=useNavigate()

    const [user,setUser] = useState({
        email:"",
        password:""
    });

    const [error, setError] = useState('');

    const{email,password} = user

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await apiClient.post(`/api/user/login`,user);
            const { userId, role, token } = result.data;
            localStorage.setItem('userId', userId);
            localStorage.setItem('userRole',role);
            localStorage.setItem('authToken',token);
            setIsLoggedIn(true); 
            setUserId(result.data.userId);
            setUserRole(result.data.role);
            if(role === 'INNOVATOR'){
              navigate('/innovator/projects');
            }
            if(role === 'DONOR'){
              navigate('/donor/projects')
            }
        } catch (error) {
            setError('Invalid email or password');
            setUser({
                email:"",
                password:""});
            
            alert('Incorrect email or password');
        }
      };

    const onInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    };

  return (
    <div className='container'>
        <div className='row'>
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h2 className='text-center m-4'>Login User</h2>

                <form onSubmit={(e)=> handleLogin(e)}>
                    <div className='mb-3 d-flex align-items-center'>
                        <label htmlFor = "Email" className='form-label col-sm-3'>Email</label>
                        <input
                        type={"text"}
                        className="form-control"
                        placeholder='Email'
                        value={email}
                        onChange={(e)=>onInputChange(e)}
                        name="email"/>
                    </div>
                    <div className='mb-3 d-flex align-items-center'>
                        <label htmlFor="Password" className='form-label col-sm-3'>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => onInputChange(e)}
                            name="password"
                        />
                     </div>
                    <button type="submit" className='btn btn-outline-primary'>Login</button>
                    <Link className='btn btn-outline-primary mx-2' to="/register">Signup</Link>
                </form>
            </div>
        </div>
    </div>
  )
}