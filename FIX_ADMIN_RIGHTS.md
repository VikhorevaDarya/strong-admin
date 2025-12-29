# Исправление прав администратора

## Проблема

Ошибка: "Only admins can perform this action" (код 403)

Это означает, что:
1. Пользователь успешно аутентифицирован (токен валиден)
2. Но коллекции требуют права администратора
3. Текущий пользователь не является администратором

## Решение 1: Создать пользователя-администратора

### Шаг 1: Откройте PocketBase Admin UI

```bash
# Убедитесь, что PocketBase запущен
./pocketbase serve
```

Откройте в браузере: http://127.0.0.1:8090/_/

### Шаг 2: Войдите как администратор

Если это первый запуск:
- Email: admin@example.com
- Пароль: (тот, что вы указали при первом запуске)

### Шаг 3: Создайте нового администратора или используйте существующего

В PocketBase Admin UI:
1. Перейдите в раздел "Settings" → "Admins"
2. Создайте нового администратора
3. Используйте эти credentials для входа в приложение

## Решение 2: Изменить API правила коллекций

Если вы хотите использовать обычных пользователей (не администраторов), нужно изменить правила доступа к коллекциям.

### Обновить правила для коллекции `warehouses`:

```javascript
// Файл: pb_migrations/1766662020_updated_warehouses.js
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cjc1f6crr4itqg")

  // Вместо требования admin прав, разрешить любому аутентифицированному пользователю
  collection.listRule = "@request.auth.id != ''"  // Любой авторизованный пользователь
  collection.viewRule = "@request.auth.id != ''"
  collection.createRule = "@request.auth.id != ''"
  collection.updateRule = "@request.auth.id != ''"
  collection.deleteRule = "@request.auth.id != ''"

  return dao.saveCollection(collection)
})
```

### Обновить правила для коллекции `products`:

```javascript
// Файл: pb_migrations/1766662039_updated_products.js
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ndqs167mvdu19ku")

  collection.listRule = "@request.auth.id != ''"
  collection.viewRule = "@request.auth.id != ''"
  collection.createRule = "@request.auth.id != ''"
  collection.updateRule = "@request.auth.id != ''"
  collection.deleteRule = "@request.auth.id != ''"

  return dao.saveCollection(collection)
})
```

### Применить изменения:

```bash
# Остановите PocketBase (Ctrl+C)
# Удалите базу данных (опционально, для чистого старта)
rm -rf pb_data/data.db

# Запустите снова
./pocketbase serve
```

## Решение 3: Изменить коллекцию пользователей для использования админов

Измените код авторизации для использования коллекции администраторов:

### Обновите `auth.service.ts`:

```typescript
// Измените COLLECTIONS.USERS на '_superusers'
public static async login(params: LoginParams): Promise<void> {
  const { username, password } = params;

  try {
    // Используйте коллекцию администраторов вместо обычных пользователей
    const authData = await pb.admins.authWithPassword(username, password);

    if (authData && pb.authStore.token && pb.authStore.model) {
      AuthStorageService.save(pb.authStore.token, pb.authStore.model as UserRecord);
      console.log('✓ Login successful as admin, session saved');
    }
  } catch (error) {
    console.error('✗ Login failed:', error);
    throw new Error('Неверный логин или пароль');
  }
}
```

### Обновите метод refresh token:

```typescript
private static startTokenRefresh(): void {
  if (this.refreshInterval) {
    clearInterval(this.refreshInterval);
  }

  this.refreshInterval = setInterval(() => {
    if (pb.authStore.token && pb.authStore.model) {
      // Используйте admin refresh вместо collection refresh
      pb.admins
        .authRefresh()
        .then(() => console.log('✓ Admin token refreshed'))
        .catch((err) => {
          console.warn('⚠ Token refresh failed:', err.message);
        });
    }
  }, TOKEN_REFRESH_INTERVAL);
}
```

## Рекомендуемый подход для продакшена

Для продакшена рекомендуется:

1. **Использовать обычных пользователей** с правилами доступа `@request.auth.id != ""`
2. **Добавить роли/права** через отдельную коллекцию или поля в пользователях
3. **Настроить более гранулярные правила** например:
   ```javascript
   // Только создатель может редактировать/удалять
   updateRule = "@request.auth.id = created_by"
   deleteRule = "@request.auth.id = created_by"

   // Или через роль
   updateRule = "@request.auth.role = 'admin' || @request.auth.id = created_by"
   ```

## Быстрое решение для разработки

Самое быстрое решение прямо сейчас:

1. Откройте http://127.0.0.1:8090/_/
2. Войдите как администратор
3. Используйте эти же credentials в вашем приложении
4. Готово!

Если вы уже создали обычного пользователя (не администратора), создайте нового пользователя-администратора через Admin UI.
