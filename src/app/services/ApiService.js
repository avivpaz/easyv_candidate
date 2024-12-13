// services/ApiService.js
class ApiService {
  constructor() {
    // Use environment variable for base URL if available, otherwise use relative path
    this.baseUrl = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
      : '/api';
  }


  async #fetchApi(endpoint, options = {}) {
    try {
      // Check if we're sending FormData
      const isFormData = options.body instanceof FormData;
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          // Only set Content-Type if we're not sending FormData
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      });
      
      const data = await response.json();

      if (data.error) {
        return data;
      }

      if (!response.ok) {
        throw new Error('API request failed');
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

  async getJobDetails(jobId) {
    return this.#fetchApi(`/jobs/${jobId}`);
  }

  async submitApplication(jobId, formData) {
    const options = {
      method: 'POST',
      body: formData,
      // No need to set headers for FormData
    };
    return this.#fetchApi(`/jobs/${jobId}/apply`, options);
  }

  // Static method for handling server-side calls
   async getServerSideApi(endpoint) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api${endpoint}`);
    return response.json();
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Export both the instance and the class for different use cases
export { ApiService };
export default apiService;