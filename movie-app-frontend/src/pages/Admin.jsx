import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // FIX: Import useAuth, NOT AuthContext
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText, IconButton, Paper, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Admin = () => {
    const { token } = useAuth(); // FIX: Use the hook here
    const [movies, setMovies] = useState([]);
    
    // Form State
    const [formData, setFormData] = useState({ title: '', rating: '', duration: '', description: '', year: '' });
    const [editingId, setEditingId] = useState(null); 

    const fetchMovies = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/movies');
            setMovies(data);
        } catch (error) {
            console.error("Error fetching movies", error);
        }
    };

    useEffect(() => {
        fetchMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle Form Submit (Add OR Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // --- PUT Request (Update) ---
                await axios.put(`http://localhost:5000/movies/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Movie Updated Successfully!');
                setEditingId(null); 
            } else {
                // --- POST Request (Add New) ---
                await axios.post('http://localhost:5000/movies', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Movie Added Successfully!');
            }

            // Reset Form & Refresh List
            setFormData({ title: '', rating: '', duration: '', description: '', year: '' });
            fetchMovies();
        } catch (error) {
            alert('Operation failed. Check console.');
            console.error(error);
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this movie?')) return;
        try {
            await axios.delete(`http://localhost:5000/movies/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMovies();
        } catch (error) {
            alert('Error deleting movie',error);
        }
    };

    // Handle Edit Click (Form ko fill karna)
    const handleEditClick = (movie) => {
        setFormData({
            title: movie.title,
            rating: movie.rating,
            duration: movie.duration || '',
            description: movie.description || '',
            year: movie.year || ''
        });
        setEditingId(movie._id); 
        window.scrollTo(0, 0); 
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Admin Dashboard
            </Typography>
            
            {/* --- ADD / EDIT FORM --- */}
            <Paper sx={{ p: 4, mb: 4, bgcolor: '#1f1f1f' }}>
                <Typography variant="h6" gutterBottom color="white">
                    {editingId ? 'Edit Movie Details' : 'Add New Movie'}
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Title" required fullWidth 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Rating (0-10)" required fullWidth 
                                value={formData.rating} 
                                onChange={(e) => setFormData({...formData, rating: e.target.value})} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Duration (mins)" type="number" fullWidth 
                                value={formData.duration} 
                                onChange={(e) => setFormData({...formData, duration: e.target.value})} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Year" fullWidth 
                                value={formData.year} 
                                onChange={(e) => setFormData({...formData, year: e.target.value})} 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="Description" multiline rows={3} fullWidth 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" gap={2}>
                        <Button type="submit" variant="contained" color={editingId ? "warning" : "primary"} size="large">
                            {editingId ? 'Update Movie' : 'Add Movie'}
                        </Button>
                        
                        {editingId && (
                            <Button variant="outlined" color="inherit" onClick={() => {
                                setEditingId(null);
                                setFormData({ title: '', rating: '', duration: '', description: '', year: '' });
                            }}>
                                Cancel Edit
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* --- MOVIE LIST --- */}
            <Typography variant="h5" gutterBottom color="white">Manage Existing Movies</Typography>
            <Paper sx={{ bgcolor: '#1f1f1f' }}>
                <List>
                    {movies.map((movie) => (
                        <ListItem key={movie._id} divider sx={{ borderColor: '#333' }} secondaryAction={
                            <Box>
                                <IconButton color="primary" onClick={() => handleEditClick(movie)} sx={{ mr: 1 }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(movie._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        }>
                            <ListItemText 
                                primary={<Typography variant="h6" color="white">{movie.title}</Typography>} 
                                secondary={
                                    <Typography variant="body2" color="gray">
                                        Rating: {movie.rating} | Year: {movie.year}
                                    </Typography>
                                } 
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Admin;