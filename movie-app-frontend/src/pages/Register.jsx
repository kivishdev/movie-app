import { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Box, MenuItem, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" color="primary" fontWeight="bold" gutterBottom>
                    Join MovieFlix
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                    <TextField 
                        label="Username" 
                        required 
                        fullWidth 
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    />
                    <TextField 
                        label="Email" 
                        type="email" 
                        required 
                        fullWidth 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                    <TextField 
                        label="Password" 
                        type="password" 
                        required 
                        fullWidth 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />
                    
                    {/* Role Selection - For Assessment Only */}
                    <TextField
                        select
                        label="Select Role"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        helperText="Select 'Admin' to manage movies"
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>

                    <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
                        Register
                    </Button>
                </Box>
                <Typography align="center" sx={{ mt: 2 }}>
                    Already have an account? <Link to="/login" style={{ color: '#e50914' }}>Login</Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Register;
