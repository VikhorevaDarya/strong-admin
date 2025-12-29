/**
 * Custom Menu component with icons
 */

import React from 'react';
import { Menu as RaMenu, MenuItemLink, useSidebarState } from 'react-admin';
import { Box } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DashboardIcon from '@mui/icons-material/Dashboard';

/**
 * Custom Menu with icons
 */
export const Menu: React.FC = () => {
  const [open] = useSidebarState();

  return (
    <RaMenu>
      {/* Дашборд (опционально) */}
      <MenuItemLink
        to="/"
        primaryText="Дашборд"
        leftIcon={<DashboardIcon />}
        sx={{ display: 'none' }} // Скрыто пока нет дашборда
      />

      {/* Товары */}
      <MenuItemLink
        to="/products"
        primaryText="Товары"
        leftIcon={<InventoryIcon />}
      />

      {/* Склады */}
      <MenuItemLink
        to="/warehouses"
        primaryText="Склады"
        leftIcon={<WarehouseIcon />}
      />

      {/* Разделитель */}
      {open && (
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            my: 1,
            mx: 2,
          }}
        />
      )}

      {/* Добавьте здесь дополнительные пункты меню */}
    </RaMenu>
  );
};
