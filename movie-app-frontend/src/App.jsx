import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import { useAuth } from './context/AuthContext'; // Updated Import

const AdminRoute = ({ children }) => {
    const { user } = useAuth(); // Updated Hook
    return user && user.role === 'admin' ? children : <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Access Denied. Admins Only.</div>;
};

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={
                    <AdminRoute>
                        <Admin />
                    </AdminRoute>
                } />
            </Routes>
        </>
    );
}

export default App;