/**
 * Data Service
 * Handles CRUD operations with PocketBase collections
 */

import { pb } from '../pocketbase.client';
import { EXPAND_CONFIG } from '../../config/pocketbase.config';
import type {
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  GetManyParams,
  GetManyResult,
  GetManyReferenceParams,
  GetManyReferenceResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  UpdateManyParams,
  UpdateManyResult,
  DeleteParams,
  DeleteResult,
  DeleteManyParams,
  DeleteManyResult,
  Filter,
} from '../../types/react-admin.types';

/**
 * Data service for PocketBase operations
 */
export class DataService {
  /**
   * Get list of records with pagination, sorting, and filtering
   */
  public static async getList<T>(resource: string, params: GetListParams): Promise<GetListResult<T>> {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filter = params.filter;

    const filterStr = this.buildFilterString(filter);
    const sortStr = `${order === 'DESC' ? '-' : ''}${field}`;
    const expand = this.getExpandForResource(resource);

    const records = await pb.collection(resource).getList(page, perPage, {
      sort: sortStr,
      filter: filterStr,
      expand,
      // Запрашиваем все поля явно
      fields: '*',
    });

    return {
      data: records.items.map((item) => ({ ...item, id: item.id } as T)),
      total: records.totalItems,
    };
  }

  /**
   * Get a single record by ID
   */
  public static async getOne<T>(resource: string, params: GetOneParams): Promise<GetOneResult<T>> {
    const expand = this.getExpandForResource(resource);

    const record = await pb.collection(resource).getOne(params.id.toString(), {
      expand,
      fields: '*',
    });

    // Для products преобразуем photo в формат, понятный React Admin
    if (resource === 'products' && record.photo) {
      const photoUrl = pb.files.getUrl(record, record.photo);
      (record as any).photo = {
        src: photoUrl,
        title: record.photo,
      };
    }

    return {
      data: { ...record, id: record.id } as T,
    };
  }

  /**
   * Get multiple records by IDs
   */
  public static async getMany<T>(resource: string, params: GetManyParams): Promise<GetManyResult<T>> {
    const filterStr = params.ids.map((id) => `id="${id}"`).join(' || ');
    const expand = this.getExpandForResource(resource);

    const records = await pb.collection(resource).getFullList({
      filter: filterStr,
      expand,
      fields: '*',
    });

    return {
      data: records.map((item) => ({ ...item, id: item.id } as T)),
    };
  }

  /**
   * Get records that reference another record
   */
  public static async getManyReference<T>(
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult<T>> {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const sortStr = `${order === 'DESC' ? '-' : ''}${field}`;
    const filterStr = `${params.target}="${params.id}"`;
    const expand = this.getExpandForResource(resource);

    const records = await pb.collection(resource).getList(page, perPage, {
      sort: sortStr,
      filter: filterStr,
      expand,
      fields: '*',
    });

    return {
      data: records.items.map((item) => ({ ...item, id: item.id } as T)),
      total: records.totalItems,
    };
  }

  /**
   * Create a new record
   */
  public static async create<T>(resource: string, params: CreateParams<T>): Promise<CreateResult<T>> {
    // Очищаем данные перед отправкой
    const cleanData = this.cleanDataForSubmit(resource, params.data);

    // Логируем данные для отладки
    console.log('🔍 Creating record:', resource);
    console.log('📦 Original data:', params.data);
    console.log('✨ Clean data:', cleanData);

    const record = await pb.collection(resource).create(cleanData);

    console.log('✅ Created record:', record);

    return {
      data: { ...record, id: record.id } as T,
    };
  }

  /**
   * Update an existing record
   */
  public static async update<T>(resource: string, params: UpdateParams<T>): Promise<UpdateResult<T>> {
    // Очищаем данные перед отправкой
    const cleanData = this.cleanDataForSubmit(resource, params.data);
    const record = await pb.collection(resource).update(params.id.toString(), cleanData);

    return {
      data: { ...record, id: record.id } as T,
    };
  }

  /**
   * Update multiple records
   */
  public static async updateMany<T>(resource: string, params: UpdateManyParams<T>): Promise<UpdateManyResult> {
    // Очищаем данные перед отправкой
    const cleanData = this.cleanDataForSubmit(resource, params.data);
    const records = await Promise.all(
      params.ids.map((id) => pb.collection(resource).update(id.toString(), cleanData))
    );

    return {
      data: records.map((record) => record.id),
    };
  }

  /**
   * Delete a record
   */
  public static async delete<T>(resource: string, params: DeleteParams<T>): Promise<DeleteResult<T>> {
    await pb.collection(resource).delete(params.id.toString());

    return {
      data: params.previousData as T,
    };
  }

  /**
   * Delete multiple records
   */
  public static async deleteMany(resource: string, params: DeleteManyParams): Promise<DeleteManyResult> {
    await Promise.all(params.ids.map((id) => pb.collection(resource).delete(id.toString())));

    return {
      data: params.ids,
    };
  }

  /**
   * Build filter string from filter object
   */
  private static buildFilterString(filter: Filter): string {
    if (!filter || Object.keys(filter).length === 0) {
      return '';
    }

    // Поля связей (relations) - используем точное совпадение
    const relationFields = ['warehouse', 'user', 'category'];

    return Object.entries(filter)
      .map(([key, value]) => {
        // Для полей связей используем точное совпадение
        if (relationFields.includes(key)) {
          return `${key}="${value}"`;
        }
        // Для текстовых полей используем поиск по подстроке
        if (typeof value === 'string') {
          return `${key}~"${value}"`;
        }
        // Для остальных типов - точное совпадение
        return `${key}="${value}"`;
      })
      .join(' && ');
  }

  /**
   * Get expand configuration for a resource
   */
  private static getExpandForResource(resource: string): string | undefined {
    return EXPAND_CONFIG[resource as keyof typeof EXPAND_CONFIG];
  }

  /**
   * Clean data before submitting to PocketBase
   * Removes deprecated or computed fields and processes file uploads
   */
  private static cleanDataForSubmit(resource: string, data: any): any {
    const cleanedData = { ...data };

    // Общие поля для удаления
    delete cleanedData.expand; // Служебное поле React Admin
    delete cleanedData.collectionId; // Служебное поле PocketBase
    delete cleanedData.collectionName; // Служебное поле PocketBase
    delete cleanedData.created; // Служебное поле PocketBase
    delete cleanedData.updated; // Служебное поле PocketBase

    // Для коллекции products удаляем устаревшие поля
    if (resource === 'products') {
      delete cleanedData.warehouse_name; // Устаревшее поле (используется warehouse)
      delete cleanedData.products_count; // Вычисляемое поле

      // Обрабатываем загрузку фото
      if (cleanedData.photo) {
        if (cleanedData.photo.rawFile) {
          // Новая загрузка - извлекаем File объект
          cleanedData.photo = cleanedData.photo.rawFile;
        } else if (typeof cleanedData.photo === 'object' && cleanedData.photo.src) {
          // Уже загруженное фото - удаляем, чтобы не обновлять
          // (PocketBase сохранит старое фото)
          delete cleanedData.photo;
        } else if (typeof cleanedData.photo === 'string') {
          // Уже строка (имя файла) - удаляем, чтобы не обновлять
          delete cleanedData.photo;
        }
      }
    }

    // Для коллекции warehouses
    if (resource === 'warehouses') {
      delete cleanedData.products_count; // Вычисляемое поле
    }

    return cleanedData;
  }
}
