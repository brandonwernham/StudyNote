import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import ClassesPage from './components/ClassesPage';
import GroupsPage from './components/GroupsPage';
import UploadPage from './components/UploadPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { UserProvider } from "./components/UserContext";

function App() {
    return (
        <UserProvider>
            <Routes>
                <Route path='/' element={<HomePage />}></Route>
                <Route path='search' element={<SearchPage />}></Route>
                <Route path='classes' element={<ClassesPage />}></Route>
                <Route path='groups' element={<GroupsPage />}></Route>
                <Route path='upload' element={<UploadPage />}></Route>
            </Routes>
        </UserProvider>
    );
}

export default App;