// services/ApiService.js
class ApiService {
  constructor() {
    this.baseUrl = '/api';
  }

  // Helper to get absolute URL for server-side requests
  getAbsoluteUrl(path) {
    if (typeof window === 'undefined') {
      // Server-side: use full URL
      const baseUrl = process.env.NEXTAUTH_URL ;
      return `${baseUrl}${path}`;
    }
    // Client-side: use relative path
    return path;
  }

  async #fetchApi(endpoint, options = {}) {
    try {
      const isFormData = options.body instanceof FormData;
      const url = this.getAbsoluteUrl(`${this.baseUrl}${endpoint}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Organization endpoints
  async getOrganizationDetails(organizationId) {
    return this.#fetchApi(`/organizations/${organizationId}`);
  }

  async getOrganizationJobs(organizationId, page = 1, limit = 10) {
    return this.#fetchApi(`/organizations/${organizationId}/jobs?page=${page}&limit=${limit}`);
  }

  async getJobDetails(jobId) {
    return this.#fetchApi(`/jobs/${jobId}`);
  }

  async submitApplication(jobId, formData) {
    return this.#fetchApi(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: formData
    });
  }

  // Server-side method uses the same fetch mechanism
  async getServerSideApi(endpoint) {
    return this.#fetchApi(endpoint);
  }
}

// Create a singleton instance
const apiService = new ApiService();

export { ApiService };
export default apiService;