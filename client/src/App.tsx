import React from 'react';
import { Admin, Resource } from 'react-admin';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';

import dataProvider from './providers/dataProvider';
import authProvider from './providers/authProvider';
import { ProductList, ProductCreate, ProductEdit } from './resources/products';
import { WarehouseList, WarehouseCreate, WarehouseEdit } from './resources/warehouses';
import { ErrorBoundary } from './components/common';
import { Layout } from './layout';
import { Login, Dashboard } from './pages';
import { customTheme } from './theme';

/**
 * Main application component with custom theme and layout
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        layout={Layout}
        loginPage={Login}
        dashboard={Dashboard}
        theme={customTheme}
        title="Strong Admin"
      >
        <Resource
          name="products"
          list={ProductList}
          create={ProductCreate}
          edit={ProductEdit}
          icon={InventoryIcon}
          options={{ label: 'Товары' }}
        />
        <Resource
          name="warehouses"
          list={WarehouseList}
          create={WarehouseCreate}
          edit={WarehouseEdit}
          icon={WarehouseIcon}
          options={{ label: 'Склады' }}
        />
      </Admin>
    </ErrorBoundary>
  );
};

export default App;
