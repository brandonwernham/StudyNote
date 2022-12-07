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
                <form>
                    <button type="submit" onclick="location.href = 'https://studynote.ca/login';">Log In/Register</button>
                </form>
            </div>
        </nav>
    );
}