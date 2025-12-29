# Исправление ошибки 403: Only admins can perform this action

## Проблема

При попытке создать товар или склад появляется ошибка:
```
ClientResponseError 403: Only admins can perform this action.
```

## Причина

API Rules в коллекциях PocketBase настроены на доступ только для админов, а вы вошли как обычный пользователь из коллекции "users".

## Решение 1: Изменить API Rules (Рекомендуется)

### Для коллекции "products":

1. Откройте PocketBase админку: http://127.0.0.1:8090/_/
2. Перейдите в коллекцию **"products"**
3. Вкладка **"API Rules"**
4. Установите следующие правила:

```
List/Search rule:   @request.auth.id != ""
View rule:          @request.auth.id != ""
Create rule:        @request.auth.id != ""
Update rule:        @request.auth.id != ""
Delete rule:        @request.auth.id != ""
```

Эти правила означают: **любой авторизованный пользователь** может выполнять операции.

### Для коллекции "warehouses":

Повторите те же шаги:

1. Перейдите в коллекцию **"warehouses"**
2. Вкладка **"API Rules"**
3. Установите те же правила:

```
List/Search rule:   @request.auth.id != ""
View rule:          @request.auth.id != ""
Create rule:        @request.auth.id != ""
Update rule:        @request.auth.id != ""
Delete rule:        @request.auth.id != ""
```

4. Нажмите **"Save"**

---

## Решение 2: Войти как администратор

Если вы хотите ограничить доступ только для админов:

### Вариант A: Использовать существующего админа

1. В форме входа используйте email и пароль **администратора PocketBase** (который вы создали при первом запуске)
2. Это НЕ пользователь из коллекции "users", а администратор системы

### Вариант B: Сделать пользователя администратором

1. Откройте PocketBase админку
2. Перейдите в коллекцию **"users"**
3. Найдите вашего пользователя
4. **НЕТ** - в PocketBase нельзя сделать обычного пользователя админом через коллекцию

---

## Решение 3: Создать коллекцию "admins" (Расширенное)

Если нужен отдельный функционал для админов:

### Шаг 1: Создайте коллекцию "admins"

1. New collection → **Auth collection**
2. Name: `admins`
3. Создайте поля как для обычных пользователей

### Шаг 2: Измените authProvider.js

```javascript
login: async ({ username, password }) => {
  try {
    // Попробуйте войти как admin
    const authData = await pb.collection('admins').authWithPassword(username, password);

    if (authData && pb.authStore.token && pb.authStore.model) {
      localStorage.setItem('pocketbase_auth', JSON.stringify({
        token: pb.authStore.token,
        model: pb.authStore.model,
      }));
      console.log('Login successful, session saved');
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error('Неверный логин или пароль'));
  }
},
```

### Шаг 3: Измените API Rules

Для коллекций products и warehouses:

```
Create rule:  @request.auth.collectionName = "admins"
Update rule:  @request.auth.collectionName = "admins"
Delete rule:  @request.auth.collectionName = "admins"
```

---

## Рекомендация

**Используйте Решение 1** - это самый простой способ.

Измените API Rules на `@request.auth.id != ""` для всех операций в обеих коллекциях.

После изменения:
1. Очистите localStorage: `localStorage.clear()`
2. Перезагрузите страницу
3. Войдите заново
4. Попробуйте создать товар или склад

---

## Проверка API Rules

После изменения правил проверьте их:

1. Откройте DevTools → Network
2. Попробуйте создать товар
3. Найдите запрос к `/api/collections/products/records`
4. Проверьте статус:
   - ✅ **200** или **201** - успешно
   - ❌ **403** - правила всё ещё неверные
   - ❌ **401** - не авторизованы

---

## Текущие vs Правильные правила

### ❌ НЕПРАВИЛЬНО (вызывает 403):
```
Create rule: @request.auth.id = ""
или
Create rule: (пусто/не установлено)
```

### ✅ ПРАВИЛЬНО:
```
Create rule: @request.auth.id != ""
```

Знак `!=` означает "НЕ равно", то есть пользователь ДОЛЖЕН быть авторизован (id не пустой).
