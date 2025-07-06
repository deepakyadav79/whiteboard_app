import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import './index.min.css';
import { useNavigate } from 'react-router-dom';
import boardContext from '../../store/board-context';
import { useParams } from 'react-router-dom';


const Sidebar = () => {
  const [canvases, setCanvases] = useState([]);
  const token = localStorage.getItem('whiteboard_user_token');
  const { canvasId, setCanvasId, isUserLoggedIn, setUserLoginStatus} = useContext(boardContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { id } = useParams(); 

  const handleCanvasClick = useCallback(async (id) => {
    navigate(`/${id}`);
  }, [navigate]);

  const handleCreateCanvas = useCallback(async () => {
    try {
      const response = await axios.post('https://whiteboard5-5es6.onrender.com/api/canvas/create', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data)  
      // Refresh the canvas list
      const listResponse = await axios.get('https://whiteboard5-5es6.onrender.com/api/canvas/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCanvases(listResponse.data);
      setCanvasId(response.data.canvasId);
      navigate(`/${response.data.canvasId}`);
    } catch (error) {
      console.error('Error creating canvas:', error);
      return null;
    }
  }, [token, setCanvasId, navigate]);

  const fetchCanvases = useCallback(async () => {
    try {
      const response = await axios.get('https://whiteboard5-5es6.onrender.com/api/canvas/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCanvases(response.data);
      console.log(response.data)
      
      if (response.data.length === 0) {
        // Create a new canvas if none exist
        try {
          const createResponse = await axios.post('https://whiteboard5-5es6.onrender.com/api/canvas/create', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const newCanvas = createResponse.data;
          setCanvasId(newCanvas.canvasId);
          navigate(`/${newCanvas.canvasId}`);
        } catch (createError) {
          console.error('Error creating canvas:', createError);
        }
      } else if (!canvasId && response.data.length > 0) {
        if(!id){
          setCanvasId(response.data[0]._id);
          navigate(`/${response.data[0]._id}`);
        }
      }
    } catch (error) {
      console.error('Error fetching canvases:', error);
    }
  }, [token, setCanvasId, canvasId, id, navigate]);

  const handleDeleteCanvas = async (id) => {
    try {
      await axios.delete(`https://whiteboard5-5es6.onrender.com/api/canvas/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the canvas list
      const listResponse = await axios.get('https://whiteboard5-5es6.onrender.com/api/canvas/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCanvases(listResponse.data);
      if (listResponse.data.length > 0) {
        setCanvasId(listResponse.data[0]._id);
        navigate(`/${listResponse.data[0]._id}`);
      }
    } catch (error) {
      console.error('Error deleting canvas:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('whiteboard_user_token');
    setCanvases([]);
    setUserLoginStatus(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleShare = async () => {
    if (!email.trim()) {
      setError("Please enter an email.");
      return;
    }

    try {
      setError(""); // Clear previous errors
      setSuccess(""); // Clear previous success message

      const response = await axios.put(
        `https://whiteboard5-5es6.onrender.com/api/canvas/share/${canvasId}`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message);
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to share canvas.");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  // Move useEffect after all function definitions
  useEffect(() => {
    if (isUserLoggedIn) {
      fetchCanvases();
    }
  }, [isUserLoggedIn, fetchCanvases]);

  useEffect(() => {}, []);

  return (
    <div className="sidebar">
      <button 
        className="create-button" 
        onClick={handleCreateCanvas} 
        disabled={!isUserLoggedIn}
      >
        + Create New Canvas
      </button>
      <ul className="canvas-list">
        {canvases.map(canvas => (
          <li 
            key={canvas._id} 
            className={`canvas-item ${canvas._id === canvasId ? 'selected' : ''}`}
          >
            <span 
              className="canvas-name" 
              onClick={() => handleCanvasClick(canvas._id)}
            >
              {canvas._id}
            </span>
            <button className="delete-button" onClick={() => handleDeleteCanvas(canvas._id)}>
              del
            </button>
          </li>
        ))}
      </ul>
      
      <div className="share-container">
        <input
          type="email"
          placeholder="Enter the email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="share-button" onClick={handleShare} disabled={!isUserLoggedIn}>
          Share
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
    </div>
      {isUserLoggedIn ? (
        <button className="auth-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button className="auth-button login-button" onClick={handleLogin}>
          Login
        </button>
      )}
    </div>
  );
};

export default Sidebar;
