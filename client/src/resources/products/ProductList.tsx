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
  ReferenceInput,
  SelectInput,
  ReferenceField,
  SimpleList,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin';
import { useMediaQuery, Theme } from '@mui/material';
import { ProductImageField } from '../../components/common';
import { ExcelImportButton } from '../../components/import';

/**
 * Product filter component
 */
const ProductFilter: React.FC<Omit<FilterProps, 'children'>> = (props) => (
  <Filter {...props}>
    <TextInput label="Поиск по типу товара" source="type" alwaysOn />
    <ReferenceInput
      label="Склад"
      source="warehouse"
      reference="warehouses"
      alwaysOn
    >
      <SelectInput optionText="name" label="Склад" />
    </ReferenceInput>
  </Filter>
);

/**
 * Product list actions with import button
 */
const ProductListActions: React.FC = () => (
  <TopToolbar>
    <ExcelImportButton />
    <CreateButton label="Создать" />
    <ExportButton label="Экспорт" />
  </TopToolbar>
);

/**
 * Product list component with responsive design
 */
export const ProductList: React.FC = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <List filters={<ProductFilter />} actions={<ProductListActions />}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => `${record.type} • ${record.quantity} шт.`}
          tertiaryText={(record) =>
            new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(record.price)
          }
          linkType="edit"
        />
      ) : (
        <Datagrid>
          <ProductImageField source="photo" label="Фото" />
          <TextField source="name" label="Название" />
          <TextField source="type" label="Тип товара" />
          <NumberField source="price" label="Цена" options={{ style: 'currency', currency: 'RUB' }} />
          <NumberField source="quantity" label="Количество" />
          <ReferenceField source="warehouse" reference="warehouses" label="Склад">
            <TextField source="name" />
          </ReferenceField>
          <EditButton label="Редактировать" />
          <DeleteButton label="Удалить" />
        </Datagrid>
      )}
    </List>
  );
};
