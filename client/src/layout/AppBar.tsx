/**
 * Custom AppBar component with logo and branding
 */

import React from 'react';
import { AppBar as RaAppBar, TitlePortal } from 'react-admin';
import { Box, Typography, useMediaQuery, Theme } from '@mui/material';
import { Logo } from '../components/common';

/**
 * Custom AppBar with company logo
 */
export const AppBar: React.FC = () => {
  const isLargeEnough = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));

  return (
    <RaAppBar
      sx={{
        '& .RaAppBar-title': {
          flex: 1,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        },
      }}
    >
      <TitlePortal />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Логотип компании */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1.5 },
          }}
        >
          <Logo width={isLargeEnough ? 40 : 32} height={isLargeEnough ? 40 : 32} />
          {isLargeEnough && (
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: 'white',
                fontWeight: 600,
                display: { xs: 'none', md: 'block' },
              }}
            >
              Strong Admin
            </Typography>
          )}
        </Box>
      </Box>
    </RaAppBar>
  );
};
