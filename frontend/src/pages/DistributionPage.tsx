import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Distribution {
  performance_distribution: Record<string, number>;
  prediction_distribution: Record<string, number>;
}

const DistributionPage = () => {
  const [distributions, setDistributions] = useState<Distribution | null>(null);

  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        const [performanceRes, predictionRes] = await Promise.all([
          axios.get('http://localhost:8000/performance-distribution'),
          axios.get('http://localhost:8000/prediction-distribution')
        ]);

        setDistributions({
          performance_distribution: performanceRes.data.performance_distribution,
          prediction_distribution: predictionRes.data.prediction_distribution
        });
      } catch (error) {
        console.error('Error fetching distributions:', error);
      }
    };

    fetchDistributions();
  }, []);

  const performanceData = {
    labels: distributions ? Object.keys(distributions.performance_distribution) : [],
    datasets: [
      {
        data: distributions ? Object.values(distributions.performance_distribution) : [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
      },
    ],
  };

  const predictionData = {
    labels: ['Low', 'High'],
    datasets: [
      {
        label: 'Number of Agents',
        data: distributions ? [
          distributions.prediction_distribution['0'] || 0,
          distributions.prediction_distribution['1'] || 0
        ] : [0, 0],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Performance Distributions
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Level Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <Pie data={performanceData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Prediction Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar 
                data={predictionData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DistributionPage; 