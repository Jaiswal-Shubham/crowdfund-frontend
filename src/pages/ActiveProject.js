import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';

export default function ActiveProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('');
    const donorId = localStorage.getItem('userId');

    useEffect(() => {
        console.log("Loading all active projects...");
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const result = await apiClient.get('/api/donor/projects');
            setProjects(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            window.alert("An error occurred while fetching projects. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProject = (projectId) => {
        setSelectedProject(projectId); 
    };

    const handleContribute = () => {
        setIsModalOpen(true); // Open the modal when clicking the Contribute button
    };

    const handleSubmitContribution = async () => {
        if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
            window.alert("Please enter a valid contribution amount.");
            return;
        }

        const selectedProjectDetails = projects.find(project => project.projectId === selectedProject);
        const availableFund = selectedProjectDetails.requestedAmount - selectedProjectDetails.currentFunding;
    
        if (parseFloat(contributionAmount) > parseFloat(availableFund)) {
            window.alert("Contribution amount exceeds the available fund.");
            return;
        }

        if (selectedProject) {
            const contributionDTO = {
                projectId: selectedProject,
                amount: contributionAmount,
            };

            try {
                const result = await apiClient.post(`/api/donor/${donorId}/contribution`, contributionDTO);
                if (result.data) {
                    window.alert("Contribution successful!");
                    loadProjects(); // Reload projects to update their status or availability
                    setIsModalOpen(false); // Close the modal
                    setContributionAmount(''); // Reset the contribution amount
                }
            } catch (error) {
                console.error("Error making contribution:", error);
                window.alert("An error occurred while making the contribution. Please try again later.");
            }
        }
    };

    return (
        <div className='container'>
            <div className='py-4'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {/* Apply a blur effect to the table when the modal is open */}
                        <table className={`table border shadow ${isModalOpen ? 'blurred' : ''}`}>
                            <thead>
                                <tr>
                                    <th scope="col">Select</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Available Fund</th>
                                    <th scope="col">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project, index) => (
                                    <tr key={project.projectId}>
                                        <td>
                                            <input
                                                type="radio"
                                                name="selectedProject"
                                                value={project.projectId}
                                                checked={selectedProject === project.projectId}
                                                onChange={() => handleSelectProject(project.projectId)}
                                            />
                                        </td>
                                        <td>{project.title}</td>
                                        <td>{project.description}</td>
                                        <td>{project.requestedAmount - project.currentFunding}</td>
                                        <td>{new Date(project.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="btn btn-primary"
                            onClick={handleContribute}
                            disabled={!selectedProject} 
                        >
                            Contribute
                        </button>
                    </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal" style={{
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
                }}>
                    <div className="modal-content" style={{
                        width: '400px', /* Set a fixed width for the modal */
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px', /* Rounded corners */
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)', /* Subtle shadow */
                    }}>
                        <h2>Contribute to Project</h2>
                        <div>
                            <label>Contribution Amount:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={contributionAmount}
                                onChange={(e) => setContributionAmount(e.target.value)}
                            />
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <button className="btn btn-primary" style={{ width: '45%' }} onClick={handleSubmitContribution}>
                                Submit
                            </button>
                            <button className="btn btn-secondary" style={{ width: '45%' }} onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}