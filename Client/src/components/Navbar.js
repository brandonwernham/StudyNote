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
                    <input type="text" placeholder="Username"></input>
                    <input type="password" placeholder="Password"></input>
                    <a href="/register">Register</a>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </nav>
    );
}