import { useState } from 'react';
import { Card, CardContent, Typography, Box, Collapse, IconButton, Chip, Rating } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MovieCard = ({ movie }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Fallback: Agar displayRank nahi mila, toh DB rank use karo, warna '?'
    const rankToShow = movie.displayRank || movie.rank || '?';

    return (
        <Card 
            sx={{ 
                mb: 2, 
                bgcolor: '#1f1f1f', 
                color: 'white',
                borderRadius: 2,
                transition: '0.3s',
                '&:hover': { bgcolor: '#2a2a2a', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
                cursor: 'pointer'
            }}
            onClick={handleExpandClick}
        >
            <Box display="flex" alignItems="flex-start">
                {/* --- Left Side: Image --- */}
                <Box sx={{ 
                    width: 100, 
                    height: 150, 
                    flexShrink: 0,
                    overflow: 'hidden',
                    borderRadius: '8px 0 0 8px'
                }}>
                    <img 
                        src={movie.poster || "https://via.placeholder.com/100x150"} 
                        alt={movie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </Box>

                {/* --- Right Side: Content --- */}
                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#e50914' }}>
                            {/* FIX: Using rankToShow here */}
                            {rankToShow}. {movie.title}
                        </Typography>
                        <IconButton size="small" sx={{ color: 'gray' }}>
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2} mt={1} mb={1} flexWrap="wrap">
                        <Chip 
                            label={movie.year} 
                            size="small" 
                            icon={<CalendarTodayIcon sx={{ fontSize: '1rem !important' }} />} 
                            sx={{ bgcolor: '#333', color: '#ccc' }} 
                        />
                        <Chip 
                            label={`${movie.duration} min`} 
                            size="small" 
                            icon={<AccessTimeIcon sx={{ fontSize: '1rem !important' }} />} 
                            sx={{ bgcolor: '#333', color: '#ccc' }} 
                        />
                        <Box display="flex" alignItems="center">
                            <Rating value={parseFloat(movie.rating) / 2} precision={0.5} readOnly size="small" />
                            <Typography variant="body2" color="#aaa" ml={0.5}>({movie.rating})</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* --- Collapsible Description --- */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ borderTop: '1px solid #333', bgcolor: '#252525' }}>
                    <Typography variant="subtitle2" color="#e50914" gutterBottom>
                        Overview:
                    </Typography>
                    <Typography variant="body2" color="#ddd" sx={{ lineHeight: 1.6 }}>
                        {movie.description || "No description available for this movie."}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default MovieCard;