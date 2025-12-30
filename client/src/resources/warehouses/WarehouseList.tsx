import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  Filter,
  TextInput,
  FilterProps,
  SimpleList,
} from 'react-admin';
import { useMediaQuery, Theme } from '@mui/material';

/**
 * Warehouse filter component
 */
const WarehouseFilter: React.FC<Omit<FilterProps, 'children'>> = (props) => (
  <Filter {...props}>
    <TextInput label="Поиск по названию" source="name" alwaysOn />
    <TextInput label="Поиск по товару" source="products" />
  </Filter>
);

/**
 * Warehouse list component with responsive design
 */
export const WarehouseList: React.FC = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <List filters={<WarehouseFilter />}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => record.address}
          tertiaryText={(record) => `Товаров: ${record.products_count || 0}`}
          linkType="edit"
        />
      ) : (
        <Datagrid>
          <TextField source="id" label="ID" />
          <TextField source="name" label="Название склада" />
          <TextField source="address" label="Адрес" />
          <NumberField source="products_count" label="Количество товаров" emptyText="0" />
          <EditButton label="Редактировать" />
          <DeleteButton label="Удалить" />
        </Datagrid>
      )}
    </List>
  );
};
