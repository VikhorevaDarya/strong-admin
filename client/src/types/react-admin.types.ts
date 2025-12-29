/**
 * React Admin Types
 * Type definitions for React Admin data provider and auth provider
 */

/**
 * Pagination parameters
 */
export interface Pagination {
  page: number;
  perPage: number;
}

/**
 * Sort parameters
 */
export interface Sort {
  field: string;
  order: 'ASC' | 'DESC';
}

/**
 * Filter parameters - can be any object with string or number values
 */
export type Filter = Record<string, string | number | boolean>;

/**
 * GetList parameters
 */
export interface GetListParams {
  pagination: Pagination;
  sort: Sort;
  filter: Filter;
}

/**
 * GetList result
 */
export interface GetListResult<T> {
  data: T[];
  total: number;
}

/**
 * GetOne parameters
 */
export interface GetOneParams {
  id: string | number;
}

/**
 * GetOne result
 */
export interface GetOneResult<T> {
  data: T;
}

/**
 * GetMany parameters
 */
export interface GetManyParams {
  ids: (string | number)[];
}

/**
 * GetMany result
 */
export interface GetManyResult<T> {
  data: T[];
}

/**
 * GetManyReference parameters
 */
export interface GetManyReferenceParams {
  target: string;
  id: string | number;
  pagination: Pagination;
  sort: Sort;
  filter: Filter;
}

/**
 * GetManyReference result
 */
export interface GetManyReferenceResult<T> {
  data: T[];
  total: number;
}

/**
 * Create parameters
 */
export interface CreateParams<T> {
  data: Partial<T>;
}

/**
 * Create result
 */
export interface CreateResult<T> {
  data: T;
}

/**
 * Update parameters
 */
export interface UpdateParams<T> {
  id: string | number;
  data: Partial<T>;
  previousData?: T;
}

/**
 * Update result
 */
export interface UpdateResult<T> {
  data: T;
}

/**
 * UpdateMany parameters
 */
export interface UpdateManyParams<T> {
  ids: (string | number)[];
  data: Partial<T>;
}

/**
 * UpdateMany result
 */
export interface UpdateManyResult {
  data: (string | number)[];
}

/**
 * Delete parameters
 */
export interface DeleteParams<T> {
  id: string | number;
  previousData?: T;
}

/**
 * Delete result
 */
export interface DeleteResult<T> {
  data: T;
}

/**
 * DeleteMany parameters
 */
export interface DeleteManyParams {
  ids: (string | number)[];
}

/**
 * DeleteMany result
 */
export interface DeleteManyResult {
  data: (string | number)[];
}

/**
 * Data Provider interface
 */
export interface DataProvider {
  getList: <T = any>(resource: string, params: GetListParams) => Promise<GetListResult<T>>;
  getOne: <T = any>(resource: string, params: GetOneParams) => Promise<GetOneResult<T>>;
  getMany: <T = any>(resource: string, params: GetManyParams) => Promise<GetManyResult<T>>;
  getManyReference: <T = any>(resource: string, params: GetManyReferenceParams) => Promise<GetManyReferenceResult<T>>;
  create: <T = any>(resource: string, params: CreateParams<T>) => Promise<CreateResult<T>>;
  update: <T = any>(resource: string, params: UpdateParams<T>) => Promise<UpdateResult<T>>;
  updateMany: <T = any>(resource: string, params: UpdateManyParams<T>) => Promise<UpdateManyResult>;
  delete: <T = any>(resource: string, params: DeleteParams<T>) => Promise<DeleteResult<T>>;
  deleteMany: (resource: string, params: DeleteManyParams) => Promise<DeleteManyResult>;
}

/**
 * Login parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * User identity
 */
export interface UserIdentity {
  id: string | number;
  fullName?: string;
  avatar?: string;
}

/**
 * Auth Provider interface
 */
export interface AuthProvider {
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  checkError: (error: any) => Promise<void>;
  getIdentity: () => Promise<UserIdentity>;
  getPermissions: () => Promise<any>;
}
