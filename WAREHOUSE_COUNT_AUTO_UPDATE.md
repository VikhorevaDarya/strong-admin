# Автоматический подсчет товаров на складах

## Что реализовано

Система автоматически обновляет поля `products_count` и `products_name` у складов при любых операциях с товарами.

**Обновляемые поля:**

1. **`products_count`** - сумма quantity всех товаров на складе (не количество позиций!)
2. **`products_name`** - список названий товаров через запятую

**Пример:**
- Товар "Скутер A": quantity = 5
- Товар "Скутер B": quantity = 10
- Товар "Аксессуар": quantity = 3

**Результат:**
- `products_count` = 5 + 10 + 3 = **18**
- `products_name` = "Скутер A, Скутер B, Аксессуар"

## Когда происходит обновление

### 1. Создание товара
При создании нового товара автоматически пересчитывается количество товаров на указанном складе.

**Файл:** `client/src/api/services/data.service.ts:148-150`

```typescript
// Автоматически обновляем счетчик товаров на складе
if (resource === 'products' && record.warehouse) {
  await updateWarehouseProductsCount(record.warehouse);
}
```

### 2. Обновление товара
При обновлении товара пересчитывается количество на **обоих** складах:
- Старом складе (если товар перемещен)
- Новом складе

**Файл:** `client/src/api/services/data.service.ts:172-183`

```typescript
// Автоматически обновляем счетчик товаров на складе
if (resource === 'products') {
  const warehousesToUpdate = new Set<string>();

  // Обновляем старый склад (если товар переместили)
  if (oldWarehouse) warehousesToUpdate.add(oldWarehouse);

  // Обновляем новый склад
  if (record.warehouse) warehousesToUpdate.add(record.warehouse);

  await updateMultipleWarehousesCount(Array.from(warehousesToUpdate));
}
```

### 3. Удаление товара
При удалении товара пересчитывается количество на складе, где находился товар.

**Файл:** `client/src/api/services/data.service.ts:217-220`

```typescript
// Автоматически обновляем счетчик товаров на складе
if (resource === 'products' && warehouseId) {
  await updateWarehouseProductsCount(warehouseId);
}
```

### 4. Массовое удаление
При удалении нескольких товаров пересчитывается количество на всех затронутых складах.

**Файл:** `client/src/api/services/data.service.ts:243-246`

```typescript
// Автоматически обновляем счетчики товаров на складах
if (resource === 'products' && warehouseIds.length > 0) {
  await updateMultipleWarehousesCount(warehouseIds);
}
```

### 5. Импорт из Excel
После импорта товаров из Excel файла пересчитывается количество товаров на **всех** складах.

**Файл:** `client/src/components/import/ExcelImportButton.tsx:93-94`

```typescript
// Пересчитываем количество товаров на всех складах
await recalculateAllWarehousesCount();
```

## Утилиты для подсчета

**Файл:** `client/src/utils/warehouse.utils.ts`

### updateWarehouseProductsCount(warehouseId)
Пересчитывает сумму quantity всех товаров для одного склада.

```typescript
export const updateWarehouseProductsCount = async (warehouseId: string): Promise<void> => {
  // Получаем все товары на этом складе с полем quantity
  const products = await pb.collection('products').getFullList({
    filter: `warehouse="${warehouseId}"`,
    fields: 'id,quantity',
  });

  // Суммируем quantity всех товаров
  const totalQuantity = products.reduce((sum, product) => {
    return sum + (product.quantity || 0);
  }, 0);

  // Обновляем склад
  await pb.collection('warehouses').update(warehouseId, {
    products_count: totalQuantity,
  });

  console.log(`✅ Updated warehouse ${warehouseId}: ${totalQuantity} total quantity`);
};
```

### updateMultipleWarehousesCount(warehouseIds)
Пересчитывает количество товаров для нескольких складов (убирает дубликаты).

```typescript
export const updateMultipleWarehousesCount = async (warehouseIds: string[]): Promise<void> => {
  const uniqueIds = [...new Set(warehouseIds)];

  for (const warehouseId of uniqueIds) {
    if (warehouseId) {
      await updateWarehouseProductsCount(warehouseId);
    }
  }
};
```

### recalculateAllWarehousesCount()
Пересчитывает количество товаров для **всех** складов в системе.

```typescript
export const recalculateAllWarehousesCount = async (): Promise<void> => {
  const warehouses = await pb.collection('warehouses').getFullList({
    fields: 'id',
  });

  for (const warehouse of warehouses) {
    await updateWarehouseProductsCount(warehouse.id);
  }

  console.log(`✅ Recalculated products count for ${warehouses.length} warehouses`);
};
```

## Логирование

В консоли браузера можно увидеть:
- `✅ Updated warehouse {id}: {count} products` - при обновлении отдельного склада
- `✅ Recalculated products count for {count} warehouses` - при пересчете всех складов

## Важные детали

1. **Оптимизация запросов:** При обновлении товара используется `Set` для исключения дубликатов и избежания повторных запросов к одному складу.

2. **Безопасность:** Все функции обрабатывают ошибки с помощью try-catch и логируют их в консоль.

3. **Прозрачность:** Пользователю не нужно ничего делать - все происходит автоматически при любых операциях с товарами.

4. **Корректность данных:** Система гарантирует, что `products_count` всегда соответствует реальной сумме quantity всех товаров на складе.

## Тестирование

Чтобы убедиться, что автоматический подсчет работает:

1. Откройте список складов и обратите внимание на `products_count`
2. Создайте новый товар с quantity=10 → счетчик склада должен увеличиться на 10
3. Измените quantity товара с 10 на 20 → счетчик склада должен увеличиться на 10
4. Переместите товар (quantity=20) на другой склад → счетчики обоих складов должны обновиться (-20 на старом, +20 на новом)
5. Удалите товар с quantity=20 → счетчик склада должен уменьшиться на 20
6. Импортируйте товары из Excel → все счетчики должны пересчитаться

## Производительность

- Создание/обновление/удаление одного товара: +1 дополнительный запрос к PocketBase
- Импорт N товаров из Excel: +1 запрос на склад (не на товар!)
- Все запросы выполняются асинхронно и не блокируют UI

## Возможные улучшения

1. **Батчинг:** Группировать обновления складов при массовых операциях
2. **Оптимистичные обновления:** Обновлять UI сразу, не дожидаясь ответа от сервера
3. **Кеширование:** Кешировать кол��чество товаров на клиенте для быстрого отображения
