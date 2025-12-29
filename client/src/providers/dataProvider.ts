/**
 * React Admin Data Provider
 * Integrates DataService with React Admin
 */

import { DataService } from '../api/services';
import { pb } from '../api/pocketbase.client';
import type { DataProvider as RADataProvider } from 'react-admin';

/**
 * Data provider implementation for React Admin
 */
const dataProvider: RADataProvider = {
  /**
   * Get list of records
   */
  getList: async (resource, params) => {
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;
    const field = params.sort?.field || 'id';
    const order = params.sort?.order || 'ASC';
    const filter = params.filter || {};

    return DataService.getList(resource, {
      pagination: { page, perPage },
      sort: { field, order },
      filter,
    });
  },

  /**
   * Get a single record
   */
  getOne: async (resource, params) => {
    return DataService.getOne(resource, { id: params.id });
  },

  /**
   * Get multiple records
   */
  getMany: async (resource, params) => {
    return DataService.getMany(resource, { ids: params.ids });
  },

  /**
   * Get records with reference
   */
  getManyReference: async (resource, params) => {
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;
    const field = params.sort?.field || 'id';
    const order = params.sort?.order || 'ASC';

    return DataService.getManyReference(resource, {
      target: params.target,
      id: params.id,
      pagination: { page, perPage },
      sort: { field, order },
      filter: params.filter,
    });
  },

  /**
   * Create a new record
   */
  create: async (resource, params) => {
    return DataService.create(resource, { data: params.data });
  },

  /**
   * Update a record
   */
  update: async (resource, params) => {
    return DataService.update(resource, {
      id: params.id,
      data: params.data,
      previousData: params.previousData,
    });
  },

  /**
   * Update multiple records
   */
  updateMany: async (resource, params) => {
    return DataService.updateMany(resource, {
      ids: params.ids,
      data: params.data,
    });
  },

  /**
   * Delete a record
   */
  delete: async (resource, params) => {
    return DataService.delete(resource, {
      id: params.id,
      previousData: params.previousData,
    });
  },

  /**
   * Delete multiple records
   */
  deleteMany: async (resource, params) => {
    return DataService.deleteMany(resource, { ids: params.ids });
  },
};

export default dataProvider;
export { pb };
