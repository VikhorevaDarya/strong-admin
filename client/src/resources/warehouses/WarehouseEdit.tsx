import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';

/**
 * Warehouse edit component
 */
export const WarehouseEdit: React.FC = () => (
  <Edit redirect="list">
    <SimpleForm>
      <TextInput source="name" label="Название склада" validate={[required()]} />
      <TextInput source="address" label="Адрес" validate={[required()]} />
    </SimpleForm>
  </Edit>
);
