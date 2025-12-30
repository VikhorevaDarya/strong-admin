/**
 * Warehouse utility functions
 * Handles automatic product count updates
 */

import { pb } from '../api/pocketbase.client';

/**
 * Update products count and products names for a warehouse
 * Calculates the sum of all product quantities and creates a comma-separated list of product names
 */
export const updateWarehouseProductsCount = async (warehouseId: string): Promise<void> => {
  try {
    // Получаем все товары на этом складе с полями quantity и name
    const products = await pb.collection('products').getFullList({
      filter: `warehouse="${warehouseId}"`,
      fields: 'id,quantity,name',
    });

    // Суммируем quantity всех товаров
    const totalQuantity = products.reduce((sum, product) => {
      return sum + (product.quantity || 0);
    }, 0);

    // Создаем строку с названиями товаров через запятую
    const productsNames = products
      .map((product) => product.name || 'Без названия')
      .filter(Boolean)
      .join(', ');

    // Обновляем склад
    await pb.collection('warehouses').update(warehouseId, {
      products_count: totalQuantity,
      products_name: productsNames,
    });

    console.log(`✅ Updated warehouse ${warehouseId}: ${totalQuantity} total quantity, ${products.length} products`);
  } catch (error) {
    console.error('Error updating warehouse products count:', error);
  }
};

/**
 * Update products count for multiple warehouses
 */
export const updateMultipleWarehousesCount = async (warehouseIds: string[]): Promise<void> => {
  const uniqueIds = [...new Set(warehouseIds)]; // Убираем дубликаты

  for (const warehouseId of uniqueIds) {
    if (warehouseId) {
      await updateWarehouseProductsCount(warehouseId);
    }
  }
};

/**
 * Recalculate all warehouses products count
 */
export const recalculateAllWarehousesCount = async (): Promise<void> => {
  try {
    const warehouses = await pb.collection('warehouses').getFullList({
      fields: 'id',
    });

    for (const warehouse of warehouses) {
      await updateWarehouseProductsCount(warehouse.id);
    }

    console.log(`✅ Recalculated products count for ${warehouses.length} warehouses`);
  } catch (error) {
    console.error('Error recalculating warehouses count:', error);
  }
};
