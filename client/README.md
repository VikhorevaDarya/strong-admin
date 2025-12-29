# Админ-панель для управления товарами и складами

Админ-панель на React Admin с авторизацией и управлением товарами и складами.

## Возможности

- Авторизация через PocketBase
- Управление товарами (CRUD операции)
  - Тип товара
  - Стоимость
  - Количество
  - Наличие по складам
- Управление складами (CRUD операции)
  - Название склада
  - Адрес
  - Поиск по товарам в наличии
- Фильтрация и поиск

## Установка и запуск

### 1. Запуск PocketBase (бэкенд)

В корневой директории проекта:

```bash
./pocketbase serve
```

PocketBase будет доступен по адресу: http://127.0.0.1:8090

### 2. Настройка PocketBase

1. Откройте админ-панель PocketBase: http://127.0.0.1:8090/_/
2. Создайте администратора (email + пароль)
3. Создайте 2 коллекции (New collection → Base collection):

**Коллекция "products":**
| Поле | Тип | Настройки |
|------|-----|-----------|
| type | Text | Required ✓ |
| price | Number | Required ✓, Min: 0 |
| quantity | Number | Required ✓, Min: 0 |
| warehouse_name | Text | - |

**API Rules для products:** Все правила (List/View/Create/Update/Delete) установите: `@request.auth.id != ""`

**Коллекция "warehouses":**
| Поле | Тип | Настройки |
|------|-----|-----------|
| name | Text | Required ✓ |
| address | Text | Required ✓ |
| products_count | Number | Min: 0, Default: 0 |

**API Rules для warehouses:** Все правила (List/View/Create/Update/Delete) установите: `@request.auth.id != ""`

📖 **Подробная инструкция:** См. файл [POCKETBASE_SETUP.md](../POCKETBASE_SETUP.md) в корне проекта

### 3. Запуск клиентской части

```bash
cd client
npm install
npm start
```

Приложение откроется по адресу: http://localhost:3000

## Структура проекта

```
client/
├── src/
│   ├── providers/
│   │   ├── authProvider.js      # Провайдер авторизации
│   │   └── dataProvider.js      # Провайдер данных для PocketBase
│   ├── resources/
│   │   ├── products/
│   │   │   ├── ProductList.js   # Список товаров
│   │   │   ├── ProductCreate.js # Создание товара
│   │   │   ├── ProductEdit.js   # Редактирование товара
│   │   │   └── index.js
│   │   └── warehouses/
│   │       ├── WarehouseList.js  # Список складов
│   │       ├── WarehouseCreate.js # Создание склада
│   │       ├── WarehouseEdit.js  # Редактирование склада
│   │       └── index.js
│   └── App.js                    # Главный компонент
```

## Использование

1. Войдите в систему, используя учетные данные PocketBase
2. Используйте навигационное меню для переключения между разделами "Товары" и "Склады"
3. Создавайте, редактируйте и удаляйте записи
4. Используйте фильтры для поиска

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
