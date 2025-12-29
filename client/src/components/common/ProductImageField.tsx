/**
 * Custom Image Field for Product Photos
 * Converts PocketBase file name to full URL
 */

import React from 'react';
import { useRecordContext } from 'react-admin';
import { Box } from '@mui/material';
import { pb } from '../../api/pocketbase.client';

interface ProductImageFieldProps {
  source?: string;
  label?: string;
  sx?: any;
}

/**
 * Product Image Field Component
 * Displays product photo from PocketBase storage
 */
export const ProductImageField: React.FC<ProductImageFieldProps> = ({
  source = 'photo',
  sx = {}
}) => {
  const record = useRecordContext();

  if (!record || !record[source]) {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '10px',
          textAlign: 'center',
          padding: '4px',
          lineHeight: 1.2,
          ...sx
        }}
      >
        Нет фото
      </Box>
    );
  }

  // Получаем URL файла из PocketBase
  const imageUrl = pb.files.getUrl(record, record[source]);

  return (
    <Box sx={{ width: 50, height: 50, ...sx }}>
      <img
        src={imageUrl}
        alt={record.name || 'Product'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
        onError={(e) => {
          // Если изображение не загрузилось, показываем placeholder
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </Box>
  );
};
