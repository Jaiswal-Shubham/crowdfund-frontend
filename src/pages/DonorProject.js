import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';

export default function DonorProject() {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const donorId = localStorage.getItem('userId');

    useEffect(() => {
        loadContributions();
    }, []);

    const loadContributions = async () => {
        setLoading(true);
        try {
            const result = await apiClient.get(`/api/donor/${donorId}/contribution`);
            setContributions(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching contributions:", error);
            window.alert("An error occurred while fetching contributions. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className='py-4'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table border shadow">
                        <thead>
                            <tr>
                                <th scope="col">SN</th>
                                <th scope="col">Project Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Amount Contributed</th>
                                <th scope="col">Contribution Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contributions.map((contribution, index) => (
                                <tr key={contribution.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{contribution.title}</td>
                                    <td>{contribution.description}</td>
                                    <td>{contribution.amount}</td>
                                    <td>{new Date(contribution.contributedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}