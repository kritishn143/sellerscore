import React, { useState, useEffect } from "react";
import NavBar from '../components/NavBar';
import "./UserAccount.css";
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [businessRequests, setBusinessRequests] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentYear] = useState(new Date().getFullYear());
  const [currentRequest, setCurrentRequest] = useState({
    id: null,
    name: "",
    category: "",
    address: "",
    website: "",
    image: null,
  });
  const [imageFile, setImageFile] = useState(null); // New state for the image file

  // Dummy categories for the dropdown
  const categories = [
    "Finance",
    "Travel Company",
    "Health",
    "Store",
    "Food and Beverage",
    "Electronics and Technology",
    "Insurance Agency"
  ];

  // Fetch user data and business requests when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/myprofile  `,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
        setUsername(data?.username || "");
        setEmail(data?.email || "");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBusinessRequests = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/users/mybusiness`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch business requests");
        const data = await response.json();
        setBusinessRequests(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
    fetchBusinessRequests();
  }, []);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/updateuserprofile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, email }),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");
      setUser({ ...user, username, email });
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle request edit
  const handleEditRequest = (request) => {
    setCurrentRequest({
      id: request._id,
      name: request.businessName,
      category: request.category,
      address: request.address,
      website: request.website,
    });
    setImageFile(null); // Reset the image file when editing a request
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("businessName", currentRequest.name);
    formData.append("category", currentRequest.category);
    formData.append("address", currentRequest.address);
    formData.append("website", currentRequest.website);
    if (imageFile) {
      formData.append("image", imageFile); // Add image file if provided
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/business-request/${currentRequest.id}/edit`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }, // Don't set Content-Type for FormData
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update business request");
      const updatedRequest = await response.json();
      setBusinessRequests(
        businessRequests.map((req) =>
          req._id === updatedRequest.updatedRequest._id
            ? updatedRequest.updatedRequest
            : req
        )
      );

      // Reset the current request state
      setCurrentRequest({
        id: null,
        name: "",
        category: "",
        address: "",
        website: "",
      });
      setImageFile(null); // Reset image file after update
      alert("Business request updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle delete request
  const handleDeleteRequest = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/business-request/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete business request");
      setBusinessRequests(businessRequests.filter((req) => req._id !== id));
      alert("Business request deleted successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <><><NavBar /><div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <div className="profile-box">
            <h2>User Profile</h2>
            <form onSubmit={handleUpdateProfile} className="form-grid">
              <div className="form-row-group">
                <div className="form-row">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!editMode}
                    required />
                </div>
                <div className="form-row">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!editMode}
                    required />
                </div>
              </div>
              <div className="button-group">
                <button type="button" onClick={() => setEditMode(!editMode)}>
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
                {editMode && <button type="submit">Save Changes</button>}
              </div>
            </form>
          </div>

          <div className="business-requests-box">
            <h3>Your Business Requests</h3>
            {businessRequests.length > 0 ? (
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.businessName}</td>
                      <td>{request.status}</td>
                      <td className="request-buttons">
                        <button onClick={() => handleEditRequest(request)}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(request._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No business requests found.</p>
            )}

            {currentRequest.id && (
              <form onSubmit={handleUpdateRequest} className="form-grid">
                <h4>Edit Business Request</h4>
                <div className="form-row">
                  <label>Business Name:</label>
                  <input
                    type="text"
                    value={currentRequest.name}
                    onChange={(e) => setCurrentRequest({
                      ...currentRequest,
                      name: e.target.value,
                    })}
                    required />
                </div>
                <div className="form-row">
                  <label>Category:</label>
                  <select
                    value={currentRequest.category}
                    onChange={(e) => setCurrentRequest({
                      ...currentRequest,
                      category: e.target.value,
                    })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Address:</label>
                  <input
                    type="text"
                    value={currentRequest.address}
                    onChange={(e) => setCurrentRequest({
                      ...currentRequest,
                      address: e.target.value,
                    })}
                    required />
                </div>
                <div className="form-row">
                  <label>Website:</label>
                  <input
                    type="url"
                    value={currentRequest.website}
                    onChange={(e) => setCurrentRequest({
                      ...currentRequest,
                      website: e.target.value,
                    })} />
                </div>
                <div className="form-row">
                  <label>
                    Upload New Image:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])} />
                  </label>
                </div>
                <div className="button-group">
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div></><footer className="footer">
    <img src="/score.gif" alt="score logo" className="footer-logo" style={{ width: "50px", height: "50px" }} />
    <p>&copy; {currentYear} Sellerscore. All rights reserved.</p>
      </footer></>
  );
};

export default UserProfile;
