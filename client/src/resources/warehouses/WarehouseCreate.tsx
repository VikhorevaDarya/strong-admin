import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';

/**
 * Warehouse create component
 */
export const WarehouseCreate: React.FC = () => (
  <Create redirect="list">
    <SimpleForm>
      <TextInput source="name" label="Название склада" validate={[required()]} />
      <TextInput source="address" label="Адрес" validate={[required()]} />
    </SimpleForm>
  </Create>
);
