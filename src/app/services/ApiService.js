class ApiService {
  constructor() {
      this.baseUrl = '/api';
  }

  getAbsoluteUrl(path) {
      if (typeof window === 'undefined') {
          const baseUrl = process.env.NEXTAUTH_URL;
          return baseUrl ? `${baseUrl}${path}` : path;
      }
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
          
          const data = await response.json();
          
          if (!response.ok) {
              return {
                  error: data.error || 'API request failed',
                  status: response.status
              };
          }

          return { data };
      } catch (error) {
          console.error(`API Error (${endpoint}):`, error);
          return {
              error: 'An unexpected error occurred',
              status: 500
          };
      }
  }

  // Organization endpoints with error handling
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

  async getServerSideApi(endpoint) {
      return this.#fetchApi(endpoint);
  }
}

const apiService = new ApiService();
export { ApiService };
export default apiService;