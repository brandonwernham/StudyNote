import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import ClassesPage from './components/ClassesPage';
import GroupsPage from './components/GroupsPage';
import UploadPage from './components/UploadPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='search' element={<SearchPage />}></Route>
            <Route path='classes' element={<ClassesPage />}></Route>
            <Route path='groups' element={<GroupsPage />}></Route>
            <Route path='upload' element={<UploadPage />}></Route>
            <Route path='login' element={<LoginPage />}></Route>
            <Route path='register' element={<RegisterPage />}></Route>
        </Routes>
    );
}

export default App;