'use client';

import Link from 'next/link';
import { useState, useEffect ,use} from 'react';
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  Search, 
  Globe, 
  Linkedin, 
  XCircle,
  Filter
} from 'lucide-react';
import ApiService from '@/app/services/ApiService';
import LoadingState from '@/app/components/loadingState';
import Header from '../components/header';

export default function Home({ params }) {
  const { organizationId } = use(params);
  const [organizationDetails, setOrganizationDetails] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    workType: '',
    employmentType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!organizationId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const [orgData, jobsData] = await Promise.all([
          ApiService.getOrganizationDetails(organizationId),
          ApiService.getOrganizationJobs(organizationId)
        ]);
        
        setOrganizationDetails(orgData);
        setJobs(jobsData.jobs.filter(job => 
          job.title && job.description && job.location
        ));
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [organizationId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filterJobs = (jobs) => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = !filters.location || job.location.includes(filters.location);
      const matchesWorkType = !filters.workType || job.workType === filters.workType;
      const matchesEmploymentType = !filters.employmentType || job.employmentType === filters.employmentType;

      return matchesSearch && matchesLocation && matchesWorkType && matchesEmploymentType;
    });
  };

  const filteredJobs = filterJobs(jobs);

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const uniqueWorkTypes = [...new Set(jobs.map(job => job.workType))];
  const uniqueEmploymentTypes = [...new Set(jobs.map(job => job.employmentType))];

  const clearFilters = () => {
    setFilters({
      location: '',
      workType: '',
      employmentType: ''
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header organizationDetails={organizationDetails} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-opacity-20 transition-colors"
                style={{ 
                  focusRing: organizationDetails?.brandColor 
                }}
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-3 rounded-xl text-white transition-colors"
              style={{ backgroundColor: organizationDetails?.brandColor || '#1e293b' }}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Filters</h3>
            
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Location Filter */}
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>

                {/* Work Type Filter */}
                <select
                  value={filters.workType}
                  onChange={(e) => setFilters({ ...filters, workType: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">All Work Types</option>
                  {uniqueWorkTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {/* Employment Type Filter */}
                <select
                  value={filters.employmentType}
                  onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">All Employment Types</option>
                  {uniqueEmploymentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
            </p>
            {Object.values(filters).some(Boolean) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900">No job openings found</p>
              <p className="mt-2 text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id}>
                <Link href={`/${organizationId}/jobs/${job._id}`} className="block group">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-opacity-100 transition-all duration-200 relative overflow-hidden">
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200"
                      style={{ backgroundColor: organizationDetails?.brandColor || '#1e293b' }}
                    />
                    <div className="relative space-y-4">
                      <div>
                        <h2 
                          className="text-2xl font-semibold transition-colors"
                          style={{ color: organizationDetails?.brandColor || '#1e293b' }}
                        >
                          {job.title}
                        </h2>
                        <p className="mt-3 text-gray-600 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-gray-500 pt-2">
                        {job.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{job.location}</span>
                          </div>
                        )}
                        {job.workType && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{job.workType}</span>
                          </div>
                        )}
                        {job.createdAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">Posted {formatDate(job.createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}