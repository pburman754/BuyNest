import { Link } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header-container">
      <div className="header-logo">
        <Link to="/">BuyNext</Link>
      </div>
      <nav className="header-nav">
        {user ? (
          <>
            <span>Welcome, {user.name}!</span>
            <button onClick={logout} className="btn-logout">
              logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};
export default Header;
