/**
 * Logo component - reusable company logo
 */

import React from 'react';
import { Box } from '@mui/material';

interface LogoProps {
  /**
   * Width of the logo in pixels
   */
  width?: number;
  /**
   * Height of the logo in pixels
   */
  height?: number;
  /**
   * Alt text for the logo
   */
  alt?: string;
}

/**
 * Company logo component
 */
export const Logo: React.FC<LogoProps> = ({
  width = 40,
  height = 40,
  alt = 'Strong Admin Logo',
}) => {
  // Используем process.env.PUBLIC_URL для правильного пути в production
  const logoPath = `${process.env.PUBLIC_URL}/assets/logo.png`;

  return (
    <Box
      sx={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={logoPath}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        onError={(e) => {
          console.error('Failed to load logo from:', logoPath);
          // Показываем placeholder если лого не загрузилось
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </Box>
  );
};
