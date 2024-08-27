import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';

export default function InnovatorProject() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [isContributionsModalOpen, setIsContributionsModalOpen] = useState(false);
    const innovatorId = localStorage.getItem('userId');

    useEffect(() => {
        console.log("Load innovator projects on page reload");
        loadProjects();
    }, []);

    const loadProjects = async () => {
        if (innovatorId !== null) {
            setLoading(true);
            try {
                const result = await apiClient.get(`/api/innovator/${innovatorId}/project`);
                setProjects(result.data);
                console.log(result.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
                window.alert("An error occurred while fetching projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSelectProject = (projectId) => {
        setSelectedProjects(prevSelected => 
            prevSelected.includes(projectId) 
                ? prevSelected.filter(id => id !== projectId) 
                : [...prevSelected, projectId]
        );
    };

    const handleRequestContributions = async () => {
        if (selectedProjects.length === 0) {
            window.alert("Please select at least one project to request contributions.");
            return;
        }

        const contributionRequests = selectedProjects.map(projectId => ({
            projectId: projectId
        }));

        try {
            const response = await apiClient.post(`/api/innovator/${innovatorId}/request`, contributionRequests);
            if (response.data) {
                loadProjects(); // Reload projects to update their status
                setSelectedProjects([]); // Clear selections after request
            }
        } catch (error) {
            console.error("Error requesting contributions:", error);
            window.alert("An error occurred while requesting contributions. Please try again later.");
        }
    };

    const handleViewContributions = async () => {
        if (selectedProjects.length !== 1) {
            window.alert("Please select exactly one project to view contributions.");
            return;
        }
    
        const projectId = selectedProjects[0];
    
        try {
            const response = await apiClient.get(`/api/innovator/${innovatorId}/contribution/${projectId}`);
            if (response.status === 200) {  
                setContributions(response.data);
                setIsContributionsModalOpen(true);  
            } else {
                window.alert("No contributions found for this project.");
            }
        } catch (error) {
            console.error("Error fetching contributions:", error);
            window.alert("An error occurred while fetching contributions. Please try again later.");
        }
    };

    return (
        <div className='container'>
            <div className='py-4'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <table className="table border shadow">
                            <thead>
                                <tr>
                                    <th scope="col">Select</th>
                                    <th scope="col">SN</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Requested Amount</th>
                                    <th scope="col">Current Funding</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project, index) => (
                                    <tr key={project.projectId}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedProjects.includes(project.projectId)}
                                                onChange={() => handleSelectProject(project.projectId)}
                                            />
                                        </td>
                                        <th scope="row">{index + 1}</th>
                                        <td>{project.title}</td>
                                        <td>{project.description}</td>
                                        <td>{project.requestedAmount}</td>
                                        <td>{project.currentFunding}</td>
                                        <td>{project.status}</td>
                                        <td>{new Date(project.createdAt).toLocaleString()}</td>
                                        <td>{new Date(project.updatedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-primary mx-2"
                                onClick={handleRequestContributions}
                                disabled={
                                    selectedProjects.length === 0 || 
                                    selectedProjects.some(projectId => {
                                        const project = projects.find(p => p.projectId === projectId);
                                        return project.status !== 'INACTIVE';
                                    })
                                }
                            >
                                Request Contributions
                            </button>
                            <button
                                className="btn btn-primary mx-2"
                                onClick={handleViewContributions}
                                disabled={selectedProjects.length !== 1}
                            >
                                View Contributions
                            </button>
                        </div>
                    </>
                )}
            </div>
            {isContributionsModalOpen && (
                <div
                    className="modal-overlay"
                    style={{
                        display: 'block',
                        position: 'fixed',
                        zIndex: 1050,
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        className="modal-content"
                        style={{
                            width: '80%', // Set a width to make it look better
                            maxWidth: '600px', // Optional: Max width to avoid too large modals
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        <h2>Contributions</h2>
                        <table className="table border shadow">
                            <thead>
                                <tr>
                                    <th scope="col">Donor First Name</th>
                                    <th scope="col">Donor Last Name</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Contributed At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contributions.map((contribution, index) => (
                                    <tr key={contribution.id}>
                                        <td>{contribution.donorFirstName}</td>
                                        <td>{contribution.donorLastName}</td>
                                        <td>{contribution.amount}</td>
                                        <td>{new Date(contribution.contributedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="btn btn-secondary mt-3"
                            style={{ width: '100%' }} // Optional: Button width to make it full-width
                            onClick={() => setIsContributionsModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}