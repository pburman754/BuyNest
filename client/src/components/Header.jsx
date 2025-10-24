import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-logo">
        <Link to="/">BuyNext</Link>
      </div>
      <nav className="header-nav" >
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </header>
  );
}; 
export default Header;
