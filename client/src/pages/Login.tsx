/**
 * Custom Login page with branding
 */

import React from 'react';
import { Login as RaLogin, LoginForm } from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Logo } from '../components/common';

/**
 * Custom Login page
 */
export const Login: React.FC = () => {
  return (
    <RaLogin
      sx={{
        backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #FF6B00 100%)',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .RaLogin-card': {
          marginTop: 0,
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        },
      }}
    >
      <Card
        sx={{
          minWidth: { xs: '90%', sm: 300 },
          maxWidth: { xs: '90%', sm: 400 },
          width: '100%',
        }}
      >
        <CardContent
          sx={{
            padding: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
            {/* Логотип компании */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: { xs: 2, sm: 3 },
              }}
            >
              {/* Ваш логотип */}
              <Box sx={{ mb: 2 }}>
                <Logo width={100} height={100} />
              </Box>

              {/* Название компании */}
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5,
                }}
              >
                Strong Admin
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                Панель управления
              </Typography>
            </Box>

            {/* Форма входа */}
            <LoginForm />

            {/* Дополнительная информация */}
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Войдите используя учетные данные администратора
              </Typography>
            </Box>
        </CardContent>
      </Card>
    </RaLogin>
  );
};
