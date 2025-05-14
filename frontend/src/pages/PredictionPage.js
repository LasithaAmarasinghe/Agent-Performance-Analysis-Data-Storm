import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Container} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import axios from 'axios';

const PredictionPage = () => {
  const [agentId, setAgentId] = useState('');
  const [performance, setPerformance] = useState(null);
  const [error, setError] = useState('');

  const getStarCount = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  };

  const getPerformanceColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return '#4caf50'; // Green
      case 'medium':
        return '#ff9800'; // Orange
      case 'low':
        return '#f44336'; // Red
      default:
        return '#4caf50'; // Green
    }
  };

  const getPerformanceBgColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return '#e8f5e9'; // Light Green
      case 'medium':
        return '#fff3e0'; // Light Orange
      case 'low':
        return '#ffebee'; // Light Red
      default:
        return '#e8f5e9'; // Light Green
    }
  };

  const renderStars = (level) => {
    const starCount = getStarCount(level);
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        i < starCount ? (
          <StarIcon 
            key={i} 
            sx={{ 
              color: getPerformanceColor(level),
              fontSize: '2.5rem'
            }} 
          />
        ) : (
          <StarBorderIcon 
            key={i} 
            sx={{ 
              color: getPerformanceColor(level),
              opacity: 0.5,
              fontSize: '2.5rem'
            }} 
          />
        )
      );
    }
    return (
      <Box sx={{ 
        display: 'flex', 
        gap: 0.5, 
        justifyContent: 'center',
        mt: 1
      }}>
        {stars}
      </Box>
    );
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/performance/${agentId}`);
      setPerformance(response.data);
      setError('');
    } catch (err) {
      setError('Agent not found');
      setPerformance(null);
    }
  };

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ py: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 2, 
          width: '100%',
          maxWidth: '100%',
          mx: 'auto'
        }}>
          <TextField
            fullWidth
            label="Enter Agent ID"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  }
                }
              }
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch} 
            sx={{ 
              minWidth: '120px',
              height: '56px',
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <AnalyticsIcon />
            Analyze
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 1, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {performance && (
          <Box sx={{ 
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            width: '100%',
            maxWidth: '100%',
            mx: 'auto'
          }}>
            <Box sx={{ 
              display: 'flex',
              gap: 1.5,
              width: '100%'
            }}>
              {/* Prediction Card */}
              <Card sx={{ 
                flex: 1,
                bgcolor: performance.prediction === 1 ? '#e8f5e9' : '#ffebee',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h6" gutterBottom color={performance.prediction === 1 ? 'success.main' : 'error.main'}>
                    Sales Forecast
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mt: 1,
                    mb: 1
                  }}>
                    {performance.prediction === 1 ? (
                      <TrendingUpIcon 
                        sx={{ 
                          fontSize: '3rem',
                          color: 'success.main',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }} 
                      />
                    ) : (
                      <TrendingDownIcon 
                        sx={{ 
                          fontSize: '3rem',
                          color: 'error.main',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }} 
                      />
                    )}
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: performance.prediction === 1 ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                    mt: 1
                  }}>
                    {performance.prediction === 1 ? 'Sales Expected' : 'No Sales Expected'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    {performance.prediction === 1 
                      ? 'High probability of sales in the upcoming month'
                      : 'Low probability of sales in the upcoming month'}
                  </Typography>
                </CardContent>
              </Card>

              {/* Performance Level Card */}
              <Card sx={{ 
                flex: 1,
                bgcolor: getPerformanceBgColor(performance.performance_level),
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: getPerformanceColor(performance.performance_level) }}>
                    Performance Level
                  </Typography>
                  {renderStars(performance.performance_level)}
                  <Typography variant="h4" sx={{ 
                    color: getPerformanceColor(performance.performance_level),
                    fontWeight: 'bold',
                    mt: 1
                  }}>
                    {performance.performance_level}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Current performance rating
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Recommendations Card */}
            <Card sx={{ 
              width: '100%',
              bgcolor: '#f5f5f5',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}>
              <CardContent sx={{ py: 2 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  color="text.primary" 
                  sx={{ 
                    mb: 2,
                    pb: 1.5,
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <TipsAndUpdatesIcon 
                    sx={{ 
                      color: 'primary.main',
                      fontSize: '1.75rem',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }} 
                  />
                  Recommendations
                </Typography>
                <List sx={{ 
                  '& .MuiListItem-root': {
                    py: 1,
                    px: 2,
                    mb: 1,
                    bgcolor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease-in-out',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                      '& .MuiListItemText-primary': {
                        color: 'primary.main'
                      }
                    }
                  }
                }}>
                  {performance.recommendations.map((rec, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        '&:before': {
                          content: '""',
                          display: 'inline-block',
                          width: '5px',
                          height: '5px',
                          bgcolor: 'primary.main',
                          borderRadius: '50%',
                          mr: 1.5,
                          transition: 'all 0.2s ease-in-out'
                        },
                        '&:hover:before': {
                          transform: 'scale(1.2)',
                          bgcolor: 'primary.dark'
                        }
                      }}
                    >
                      <ListItemText 
                        primary={rec} 
                        primaryTypographyProps={{
                          sx: { 
                            color: 'text.primary',
                            fontSize: '0.875rem',
                            lineHeight: 1.4,
                            fontWeight: 500,
                            transition: 'color 0.2s ease-in-out'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PredictionPage; 