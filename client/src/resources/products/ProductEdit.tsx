import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  ImageInput,
  ImageField,
  ReferenceInput,
  SelectInput,
} from 'react-admin';

/**
 * Product edit component
 */
export const ProductEdit: React.FC = () => (
  <Edit redirect="list">
    <SimpleForm>
      <ImageInput source="photo" label="Фото товара" accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="name" label="Название" validate={[required()]} fullWidth />
      <SelectInput
        source="type"
        label="Тип товара"
        choices={[
          { id: 'скутер', name: 'Скутер' },
          { id: 'аксессуар', name: 'Аксессуар' },
        ]}
        validate={[required()]}
        fullWidth
      />
      <NumberInput source="price" label="Цена" validate={[required()]} />
      <NumberInput source="quantity" label="Количество" validate={[required()]} />
      <ReferenceInput source="warehouse" reference="warehouses" label="Склад">
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
