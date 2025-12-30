/**
 * PocketBase Collection Types
 * Auto-generated type definitions for PocketBase collections
 */

/**
 * Base record interface that all PocketBase records extend
 */
export interface BaseRecord {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

/**
 * Product record type
 */
export interface ProductRecord extends BaseRecord {
  name: string;
  photo?: string;
  type: string;
  price: number;
  quantity: number;
  warehouse: string; // Reference to warehouse ID
  warehouse_name?: string; // Deprecated field, kept for backward compatibility
}

/**
 * Warehouse record type
 */
export interface WarehouseRecord extends BaseRecord {
  name: string;
  address: string;
  products_count: number;
  products_name?: string; // Comma-separated list of product names
}

/**
 * User record type (PocketBase auth collection)
 */
export interface UserRecord extends BaseRecord {
  username: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  avatar?: string;
}

/**
 * PocketBase collection names
 */
export enum CollectionName {
  PRODUCTS = 'products',
  WAREHOUSES = 'warehouses',
  USERS = 'users',
}

/**
 * Expanded relations type
 */
export interface ExpandedRelations {
  products?: ProductRecord[];
  warehouses?: WarehouseRecord[];
  warehouse_stocks?: WarehouseRecord[];
}

/**
 * Product with expanded relations
 */
export type ProductWithRelations = ProductRecord & {
  expand?: ExpandedRelations;
};

/**
 * Warehouse with expanded relations
 */
export type WarehouseWithRelations = WarehouseRecord & {
  expand?: ExpandedRelations;
};

/**
 * Generic record with possible expansions
 */
export type RecordWithExpand<T extends BaseRecord> = T & {
  expand?: ExpandedRelations;
};
