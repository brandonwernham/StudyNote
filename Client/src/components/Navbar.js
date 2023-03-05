import { useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
        <a href="/" className="title">
            StudyNote
        </a>
        <div className="pages">
            <a href="/search" className={pathname === "/search" ? "active" : ""}>
            Search
            </a>
            <a href="/classes" className={pathname === "/classes" ? "active" : ""}>
            Classes
            </a>
            <a href="/groups" className={pathname === "/groups" ? "active" : ""}>
            Groups
            </a>
            <a href="/upload" className={pathname === "/upload" ? "active" : ""}>
            Upload
            </a>
        </div>

        <div className="container">
            <a href="/login">Login</a>
        </div>
    </nav>
  );
}
