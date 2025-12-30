/**
 * Dashboard Page
 * Main statistics page showing products and warehouses overview
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Box, Typography, CircularProgress } from '@mui/material';
import { Title } from 'react-admin';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { pb } from '../api/pocketbase.client';

interface DashboardStats {
  totalProducts: number;
  totalWarehouses: number;
  totalInventoryValue: number;
  totalQuantity: number;
  productsByType: { type: string; count: number }[];
  warehouseStats: { name: string; productsCount: number; address: string }[];
}

/**
 * Stat Card Component
 */
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)` }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6" color="white" sx={{ opacity: 0.9, fontSize: '0.9rem', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" color="white" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: 'white', opacity: 0.8 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

/**
 * Dashboard Component
 */
export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Получаем все товары
        const products = await pb.collection('products').getFullList({
          fields: 'id,type,price,quantity,warehouse',
        });

        // Получаем все склады
        const warehouses = await pb.collection('warehouses').getFullList({
          fields: 'id,name,address,products_count',
        });

        // Подсчитываем статистику
        const totalProducts = products.length;
        const totalWarehouses = warehouses.length;

        // Общая стоимость товаров
        const totalInventoryValue = products.reduce((sum, product) => {
          return sum + (product.price || 0) * (product.quantity || 0);
        }, 0);

        // Общее количество товаров
        const totalQuantity = products.reduce((sum, product) => {
          return sum + (product.quantity || 0);
        }, 0);

        // Статистика по типам товаров
        const typeMap = new Map<string, number>();
        products.forEach((product) => {
          const type = product.type || 'Без типа';
          typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });

        const productsByType = Array.from(typeMap.entries()).map(([type, count]) => ({
          type,
          count,
        }));

        // Статистика по складам
        const warehouseStats = warehouses.map((warehouse) => ({
          name: warehouse.name,
          productsCount: warehouse.products_count || 0,
          address: warehouse.address,
        }));

        setStats({
          totalProducts,
          totalWarehouses,
          totalInventoryValue,
          totalQuantity,
          productsByType,
          warehouseStats,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} sx={{ color: '#FF6B00' }} />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">
          Не удалось загрузить статистику
        </Typography>
      </Box>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Title title="Дашборд" />

      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Дашборд
      </Typography>

      {/* Основная статистика */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title="Всего товаров"
          value={stats.totalProducts}
          icon={<InventoryIcon sx={{ fontSize: 48 }} />}
          color="#FF6B00"
        />
        <StatCard
          title="Всего складов"
          value={stats.totalWarehouses}
          icon={<WarehouseIcon sx={{ fontSize: 48 }} />}
          color="#1a1a1a"
        />
        <StatCard
          title="Общее количество"
          value={stats.totalQuantity}
          icon={<TrendingUpIcon sx={{ fontSize: 48 }} />}
          color="#4CAF50"
        />
        <StatCard
          title="Общая стоимость"
          value={formatCurrency(stats.totalInventoryValue)}
          icon={<AttachMoneyIcon sx={{ fontSize: 48 }} />}
          color="#2196F3"
        />
      </Box>

      {/* Статистика по типам товаров */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
          },
          gap: 3,
        }}
      >
        <Box>
          <Card>
            <CardHeader
              title="Статистика по типам товаров"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              sx={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)',
                color: 'white',
              }}
            />
            <CardContent>
              {stats.productsByType.length > 0 ? (
                <Box>
                  {stats.productsByType.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2,
                        borderBottom: index < stats.productsByType.length - 1 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                        {item.type}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {item.count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({((item.count / stats.totalProducts) * 100).toFixed(1)}%)
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">Нет данных</Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Статистика по складам */}
        <Box>
          <Card>
            <CardHeader
              title="Статистика по складам"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              sx={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                color: 'white',
              }}
            />
            <CardContent>
              {stats.warehouseStats.length > 0 ? (
                <Box>
                  {stats.warehouseStats.map((warehouse, index) => (
                    <Box
                      key={index}
                      sx={{
                        py: 2,
                        borderBottom: index < stats.warehouseStats.length - 1 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {warehouse.name}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {warehouse.productsCount}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        {warehouse.address}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">Нет складов</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
