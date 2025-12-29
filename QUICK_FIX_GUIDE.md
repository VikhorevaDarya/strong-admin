# Быстрое решение проблемы "Only admins can perform this action"

## ✅ Проблема решена!

Код обновлен и теперь поддерживает автоматический вход как для администраторов, так и для обычных пользователей.

## Что было сделано

### 1. Обновлен AuthService

Система теперь использует актуальный API PocketBase:
- Вход администратора через коллекцию `_superusers` (вместо устаревшего `pb.admins`)
- Автоматический фоллбэк на обычных пользователей
- Правильное определение типа пользователя по JWT токену
- Корректное обновление токенов для обоих типов пользователей

### Логика авторизации:

```typescript
// 1. Сначала пытается войти как администратор
await pb.collection('_superusers').authWithPassword(username, password)

// 2. Если не удалось - пытается войти как обычный пользователь
await pb.collection('users').authWithPassword(username, password)
```

## Как использовать

### ✅ Вариант 1: Вход как администратор (Рекомендуется)

1. Откройте PocketBase Admin UI: http://127.0.0.1:8090/_/
2. Войдите как администратор или создайте нового
3. Используйте **эти же credentials** (email/password) в вашем приложении
4. ✅ Все работает! Администратор имеет полный доступ ко всем коллекциям

**Пример:**
- Email: `admin@example.com`
- Password: `your_admin_password`

### Вариант 2: Вход как обычный пользователь

Для использования обычных пользователей нужно изменить API Rules в PocketBase:

#### Шаг 1: Откройте PocketBase Admin UI
http://127.0.0.1:8090/_/

#### Шаг 2: Измените правила для коллекции `products`

1. Collections → products → API Rules
2. Установите следующие правила:
   ```
   listRule:   @request.auth.id != ""
   viewRule:   @request.auth.id != ""
   createRule: @request.auth.id != ""
   updateRule: @request.auth.id != ""
   deleteRule: @request.auth.id != ""
   ```

#### Шаг 3: Измените правила для коллекции `warehouses`

1. Collections → warehouses → API Rules
2. Установите те же правила:
   ```
   listRule:   @request.auth.id != ""
   viewRule:   @request.auth.id != ""
   createRule: @request.auth.id != ""
   updateRule: @request.auth.id != ""
   deleteRule: @request.auth.id != ""
   ```

#### Шаг 4: Создайте обычного пользователя

1. Collections → users → New record
2. Заполните username, email, password
3. ✅ Готово! Теперь обычные пользователи могут войти

## Проверка работы

### В консоли браузера (F12) вы увидите:

**При входе как администратор:**
```
✓ Login successful as ADMIN, session saved
✓ Session restored from localStorage (ADMIN)
✓ Token refreshed (ADMIN)
```

**При входе как обычный пользователь:**
```
⚠ Not an admin, trying regular user login...
✓ Login successful as USER, session saved
✓ Session restored from localStorage (USER)
✓ Token refreshed (USER)
```

## Запуск приложения

```bash
# Запустите PocketBase
./pocketbase serve

# В другом терминале запустите React приложение
cd client
npm start
```

Откройте http://localhost:3000 и войдите с credentials администратора из PocketBase Admin UI.

## Технические детали

### Коллекции PocketBase

1. **`_superusers`** - Встроенная коллекция администраторов
   - Полный доступ ко всем коллекциям
   - Управление через Admin UI
   - Используется для входа администраторов

2. **`users`** - Коллекция обычных пользователей
   - Настраиваемые права доступа через API Rules
   - Можно создавать через Admin UI или API
   - Используется для входа обычных пользователей

### Автоматическое определение типа

Система определяет тип пользователя по JWT токену:

```typescript
const payload = JSON.parse(atob(token.split('.')[1]));
const isAdmin = payload.type === 'admin';
```

### Автоматическое обновление токена

Токен автоматически обновляется каждые 5 минут:
- Для администраторов: `pb.collection('_superusers').authRefresh()`
- Для пользователей: `pb.collection('users').authRefresh()`

## Решение проблем

### Ошибка "Only admins can perform this action"

**Причина:** Текущий пользователь не является администратором, а коллекции требуют admin-права.

**Решение:** Используйте один из двух вариантов выше.

### Ошибка "Failed to authenticate"

**Причина:** Неверный логин или пароль.

**Решение:**
1. Проверьте credentials в PocketBase Admin UI
2. Убедитесь, что используете правильный email/password
3. Для администраторов: используйте credentials из раздела Settings → Admins

### Ошибка при обновлении токена

**Причина:** Токен устарел или невалиден.

**Решение:**
1. Выйдите из приложения (Logout)
2. Очистите localStorage в DevTools
3. Войдите снова

## API Rules - Примеры

### Полный доступ для всех авторизованных пользователей
```javascript
@request.auth.id != ""
```

### Только создатель может редактировать/удалять
```javascript
@request.auth.id = created_by
```

### Администраторы или создатель
```javascript
@request.auth.collectionName = "_superusers" || @request.auth.id = created_by
```

### Публичное чтение, авторизованное создание
```javascript
listRule: ""  // Все могут читать
viewRule: ""  // Все могут читать
createRule: "@request.auth.id != ''"  // Только авторизованные могут создавать
updateRule: "@request.auth.id = created_by"  // Только создатель может редактировать
deleteRule: "@request.auth.id = created_by"  // Только создатель может удалять
```

## Структура авторизации

```
Ввод логина/пароля
        │
        ▼
┌──────────────────────┐
│  AuthService.login() │
└──────────┬────────��──┘
           │
           ▼
    ┌─────────────────┐
    │ Попытка войти   │
    │ как ADMIN       │
    │ (_superusers)   │
    └────────┬────────┘
             │
      ┌──────▼──────┐
      │  Успешно?   │
      └──┬──────┬───┘
         │ Да   │ Нет
         │      │
         ▼      ▼
    ┌───────┐  ┌─────────────┐
    │ ADMIN │  │ Попытка     │
    │ Доступ│  │ войти как   │
    │       │  │ USER        │
    └───────┘  └──────┬──────┘
                      │
               ┌──────▼──────┐
               │  Успешно?   │
               └───┬─────────┘
                   │ Да
                   ▼
              ┌──────────┐
              │   USER   │
              │  Доступ  │
              └──────────┘
```

## Рекомендации

### Для разработки:
✅ Используйте вход как администратор - самый быстрый способ

### Для продакшена:
1. Создайте роли пользователей (поле `role` в коллекции users)
2. Настройте гранулярные API Rules
3. Администраторы только для управления системой
4. Обычные пользователи с ограниченными правами

## Готово к работе!

Приложение полностью настроено и готово к использованию:

✅ TypeScript миграция завершена
✅ Авторизация работает для админов и пользователей
✅ Используется актуальный API PocketBase (_superusers)
✅ Автоматическое обновление токена
✅ Правильная обработка ошибок
✅ Production build успешно собирается

**Просто войдите с credentials администратора из PocketBase Admin UI и начинайте работу!**
