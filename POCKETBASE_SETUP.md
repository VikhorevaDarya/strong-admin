# Инструкция по настройке PocketBase

## Шаг 1: Запуск PocketBase

1. Откройте терминал в корневой директории проекта
2. Запустите PocketBase:
```bash
./pocketbase serve
```

3. Откройте админ-панель PocketBase в браузере: http://127.0.0.1:8090/_/

## Шаг 2: Создание администратора

При первом запуске PocketBase попросит создать администратора:
- Email: ваш email
- Password: ваш пароль (минимум 8 символов)

## Шаг 3: Создание коллекций

### Коллекция 1: `products` (Товары)

1. Нажмите "New collection"
2. Выберите "Base collection"
3. Заполните настройки:
   - **Name**: `products`
   - **Type**: Base collection

4. Создайте следующие поля (нажмите "+ New field"):

#### Поле 1: type (Тип товара)
- **Type**: Text
- **Name**: `type`
- **Options**:
  - ✓ Required
  - Min length: 1
  - Max length: можно оставить пустым

#### Поле 2: price (Стоимость)
- **Type**: Number
- **Name**: `price`
- **Options**:
  - ✓ Required
  - Min: 0
  - Max: можно оставить пустым

#### Поле 3: quantity (Количество)
- **Type**: Number
- **Name**: `quantity`
- **Options**:
  - ✓ Required
  - Min: 0
  - Max: можно оставить пустым

#### Поле 4: warehouse_name (Название склада)
- **Type**: Text
- **Name**: `warehouse_name`
- **Options**:
  - Min length: можно оставить пустым
  - Max length: можно оставить пустым

5. Настройте права доступа (вкладка "API Rules"):
   - **List/Search rule**: `@request.auth.id != ""`
   - **View rule**: `@request.auth.id != ""`
   - **Create rule**: `@request.auth.id != ""`
   - **Update rule**: `@request.auth.id != ""`
   - **Delete rule**: `@request.auth.id != ""`

6. Нажмите "Create"

---

### Коллекция 2: `warehouses` (Склады)

1. Нажмите "New collection"
2. Выберите "Base collection"
3. Заполните настройки:
   - **Name**: `warehouses`
   - **Type**: Base collection

4. Создайте следующие поля:

#### Поле 1: name (Название склада)
- **Type**: Text
- **Name**: `name`
- **Options**:
  - ✓ Required
  - Min length: 1
  - Max length: можно оставить пустым

#### Поле 2: address (Адрес)
- **Type**: Text
- **Name**: `address`
- **Options**:
  - ✓ Required
  - Min length: 1
  - Max length: можно оставить пустым

#### Поле 3: products_count (Количество товаров)
- **Type**: Number
- **Name**: `products_count`
- **Options**:
  - Min: 0
  - Max: можно оставить пустым
  - Default: 0

5. Настройте права доступа (вкладка "API Rules"):
   - **List/Search rule**: `@request.auth.id != ""`
   - **View rule**: `@request.auth.id != ""`
   - **Create rule**: `@request.auth.id != ""`
   - **Update rule**: `@request.auth.id != ""`
   - **Delete rule**: `@request.auth.id != ""`

6. Нажмите "Create"

---

## Шаг 4: Создание тестового пользователя (опционально)

Если хотите создать дополнительных пользователей для входа в админку:

1. Перейдите в коллекцию "users"
2. Нажмите "+ New record"
3. Заполните:
   - **username**: имя пользователя
   - **email**: email пользователя
   - **password**: пароль (минимум 8 символов)
   - **passwordConfirm**: повторите пароль
4. Нажмите "Create"

---

## Шаг 5: Добавление тестовых данных (опционально)

### Добавить товары:

1. Перейдите в коллекцию "products"
2. Нажмите "+ New record"
3. Пример записи:
   - type: "Ноутбук"
   - price: 50000
   - quantity: 10
   - warehouse_name: "Склад №1"
4. Добавьте несколько записей

### Добавить склады:

1. Перейдите в коллекцию "warehouses"
2. Нажмите "+ New record"
3. Пример записи:
   - name: "Склад №1"
   - address: "Москва, ул. Примерная, д. 1"
   - products_count: 5
4. Добавьте несколько записей

---

## Готово!

Теперь вы можете запустить клиентское приложение:

```bash
cd client
npm start
```

Войдите в админку используя email и пароль пользователя из коллекции "users".

---

## Структура данных

### products
```
{
  "id": "автоматически",
  "type": "string (обязательно)",
  "price": "number (обязательно)",
  "quantity": "number (обязательно)",
  "warehouse_name": "string",
  "created": "автоматически",
  "updated": "автоматически"
}
```

### warehouses
```
{
  "id": "автоматически",
  "name": "string (обязательно)",
  "address": "string (обязательно)",
  "products_count": "number",
  "created": "автоматически",
  "updated": "автоматически"
}
```
