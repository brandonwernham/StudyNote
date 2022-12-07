import "./Navbar.css";

export default function Navbar() {
    return (
        <nav>
            <a class="active" href="/" className="title">StudyNote</a>
            <a href="/search">SEARCH</a>
            <a href="/classes">CLASSES</a>
            <a href="/groups">GROUPS</a>
            <a href="/upload">UPLOAD</a>
            <div class="container">
                <button type="submit" onClick="window.location.href='https://studynote.ca/login';">Log In/Register</button>
            </div>
        </nav>
    );
}