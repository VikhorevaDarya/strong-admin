/**
 * Excel Import Button Component
 * Allows importing products from Excel file
 */

import React, { useState } from 'react';
import { Button, useNotify, useRefresh } from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, CircularProgress, Typography, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import { pb } from '../../api/pocketbase.client';
import { recalculateAllWarehousesCount } from '../../utils/warehouse.utils';

interface ExcelImportButtonProps {
  resource?: string;
}

export const ExcelImportButton: React.FC<ExcelImportButtonProps> = ({ resource = 'products' }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const notify = useNotify();
  const refresh = useRefresh();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      notify('Выберите файл для импорта', { type: 'warning' });
      return;
    }

    setLoading(true);

    try {
      // Читаем Excel файл
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      console.log('📊 Parsed Excel data:', jsonData);

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Импортируем каждую строку
      for (const row of jsonData) {
        try {
          const productData: any = {
            name: row['Название'] || row['name'] || '',
            type: row['Тип'] || row['type'] || 'аксессуар',
            price: parseFloat(row['Цена'] || row['price'] || '0'),
            quantity: parseInt(row['Количество'] || row['quantity'] || '0'),
          };

          // Обрабатываем склад - ищем по названию или ID
          const warehouseName = row['Склад'] || row['warehouse'];
          if (warehouseName) {
            // Пытаемся найти склад по названию
            const warehouses = await pb.collection('warehouses').getFullList({
              filter: `name~"${warehouseName}"`,
            });

            if (warehouses.length > 0) {
              productData.warehouse = warehouses[0].id;
            } else {
              // Если склад не найден, создаем новый
              const newWarehouse = await pb.collection('warehouses').create({
                name: warehouseName,
                address: 'Не указано',
                products_count: 0,
              });
              productData.warehouse = newWarehouse.id;
            }
          }

          // Создаем товар
          await pb.collection(resource).create(productData);
          successCount++;
        } catch (error: any) {
          errorCount++;
          errors.push(`Строка ${jsonData.indexOf(row) + 2}: ${error.message}`);
          console.error('Error importing row:', row, error);
        }
      }

      // Пересчитываем количество товаров на всех складах
      await recalculateAllWarehousesCount();

      // Показываем результат
      if (successCount > 0) {
        notify(`Успешно импортировано: ${successCount} товаров`, { type: 'success' });
      }
      if (errorCount > 0) {
        notify(`Ошибок при импорте: ${errorCount}`, { type: 'warning' });
        console.error('Import errors:', errors);
      }

      setOpen(false);
      setFile(null);
      refresh();
    } catch (error: any) {
      notify(`Ошибка импорта: ${error.message}`, { type: 'error' });
      console.error('Import error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        label="Импорт из Excel"
        onClick={() => setOpen(true)}
        startIcon={<UploadFileIcon />}
        sx={{
          backgroundColor: '#FF6B00',
          color: 'white',
          '&:hover': {
            backgroundColor: '#E55D00',
          },
        }}
      />

      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Импорт товаров из Excel</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Загрузите Excel файл со следующими колонками:
            </Typography>
            <Typography variant="body2" component="div" sx={{ ml: 2, mb: 2 }}>
              • <strong>Название</strong> или <strong>name</strong> - название товара<br />
              • <strong>Тип</strong> или <strong>type</strong> - тип товара (скутер/аксессуар)<br />
              • <strong>Цена</strong> или <strong>price</strong> - цена товара<br />
              • <strong>Количество</strong> или <strong>quantity</strong> - количество на складе<br />
              • <strong>Склад</strong> или <strong>warehouse</strong> - название склада
            </Typography>

            <input
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              id="excel-file-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="excel-file-input">
              <MuiButton variant="outlined" component="span" fullWidth>
                {file ? file.name : 'Выбрать файл'}
              </MuiButton>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)} disabled={loading}>
            Отмена
          </MuiButton>
          <MuiButton
            onClick={handleImport}
            variant="contained"
            disabled={!file || loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)',
            }}
          >
            {loading ? 'Импорт...' : 'Импортировать'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
