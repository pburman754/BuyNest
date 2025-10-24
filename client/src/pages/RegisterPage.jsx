import { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ Fixed typo: should be useState, not userState
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // ✅ Make this function async to use await
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { name, email, password } = formData;

    try {
      const { data } = await axios.post(
        "/api/users/register",
        {
          name,
          email,
          password,
        }
      );

      setLoading(false);
      console.log("Registration Successful:", data);
      alert("Registration successful! Please log in.");
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again!";
      setError(errorMessage);
      console.error("Registration error:", err.response);
    }
  };

  return (
    <div className="form-container">
      <h1>Create an Account</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
