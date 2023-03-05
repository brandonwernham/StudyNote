import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <a href="/" className="title">StudyNote</a>
            <div className="pages">
                <a class="active" href="/search">Search</a>
                <a href="/classes">Classes</a>
                <a href="/groups">Groups</a>
                <a href="/upload">Upload</a>
            </div>
            
            <div class="container">
                <a href="/login">Login</a>
            </div>
        </nav>
    );
}