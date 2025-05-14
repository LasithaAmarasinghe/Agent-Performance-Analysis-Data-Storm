import React from 'react';
import { Box } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Logo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        '& .logo-icon': {
          position: 'relative',
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #673ab7 0%, #9c27b0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(103, 58, 183, 0.25)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxSizing: 'border-box'
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.8rem'
          }
        }
      }}
    >
      <Box className="logo-icon">
        <AssessmentIcon />
      </Box>
    </Box>
  );
};

export default Logo; 