import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home({ handleLogout }) {
  let navigate = useNavigate();
  const donorId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          {userRole === 'INNOVATOR' && (
            <>
              <Link className='btn btn-outline-light me-5' to="/innovator/create">
                Create Project
              </Link>
              <Link className='btn btn-outline-light me-5' to="/innovator/projects">
                View All Project
              </Link>
            </>
          )}
          {userRole === 'DONOR' && (
            <>
              <Link className='btn btn-outline-light me-5' to="/donor/projects">
                View All Project
              </Link>
              <button className='btn btn-outline-light me-5' onClick={() => {
                navigate(`/donor/${donorId}/projects`)
              }}>
                View Contributed Project
              </button>
            </>
          )}
          <div className="ms-auto">
                <button className='btn btn-outline-light' onClick={()=>{
                    handleLogout()
                    navigate("/login")
                }}>
                    Log Out
                </button>
            </div>
        </div>
      </nav>
    </div>
  );
}