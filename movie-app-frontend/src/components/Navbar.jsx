import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Updated Import
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Navbar = () => {
    const { user, logout } = useAuth(); // Updated Hook
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" sx={{ bgcolor: '#000000', borderBottom: '1px solid #333' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" component={Link} to="/">
                    <LocalMoviesIcon sx={{ color: '#e50914', fontSize: 30 }} />
                </IconButton>
                <Typography variant="h5" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: '#e50914', fontWeight: 'bold', ml: 1, letterSpacing: 1 }}>
                    MOVIEFLIX
                </Typography>
                
                <Box display="flex" gap={2} alignItems="center">
                    {user ? (
                        <>
                            <Typography variant="subtitle2" sx={{ color: '#aaa', display: { xs: 'none', sm: 'block' } }}>
                                Welcome, <span style={{ color: 'white', fontWeight: 'bold' }}>{user.username}</span> ({user.role})
                            </Typography>
                            {user.role === 'admin' && (
                                <Button variant="outlined" color="error" startIcon={<DashboardIcon />} component={Link} to="/admin">
                                    Dashboard
                                </Button>
                            )}
                            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>
                                Login
                            </Button>
                            <Button variant="contained" color="error" component={Link} to="/register" startIcon={<PersonAddIcon />}>
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;