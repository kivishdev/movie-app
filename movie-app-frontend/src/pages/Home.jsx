import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, TextField, MenuItem, Box, Pagination, Typography, CircularProgress, InputAdornment, Button, Fade, Collapse } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MovieCard from '../components/MovieCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [page, setPage] = useState(1);
    
    // Advanced Sort State
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');

    // Backend states
    const [totalPages, setTotalPages] = useState(1);
    const [totalMovies, setTotalMovies] = useState(0);

    const moviesPerPage = 20; 
    const moviesSectionRef = useRef(null);

    // Fetch Movies Logic
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/movies?page=${page}&limit=${moviesPerPage}`;
                
                if (search) {
                    url = `http://localhost:5000/movies/search?q=${search}&page=${page}&limit=${moviesPerPage}`;
                } else if (sortBy) {
                    url = `http://localhost:5000/movies/sorted?sortBy=${sortBy}&page=${page}&limit=${moviesPerPage}`;
                } else if (selectedYear) {
                    url = `http://localhost:5000/movies/sorted?sortBy=year&page=${page}&limit=${moviesPerPage}`;
                }
                
                const { data } = await axios.get(url);
                
                if (data.movies && Array.isArray(data.movies)) {
                    setMovies(data.movies);
                    setTotalPages(data.totalPages || 1);
                    setTotalMovies(data.totalMovies || 0);
                } else {
                    setMovies([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setMovies([]);
            }
            setLoading(false);
        };

        const timeoutId = setTimeout(() => {
            fetchMovies();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [page, search, sortBy, selectedYear]); 

    const handleGetStarted = () => {
        moviesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handlePageChange = (e, value) => {
        setPage(value);
        if (moviesSectionRef.current) {
            window.scrollTo({
                top: moviesSectionRef.current.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    const handleForceRefresh = async () => {
        setLoading(true);
        try {
            await axios.get('http://localhost:5000/movies/force-refresh');
            window.location.reload(); 
        } catch (error) {
            alert("Refresh failed.",error);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#141414', minHeight: '100vh', color: 'white' }}>
            
            {/* HERO SECTION */}
            <Box sx={{ 
                height: '60vh', 
                background: `linear-gradient(to top, #141414, transparent), url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                px: 2
            }}>
                <Fade in={true} timeout={1500}>
                    <Box maxWidth="md">
                        <Typography variant="h3" fontWeight="900" sx={{ mb: 2, textShadow: '2px 2px 4px black' }}>
                            Top 250 Movies Database
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large" 
                            color="primary" 
                            onClick={handleGetStarted} 
                            startIcon={<PlayArrowIcon />} 
                            sx={{ px: 4, py: 1, borderRadius: '50px', fontWeight: 'bold' }}
                        >
                            Browse Collection
                        </Button>
                    </Box>
                </Fade>
            </Box>

            <Container sx={{ pb: 5 }} ref={moviesSectionRef}>
                {/* STATS BAR */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={1}>
                    <Typography variant="body1" color="gray">
                        Total Movies: <span style={{ color: '#e50914', fontWeight: 'bold', fontSize: '1.1rem' }}>{totalMovies}</span>
                    </Typography>
                    
                    <Button 
                        startIcon={<RefreshIcon />} 
                        size="small" 
                        color="secondary" 
                        onClick={handleForceRefresh}
                        sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                    >
                        Sync Data
                    </Button>
                </Box>

                {/* FILTER BAR */}
                <Box sx={{ p: 3, bgcolor: '#1f1f1f', borderRadius: 2, mb: 4, boxShadow: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        
                        <TextField 
                            placeholder="Search titles..." 
                            fullWidth 
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                style: { color: 'white', fontSize: '1.1rem' },
                                startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>
                            }}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            sx={{ flex: 1, minWidth: '200px' }}
                        />

                        <TextField
                            select 
                            variant="standard" 
                            value={sortBy}
                            onChange={(e) => { 
                                setSortBy(e.target.value); 
                                setSelectedYear(''); 
                                setPage(1); 
                            }}
                            sx={{ minWidth: 150 }}
                            InputProps={{ disableUnderline: true, style: { color: '#ccc' } }}
                            SelectProps={{ style: { color: 'white' } }}
                        >
                            <MenuItem value="">Default Sort</MenuItem>
                            <MenuItem value="title">Name (A-Z)</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                            <MenuItem value="duration">Duration</MenuItem>
                        </TextField>

                        <Button 
                            variant={showAdvanced ? "contained" : "outlined"} 
                            color="primary" 
                            startIcon={<FilterListIcon />}
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            Advanced Sort
                        </Button>
                    </Box>

                    {/* ADVANCED SORT SECTION */}
                    <Collapse in={showAdvanced}>
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #333', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CalendarMonthIcon color="primary" />
                            <Typography variant="body1" color="gray">Sort by Release Year:</Typography>
                            
                            <TextField 
                                type="number"
                                placeholder="YYYY"
                                variant="outlined"
                                size="small"
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                    setSortBy(''); 
                                    setPage(1);
                                }}
                                sx={{ 
                                    width: 120,
                                    bgcolor: '#333',
                                    borderRadius: 1,
                                    input: { color: 'white' }
                                }}
                            />
                        </Box>
                    </Collapse>
                </Box>

                {/* MOVIE LIST */}
                {loading ? (
                    <Box display="flex" flexDirection="column" alignItems="center" py={10}>
                        <CircularProgress color="primary" />
                        <Typography variant="body2" color="gray" mt={2}>
                            Fetching latest data...
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        {movies.length > 0 ? (
                            movies.map((movie, index) => (
                                <MovieCard 
                                    key={movie._id} 
                                    movie={{
                                        ...movie,
                                        // FIX: Generate Serial Number dynamically
                                        // Formula: (CurrentPage - 1) * 20 + CurrentIndex + 1
                                        displayRank: (page - 1) * moviesPerPage + index + 1
                                    }} 
                                />
                            ))
                        ) : (
                            <Box textAlign="center" py={5}>
                                <Typography variant="h6" color="gray">No movies found.</Typography>
                                <Button variant="outlined" sx={{ mt: 2 }} onClick={handleForceRefresh}>
                                    Try Force Sync
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={4} p={2} bgcolor="#1f1f1f" borderRadius={4}>
                        <Pagination 
                            count={totalPages} 
                            page={page} 
                            onChange={handlePageChange} 
                            color="primary" 
                            size="large"
                            showFirstButton 
                            showLastButton
                            sx={{ '& .MuiPaginationItem-root': { color: 'white' }, '& .Mui-selected': { bgcolor: '#e50914 !important' } }}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Home;