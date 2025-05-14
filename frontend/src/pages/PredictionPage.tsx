import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

interface AgentPerformance {
  agent_code: string;
  prediction: number;
  performance_level: string;
  recommendations: string[];
}

const PredictionPage = () => {
  const [agentId, setAgentId] = useState('');
  const [performance, setPerformance] = useState<AgentPerformance | null>(null);
  const [error, setError] = useState('');

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
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Agent Performance Lookup
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="Enter Agent ID"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {performance && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Agent Performance Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              Agent Code: {performance.agent_code}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Prediction: {performance.prediction === 1 ? 'High' : 'Low'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Performance Level: {performance.performance_level}
            </Typography>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Recommendations:
            </Typography>
            <List>
              {performance.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PredictionPage; 