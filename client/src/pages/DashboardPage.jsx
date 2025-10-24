// src/pages/DashboardPage.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  // 1. Get the FULL user object and the setUser function
  const { user, setUser } = useAuth();

  // 2. Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 3. UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 4. This is the new, critical part!
      // We create a 'config' object for the request
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // 5. Send our token!
        },
      };

      // 6. Send the form data AND the config object
      const { data } = await axios.post(
        "/api/shops",
        { name, description }, // The form data (body)
        config // The headers with our token
      );

      // 7. SUCCESS!
      setLoading(false);
      alert("Shop created successfully!");

      // 8. UPDATE OUR GLOBAL STATE!
      // We create a *new* user object...
      const updatedUser = { ...user, isSeller: true };
      // ...and tell AuthContext to use it.
      setUser(updatedUser);
      // This will also update localStorage automatically via our useEffect!
    } catch (err) {
      // 9. FAILURE!
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || "Failed to create shop.";
      setError(errorMessage);
    }
  };

  // 10. CONDITIONAL RENDERING
  if (user.isSeller) {
    return (
      <div>
        <h1>Manage Your Shop</h1>
        <p>Welcome, seller! You can add products and manage orders here.</p>
        {/* We'll add a link to "Add Product" later */}

        <Link to="/add-product" className="btn">
          Add a New Product
        </Link>

        {/* We'll add a list of their products here later */}
      </div>
    );
  }

  // 11. If user is NOT a seller, show the form
  return (
    <div className="form-container">
      <h1>Create Your Shop</h1>
      <p>Become a seller on BuyNext by creating your shop.</p>

      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Shop Name</label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="My Awesome Shop"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Shop Description</label>
          <textarea
            id="description"
            className="form-input"
            placeholder="What do you sell?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>
        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? "Creating..." : "Create Shop"}
        </button>
      </form>
    </div>
  );
};

export default DashboardPage;
