// services/ApiService.js
class ApiService {
    constructor() {
      this.baseUrl = '/api';
    }
  
    async #fetchApi(endpoint, options = {}) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, options);
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'API request failed');
        }
  
        return data;
      } catch (error) {
        console.error(`API Error: ${endpoint}`, error);
        throw error;
      }
    }
  
    // Organization endpoints
    async getOrganizationDetails(organizationId) {
      return this.#fetchApi(`/organizations/${organizationId}`);
    }
  
    // Jobs endpoints
    async getOrganizationJobs(organizationId, page = 1, limit = 10) {
      return this.#fetchApi(`/organizations/${organizationId}/jobs?page=${page}&limit=${limit}`);
    }
  
    async getJobDetails( jobId) {
      return this.#fetchApi(`/jobs/${jobId}`);
    }
  
    async submitApplication( jobId, file) {
      const formData = new FormData();
      formData.append('cv', file);
  
      return this.#fetchApi(`/jobs/${jobId}/apply`, {
        method: 'POST',
        body: formData
      });
    }
  }
  
  export default new ApiService();
