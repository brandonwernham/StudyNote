export default function Navbar() {
    return <nav className="nav">
        <a href="/" className="title">StudyNote</a>
            <ul>
                <li>
                    <a href="/search">Search</a>
                </li>
                <li>
                    <a href="/classes">Classes</a>
                </li>   
                <li> 
                    <a href="/groups">Groups</a>
                </li>
                <li>
                    <a href="/upload">Upload</a>
                </li>
        </ul>
    </nav>
    
}