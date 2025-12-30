# Проверка схемы PocketBase для отображения количества товаров

## Проблема
Количество товаров для складов не отображается в таблице.

## Решение

### 1. Проверьте поле `products_count` в PocketBase Admin

1. Откройте PocketBase Admin UI: http://127.0.0.1:8090/_/
2. Войдите с учетными данными суперпользователя
3. Перейдите в раздел **Collections** → **warehouses**
4. Убедитесь, что существует поле `products_count` со следующими параметрами:

   - **Название поля:** `products_count`
   - **Тип:** Number
   - **Required:** Нет (оставить unchecked)
   - **Min:** 0 (опционально)
   - **Default:** 0 (опционально)

### 2. Если поля нет - создайте его

**Шаги для создания поля:**

1. В таблице **warehouses** нажмите кнопку **Add Field**
2. Выберите тип **Number**
3. Заполните параметры:
   - Name: `products_count`
   - Presentable: ✅ (включите галочку)
   - Min: `0`
   - Max: (оставить пустым)
4. Нажмите **Save**

### 3. Инициализируйте значения для существующих складов

После создания поля нужно проинициализировать его для всех складов:

**Вариант A: Через PocketBase Admin UI**

1. Откройте каждый склад
2. Установите `products_count` в `0` вручную
3. Сохраните

**Вариант B: Автоматически через консоль браузера**

1. Откройте страницу складов в Strong Admin
2. Откройте консоль разработчика (F12)
3. Выполните код:

```javascript
// Импортируем функцию пересчета
const { recalculateAllWarehousesCount } = await import('./src/utils/warehouse.utils');

// Пересчитываем все склады
await recalculateAllWarehousesCount();

// Обновляем страницу
window.location.reload();
```

**Вариант C: Через скрипт в PocketBase**

Если у вас есть доступ к командной строке PocketBase, создайте миграцию:

```go
// pb_migrations/XXXXXXX_init_products_count.go
package migrations

import (
    "github.com/pocketbase/dbx"
    "github.com/pocketbase/pocketbase/daos"
    m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
    m.Register(func(db dbx.Builder) error {
        dao := daos.New(db)

        // Получаем все склады
        warehouses, err := dao.FindRecordsByExpr("warehouses")
        if err != nil {
            return err
        }

        // Инициализируем products_count = 0 для всех
        for _, warehouse := range warehouses {
            warehouse.Set("products_count", 0)
            if err := dao.SaveRecord(warehouse); err != nil {
                return err
            }
        }

        return nil
    }, func(db dbx.Builder) error {
        // Rollback
        return nil
    })
}
```

### 4. Проверка работы автоматического пересчета

После инициализации поля проверьте, что автоматический пересчет работает:

1. **Создайте новый товар** → количество на складе должно увеличиться на 1
2. **Переместите товар на другой склад** → счетчики обоих складов должны обновиться
3. **Удалите товар** → количество на складе должно уменьшиться на 1
4. **Импортируйте товары из Excel** → все склады должны пересчитаться

### 5. Отладка

Если количество все равно не отображается:

**Проверьте консоль браузера:**

1. Откройте DevTools (F12)
2. Перейдите на вкладку Network
3. Обновите страницу складов
4. Найдите запрос к `/api/collections/warehouses/records`
5. Проверьте Response - должно быть поле `products_count`

**Пример правильного ответа:**

```json
{
  "page": 1,
  "perPage": 10,
  "totalItems": 2,
  "totalPages": 1,
  "items": [
    {
      "id": "abc123",
      "name": "Главный склад",
      "address": "ул. Ленина, 1",
      "products_count": 15,
      "created": "2024-01-01 12:00:00",
      "updated": "2024-01-01 13:00:00"
    }
  ]
}
```

**Если `products_count` отсутствует в ответе:**

- Поле не создано в схеме PocketBase
- Вернитесь к шагу 1 и создайте поле

**Если `products_count` равен `null` или `0` для всех складов:**

- Поле создано, но не инициализировано
- Выполните шаг 3 для инициализации значений

### 6. Принудительный пересчет через UI

Можно добавить кнопку для ручного пересчета всех складов:

1. Откройте консоль браузера на странице складов
2. Выполните:

```javascript
// Получаем PocketBase клиент
const pb = window.pb || (await import('./src/api/pocketbase.client')).pb;

// Получаем все склады
const warehouses = await pb.collection('warehouses').getFullList();

// Пересчитываем каждый склад
for (const warehouse of warehouses) {
  const products = await pb.collection('products').getFullList({
    filter: `warehouse="${warehouse.id}"`,
  });

  await pb.collection('warehouses').update(warehouse.id, {
    products_count: products.length,
  });

  console.log(`✅ Склад "${warehouse.name}": ${products.length} товаров`);
}

console.log('✅ Пересчет завершен!');
window.location.reload();
```

## Итоговая проверка

После выполнения всех шагов:

1. ✅ Поле `products_count` существует в схеме warehouses
2. ✅ Все существующие склады имеют корректное значение `products_count`
3. ✅ При создании товара счетчик автоматически увеличивается
4. ✅ При удалении товара счетчик автоматически уменьшается
5. ✅ В таблице складов отображается количество товаров

## Дополнительная информация

Автоматический пересчет реализован в следующих файлах:

- `client/src/utils/warehouse.utils.ts` - утилиты для пересчета
- `client/src/api/services/data.service.ts` - интеграция в CRUD операции
- `client/src/components/import/ExcelImportButton.tsx` - пересчет после импорта
