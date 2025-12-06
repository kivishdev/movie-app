import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Updated Import
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Box, Alert, Fade } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Updated Hook
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('https://movie-app-ifv0.onrender.com/auth/login', { email, password });
            login({ username: data.username, role: data.role, id: data._id }, data.token);
            navigate('/'); 
        } catch (err) {
            setError('Invalid credentials. Please try again.',err);
        }
    };

    return (
        <Fade in={true} timeout={1000}>
            <Container maxWidth="xs" sx={{ mt: 10 }}>
                <Paper elevation={10} sx={{ p: 4, borderRadius: 3, bgcolor: '#1f1f1f', color: 'white' }}>
                    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: '#e50914' }}>
                        Sign In
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
                        <TextField 
                            label="Email" variant="filled" fullWidth 
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'gray' } }}
                            sx={{ bgcolor: '#333', borderRadius: 1 }}
                            value={email} onChange={(e) => setEmail(e.target.value)} 
                        />
                        <TextField 
                            label="Password" type="password" variant="filled" fullWidth 
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'gray' } }}
                            sx={{ bgcolor: '#333', borderRadius: 1 }}
                            value={password} onChange={(e) => setPassword(e.target.value)} 
                        />
                        <Button type="submit" variant="contained" size="large" sx={{ bgcolor: '#e50914', '&:hover': { bgcolor: '#b20710' }, fontWeight: 'bold' }}>
                            Sign In
                        </Button>
                    </Box>
                    <Box mt={3} textAlign="center">
                        <Typography variant="body2" color="gray">
                            New to MovieFlix? <Link to="/register" style={{ color: 'white', marginLeft: '5px', textDecoration: 'none', fontWeight: 'bold' }}>Register Now</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Fade>
    );
};

export default Login;