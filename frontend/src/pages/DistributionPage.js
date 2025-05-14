import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import axios from 'axios';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DistributionPage = () => {
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      borderWidth: 1,
    }]
  });

  const [predictionData, setPredictionData] = useState({
    labels: ['No Sales Expected', 'Sales Expected'],
    datasets: [{
      label: 'Number of Agents',
      data: [0, 0],
      backgroundColor: ['#f44336', '#4caf50'],
      borderWidth: 1,
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [performanceRes, predictionRes] = await Promise.all([
          axios.get('http://localhost:8000/performance-distribution'),
          axios.get('http://localhost:8000/prediction-distribution')
        ]);

        const performanceDist = performanceRes.data.performance_distribution;
        setPerformanceData(prev => ({
          ...prev,
          labels: Object.keys(performanceDist),
          datasets: [{
            ...prev.datasets[0],
            data: Object.values(performanceDist)
          }]
        }));

        const predictionDist = predictionRes.data.prediction_distribution;
        setPredictionData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: [predictionDist[0] || 0, predictionDist[1] || 0]
          }]
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        py: 2
      }}>
        <Box sx={{ 
          display: 'flex',
          gap: 3,
          width: '100%'
        }}>
          {/* Performance Distribution Card */}
          <Card sx={{ 
            flex: 1,
            bgcolor: '#f5f5f5',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3
            }
          }}>
            <CardContent sx={{ py: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                color="text.primary" 
                sx={{ 
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  gap: 1
                }}
              >
                <EmojiEventsIcon 
                  sx={{ 
                    color: 'primary.main',
                    fontSize: '1.75rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }} 
                />
                Performance Level Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie 
                  data={performanceData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }} 
                />
              </Box>
              <Box sx={{ 
                mt: 2, 
                pt: 2, 
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'center',
                gap: 3
              }}>
                {performanceData.labels.map((label, index) => (
                  <Box key={label} sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: performanceData.datasets[0].backgroundColor[index],
                        fontWeight: 600
                      }}
                    >
                      {performanceData.datasets[0].data[index]}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: performanceData.datasets[0].backgroundColor[index],
                        opacity: 0.8
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Prediction Distribution Card */}
          <Card sx={{ 
            flex: 1,
            bgcolor: '#f5f5f5',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3
            }
          }}>
            <CardContent sx={{ py: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                color="text.primary" 
                sx={{ 
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  gap: 1
                }}
              >
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <TrendingUpIcon 
                    sx={{ 
                      color: '#4caf50',
                      fontSize: '1.5rem',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }} 
                  />
                  <TrendingDownIcon 
                    sx={{ 
                      color: '#f44336',
                      fontSize: '1.5rem',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }} 
                  />
                </Box>
                Sales Forecast Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={predictionData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        },
                        title: {
                          display: true,
                          text: 'Number of Agents',
                          font: {
                            size: 12,
                            weight: 'bold'
                          }
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Sales Forecast',
                          font: {
                            size: 12,
                            weight: 'bold'
                          }
                        }
                      }
                    }
                  }} 
                />
              </Box>
              <Box sx={{ 
                mt: 2, 
                pt: 2, 
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'center',
                gap: 3
              }}>
                {predictionData.labels.map((label, index) => (
                  <Box key={label} sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: predictionData.datasets[0].backgroundColor[index],
                        fontWeight: 600
                      }}
                    >
                      {predictionData.datasets[0].data[index]}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: predictionData.datasets[0].backgroundColor[index],
                        opacity: 0.8
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default DistributionPage; 