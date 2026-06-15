import { apiClient } from '../client/apiClient';

/**
 * BaseService
 * Premium generic service wrapper for standard HTTP CRUD resource operations.
 */
export class BaseService {
  constructor(resourcePath) {
    this.resourcePath = resourcePath; // e.g. '/users' or '/trading/strategies'
  }

  /**
   * Fetch all records (with optional query parameters)
   */
  async getAll(params = {}) {
    const queryString = Object.keys(params).length
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return apiClient.get(`${this.resourcePath}${queryString}`);
  }

  /**
   * Fetch a single record by ID
   */
  async getById(id) {
    return apiClient.get(`${this.resourcePath}/${id}`);
  }

  /**
   * Create a new record
   */
  async create(data) {
    return apiClient.post(this.resourcePath, data);
  }

  /**
   * Update an existing record completely
   */
  async update(id, data) {
    return apiClient.put(`${this.resourcePath}/${id}`, data);
  }

  /**
   * Update a record partially
   */
  async patch(id, data) {
    return apiClient.patch(`${this.resourcePath}/${id}`, data);
  }

  /**
   * Delete a record by ID
   */
  async delete(id) {
    return apiClient.delete(`${this.resourcePath}/${id}`);
  }
}
