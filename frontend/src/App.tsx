import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import PredictionPage from './pages/PredictionPage';
import DistributionPage from './pages/DistributionPage';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Agent Performance Dashboard
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Prediction
            </Button>
            <Button color="inherit" component={Link} to="/distribution">
              Distribution
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<PredictionPage />} />
            <Route path="/distribution" element={<DistributionPage />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App; 