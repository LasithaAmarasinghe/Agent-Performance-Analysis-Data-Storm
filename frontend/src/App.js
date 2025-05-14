import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box, ThemeProvider } from '@mui/material';
import PredictionPage from './pages/PredictionPage';
import DistributionPage from './pages/DistributionPage';
import Background from './components/Background';
import Logo from './components/Logo';
import theme from './theme';
import './App.css';

function NavButtons() {
  const location = useLocation();
  
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button 
        component={Link} 
        to="/distribution"
        className={location.pathname === '/distribution' ? 'active' : ''}
        sx={{ 
          color: '#ede7f6',
          fontWeight: 600,
          fontSize: '0.9rem',
          letterSpacing: '0.3px',
          px: 3,
          py: 1.2,
          borderRadius: '10px',
          textTransform: 'none',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '0%',
            height: '2px',
            bgcolor: '#5e35b1',
            transform: 'translateX(-50%)',
            transition: 'width 0.2s ease',
          },
          '&:hover': {
            transform: 'scale(1.05)',
            '&::before': {
              width: '80%'
            }
          },
          '&.active': {
            color: 'white',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              bgcolor: '#4527a0',
              boxShadow: '0 2px 4px rgba(103, 58, 183, 0.4)'
            },
            '&:hover': {
              '&::after': {
                bgcolor: '#311b92'
              }
            }
          }
        }}
      >
        Overall Performance
      </Button>
      <Button 
        component={Link} 
        to="/"
        className={location.pathname === '/' ? 'active' : ''}
        sx={{ 
          color: '#ede7f6',
          fontWeight: 600,
          fontSize: '0.9rem',
          letterSpacing: '0.3px',
          px: 3,
          py: 1.2,
          borderRadius: '10px',
          textTransform: 'none',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '0%',
            height: '2px',
            bgcolor: '#5e35b1',
            transform: 'translateX(-50%)',
            transition: 'width 0.2s ease',
          },
          '&:hover': {
            transform: 'scale(1.05)',
            '&::before': {
              width: '80%'
            }
          },
          '&.active': {
            color: 'white',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              bgcolor: '#4527a0',
              boxShadow: '0 2px 4px rgba(103, 58, 183, 0.4)'
            },
            '&:hover': {
              '&::after': {
                bgcolor: '#311b92'
              }
            }
          }
        }}
      >
        Agent Performance
      </Button>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Background>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar 
              position="fixed" 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease'
              }}
            >
              <Toolbar sx={{ 
                px: { xs: 2, sm: 3, md: 4 },
                height: { xs: 64, sm: 72 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2.5
                  }}
                >
                  <Logo />
                  <Typography 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      color: '#ede7f6',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1.5rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    Agent Performance Analytics
                  </Typography>
                </Box>
                <NavButtons />
              </Toolbar>
            </AppBar>
            <Container sx={{ 
              mt: { xs: 3, sm: 3.5 },
              px: { xs: 2, sm: 3 },
              maxWidth: '100% !important'
            }}>
              <Routes>
                <Route path="/" element={<PredictionPage />} />
                <Route path="/distribution" element={<DistributionPage />} />
              </Routes>
            </Container>
          </Box>
        </Background>
      </Router>
    </ThemeProvider>
  );
}

export default App;
