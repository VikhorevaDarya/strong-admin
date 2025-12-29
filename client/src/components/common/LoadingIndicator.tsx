import React from 'react';
import { CircularProgress, Box } from '@mui/material';

/**
 * Loading indicator component props
 */
interface LoadingIndicatorProps {
  size?: number;
  message?: string;
}

/**
 * Centered loading indicator component
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 40,
  message = 'Загрузка...'
}) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="200px"
    gap={2}
  >
    <CircularProgress size={size} />
    {message && <Box>{message}</Box>}
  </Box>
);
