import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function CreateProject() {
    let navigate = useNavigate();

    const [project, setProject] = useState({
        innovatorId: '',
        title: '',
        description: '',
        requestedAmount: '',
        currentFunding: '0'
    });

    const { innovatorId, title, description, requestedAmount } = project;

    const [error, setError] = useState('');

    const onInputChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        const userId = localStorage.getItem('userId');
        const projectData = {
            ...project,
            innovatorId: userId
        };

        try {
            await apiClient.post(`/api/innovator/${userId}/project`, projectData);
            navigate('/innovator/projects'); // Navigate to the projects list after successful creation
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
                    <h2 className='text-center m-4'>Create Project</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={onSubmit}>
                        <div className='mb-3 d-flex align-items-center'>
                            <label htmlFor="Title" className='form-label col-sm-3'>
                                Title<span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Project Title'
                                value={title}
                                onChange={onInputChange}
                                name="title"
                                required
                            />
                        </div>
                        <div className='mb-3 d-flex align-items-center'>
                            <label htmlFor="Description" className='form-label col-sm-3'>
                                Description<span className="text-danger">*</span>
                            </label>
                            <textarea
                                className="form-control"
                                placeholder='Project Description'
                                value={description}
                                onChange={onInputChange}
                                name="description"
                                required
                            />
                        </div>
                        <div className='mb-3 d-flex align-items-center'>
                            <label htmlFor="RequestedAmount" className='form-label col-sm-3'>
                                Requested Amount<span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder='Requested Amount'
                                value={requestedAmount}
                                onChange={onInputChange}
                                name="requestedAmount"
                                required
                            />
                        </div>
                        <button type="submit" className='btn btn-outline-primary'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}