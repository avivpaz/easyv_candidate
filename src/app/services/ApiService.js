// services/ApiService.js
class ApiService {
  constructor() {
    // Use environment variable for base URL, with no fallback to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!this.baseUrl) {
      console.warn('NEXT_PUBLIC_API_URL environment variable is not set');
    }
  }

  async #fetchApi(endpoint, options = {}) {
    try {
      if (!this.baseUrl) {
        throw new Error('API base URL is not configured');
      }

      const isFormData = options.body instanceof FormData;
      const url = `${this.baseUrl}/api${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Static method for handling server-side calls
  async getServerSideApi(endpoint) {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.message || `Request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Server-side API Error (${endpoint}):`, error);
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
}

const apiService = new ApiService();

export { ApiService };
export default apiService;