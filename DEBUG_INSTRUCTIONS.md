# Инструкция по отладке проблем с авторизацией

## Как проверить, что происходит

1. **Откройте DevTools в браузере**
   - Chrome/Edge: F12 или Ctrl+Shift+I (Cmd+Option+I на Mac)
   - Перейдите на вкладку "Console"

2. **Очистите localStorage и перезагрузите приложение**
   ```javascript
   // В консоли браузера выполните:
   localStorage.clear();
   location.reload();
   ```

3. **Войдите в систему и наблюдайте за логами**

   После входа вы должны увидеть:
   ```
   Session saved to localStorage
   checkAuth called: { hasToken: true, hasModel: true, model: {…} }
   ```

4. **Переключитесь между вкладками "Товары" и "Склады"**

   При каждом переходе вы увидите:
   ```
   checkAuth called: { hasToken: true, hasModel: true, model: {…} }
   ```

5. **Обновите страницу (F5 или Ctrl+R)**

   Вы должны увидеть:
   ```
   Session restored from localStorage
   checkAuth called: { hasToken: true, hasModel: true, model: {…} }
   ```

## Возможные проблемы и решения

### Проблема 1: "Session cleared from localStorage" появляется без причины

**Причина:** onChange срабатывает с пустыми параметрами

**Решение:** Проверьте, что PocketBase сервер запущен и доступен

```bash
# Убедитесь что PocketBase работает
./pocketbase serve
```

### Проблема 2: "checkAuth failed - redirecting to login" при переходе между вкладками

**Причина:** Token или model потеряны

**Решение:** Проверьте localStorage в DevTools

1. DevTools → Application → Storage → Local Storage → http://localhost:3000
2. Найдите ключ `pocketbase_auth`
3. Проверьте его содержимое - должен быть JSON с token и model

### Проблема 3: Ошибка "Failed to restore session" при загрузке

**Причина:** Некорректные данные в localStorage

**Решение:**
```javascript
// Очистите localStorage
localStorage.removeItem('pocketbase_auth');
location.reload();
// Войдите заново
```

### Проблема 4: 401 или 403 ошибки в Network tab

**Причина:** API Rules в PocketBase настроены неправильно

**Решение:**
1. Откройте PocketBase админку: http://127.0.0.1:8090/_/
2. Перейдите в коллекции products и warehouses
3. Вкладка "API Rules"
4. Установите для всех правил: `@request.auth.id != ""`

## Проверка работы токена

Выполните в консоли браузера после входа:

```javascript
// Проверка текущего токена
const authData = JSON.parse(localStorage.getItem('pocketbase_auth'));
console.log('Token:', authData.token);
console.log('User:', authData.model);

// Проверка что токен валиден
fetch('http://127.0.0.1:8090/api/collections/users/auth-refresh', {
  method: 'POST',
  headers: {
    'Authorization': authData.token
  }
})
.then(r => r.json())
.then(data => console.log('Token is valid:', data))
.catch(err => console.error('Token is invalid:', err));
```

## Если проблема сохраняется

Отправьте скриншот консоли со следующими действиями:

1. Очистите консоль (Clear console)
2. Войдите в систему
3. Переключитесь между вкладками 2-3 раза
4. Сделайте скриншот всех логов в консоли

Также проверьте вкладку Network:
1. DevTools → Network
2. Переключитесь между вкладками
3. Найдите запросы к `/api/collections/products` или `/api/collections/warehouses`
4. Проверьте статус ответа (должен быть 200, не 401 или 403)
