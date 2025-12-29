# Обновления Strong Admin

## Изменения от 2025-12-28

### Часть 2: Адаптивная верстка

#### 7. Исправлен заезд меню за хэдер ✅

**Проблема:** Боковое меню (сайдбар) перекрывало AppBar

**Решение:** Добавлены отступы для сайдбара в `client/src/theme/theme.ts`:

```typescript
RaSidebar: {
  styleOverrides: {
    root: {
      marginTop: '64px',
      height: 'calc(100vh - 64px)',
      position: 'fixed',
      top: 0,
      '@media (max-width: 600px)': {
        marginTop: '56px',
        height: 'calc(100vh - 56px)',
      },
    },
  },
}
```

#### 8. Добавлена полная адаптивная верстка ✅

**Файлы:**
- `client/src/theme/theme.ts` - адаптивные стили
- `client/src/layout/AppBar.tsx` - адаптивный хэдер
- `client/src/resources/products/ProductList.tsx` - адаптивный список товаров
- `client/src/resources/warehouses/WarehouseList.tsx` - адаптивный список складов
- `client/src/pages/Login.tsx` - адаптивная страница входа

**Что сделано:**

1. **Адаптивный AppBar:**
   - Десктоп: Логотип 40x40 + текст
   - Мобильные: Логотип 32x32 без текста

2. **Адаптивные списки:**
   - Десктоп: Полная таблица (Datagrid)
   - Мобильные: Компактный список (SimpleList)

3. **Адаптивные таблицы:**
   - Уменьшены отступы на мобильных
   - Скрыта колонка ID на маленьких экранах
   - Уменьшен размер шрифта

4. **Адаптивные фильтры:**
   - Вертикальное расположение на мобильных
   - Полная ширина на маленьких экранах

5. **Адаптивная Login страница:**
   - Десктоп: 400px карточка
   - Мобильные: 90% ширины экрана

**Брейкпоинты:**
- Мобильные: 0-599px
- Планшеты: 600-899px
- Десктопы: 900px+

Подробная документация в файле `RESPONSIVE_DESIGN.md`

---

### Часть 1: Основные функции

### 1. Исправлен заезд контента за хэдер

**Файл:** `client/src/theme/theme.ts`

Добавлен отступ для контента, чтобы он не перекрывался с AppBar:

```typescript
RaLayout: {
  styleOverrides: {
    root: {
      '& .RaLayout-content': {
        backgroundColor: '#f8f8f8',
        paddingTop: '16px',
        marginTop: '64px', // Отступ сверху
      },
    },
  },
}
```

### 2. Убран border-radius у хэдера

**Файл:** `client/src/theme/theme.ts`

```typescript
MuiAppBar: {
  styleOverrides: {
    root: {
      backgroundColor: '#1a1a1a',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderRadius: 0, // Убран border-radius
    },
  },
}
```

### 3. Добавлены фильтры товаров

**Файл:** `client/src/resources/products/ProductList.tsx`

Добавлены удобные фильтры:

- **По типу товара** - TextInput с поиском по полю `type`
- **По складу** - ReferenceInput с выбором склада из справочника

```typescript
const ProductFilter: React.FC<Omit<FilterProps, 'children'>> = (props) => (
  <Filter {...props}>
    <TextInput label="Поиск по типу товара" source="type" alwaysOn />
    <ReferenceInput
      label="Склад"
      source="warehouse"
      reference="warehouses"
      alwaysOn
    >
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);
```

### 4. Обновлена модель товара

**Файл:** `client/src/types/pocketbase.types.ts`

Добавлены новые поля в ProductRecord:

```typescript
export interface ProductRecord extends BaseRecord {
  name: string;           // Название товара
  photo?: string;         // Фото товара
  type: string;           // Тип товара
  price: number;          // Цена
  quantity: number;       // Количество
  warehouse: string;      // ID склада (связь)
}
```

### 5. Обновлен список товаров

**Файл:** `client/src/resources/products/ProductList.tsx`

Теперь отображаются все необходимые поля:

```typescript
<Datagrid>
  <ImageField source="photo" label="Фото" />
  <TextField source="name" label="Название" />
  <TextField source="type" label="Тип товара" />
  <NumberField source="price" label="Цена" />
  <NumberField source="quantity" label="Количество" />
  <ReferenceField source="warehouse" reference="warehouses" label="Склад">
    <TextField source="name" />
  </ReferenceField>
  <EditButton label="Редактировать" />
  <DeleteButton label="Удалить" />
</Datagrid>
```

### 6. Обновлены формы создания и редактирования товаров

**Файлы:**
- `client/src/resources/products/ProductCreate.tsx`
- `client/src/resources/products/ProductEdit.tsx`

Добавлены все необходимые поля:

```typescript
<SimpleForm>
  <ImageInput source="photo" label="Фото товара">
    <ImageField source="src" title="title" />
  </ImageInput>
  <TextInput source="name" label="Название" validate={[required()]} fullWidth />
  <TextInput source="type" label="Тип товара" validate={[required()]} fullWidth />
  <NumberInput source="price" label="Цена" validate={[required()]} />
  <NumberInput source="quantity" label="Количество" validate={[required()]} />
  <ReferenceInput source="warehouse" reference="warehouses" label="Склад">
    <SelectInput optionText="name" validate={[required()]} />
  </ReferenceInput>
</SimpleForm>
```

## Структура полей товара

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| photo | Image | Фото товара | Нет |
| name | Text | Название товара | Да |
| type | Text | Тип товара | Да |
| price | Number | Цена в рублях | Да |
| quantity | Number | Количество на складе | Да |
| warehouse | Reference | Связь со складом | Да |

## Что нужно сделать в PocketBase

Необходимо обновить схему коллекции `products` в PocketBase:

1. Добавить поле `name` типа Text (required)
2. Добавить поле `photo` типа File (optional, accept только изображения)
3. Добавить поле `warehouse` типа Relation (required, связь с коллекцией `warehouses`)
4. Можно оставить старое поле `warehouse_name` для обратной совместимости

### Пример схемы в PocketBase Admin UI:

```
Коллекция: products

Поля:
- name (Text, Required)
- photo (File, Optional, Max Files: 1, Allowed Types: image/*)
- type (Text, Required)
- price (Number, Required)
- quantity (Number, Required, Default: 0)
- warehouse (Relation, Required, Collection: warehouses, Single)
- warehouse_name (Text, Optional) - deprecated
```

## Запуск приложения

```bash
cd client
npm start
```

## Сборка для продакшена

```bash
cd client
npm run build
```

## Проверка изменений

- ✅ Контент не заезжает за хэдер
- ✅ У хэдера нет border-radius
- ✅ Фильтры работают (по типу товара и по складу)
- ✅ В списке отображается фото товара (если загружено)
- ✅ В списке отображается название товара
- ✅ В списке отображается цена в рублях
- ✅ В списке отображается количество
- ✅ В списке отображается склад (через связь)
- ✅ В формах можно загрузить фото
- ✅ В формах можно выбрать склад из справочника

## Особенности работы с фото

- Фото загружается через ImageInput
- PocketBase автоматически сохраняет файл и возвращает URL
- В списке фото отображается в размере 50x50px
- Поддерживаемые форматы: PNG, JPG, JPEG, GIF, WEBP

## Следующие шаги

1. Обновить схему коллекции `products` в PocketBase Admin UI
2. Добавить тестовые данные с фотографиями
3. Проверить работу фильтров
4. Проверить создание/редактирование товаров с загрузкой фото
