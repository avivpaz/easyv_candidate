'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  Filter,
  XCircle,
  Search
} from 'lucide-react';
import LoadingState from '@/app/components/loadingState';
import Header from './header';
import PoweredByFooter from './PoweredByFooter';

const OrganizationHome = ({ initialData }) => {
  const [organizationDetails] = useState(initialData.organizationDetails);
  const [jobs] = useState(initialData.jobs);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    workType: '',
    employmentType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filterJobs = (jobs) => {
    return jobs.filter(job => {
      const matchesLocation = !filters.location || job.location.includes(filters.location);
      const matchesWorkType = !filters.workType || job.workType === filters.workType;
      const matchesEmploymentType = !filters.employmentType || job.employmentType === filters.employmentType;

      return matchesLocation && matchesWorkType && matchesEmploymentType;
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

  if (isLoading) return <LoadingState />;
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header organizationDetails={organizationDetails} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filters Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Found {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ease-in-out hover:shadow-md group bg-white"
              style={{ 
                borderColor: `${organizationDetails?.brandColor}20` || '#1e293b20',
                color: organizationDetails?.brandColor || '#1e293b'
              }}
            >
              <Filter 
                className={`h-5 w-5 mr-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                style={{ color: organizationDetails?.brandColor || '#1e293b' }}
              />
              <span className="font-medium">Filters</span>
              {Object.values(filters).some(Boolean) && (
                <span 
                  className="ml-2 px-2 py-0.5 rounded-full text-sm"
                  style={{ 
                    backgroundColor: `${organizationDetails?.brandColor}15` || '#1e293b15',
                    color: organizationDetails?.brandColor || '#1e293b'
                  }}
                >
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filter Results</h3>
                  {Object.values(filters).some(Boolean) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 ease-in-out group hover:bg-gray-50"
                      style={{ color: organizationDetails?.brandColor || '#1e293b' }}
                    >
                      <XCircle className="h-4 w-4 mr-1.5 transition-transform duration-200 group-hover:rotate-90" />
                      Clear filters
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20"
                    style={{ 
                      borderColor: `${organizationDetails?.brandColor}20` || '#1e293b20',
                      focusRingColor: `${organizationDetails?.brandColor}40` || '#1e293b40'
                    }}
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>

                  <select
                    value={filters.workType}
                    onChange={(e) => setFilters({ ...filters, workType: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20"
                    style={{ 
                      borderColor: `${organizationDetails?.brandColor}20` || '#1e293b20',
                      focusRingColor: `${organizationDetails?.brandColor}40` || '#1e293b40'
                    }}
                  >
                    <option value="">All Work Types</option>
                    {uniqueWorkTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    value={filters.employmentType}
                    onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
                    className="w-full px-3 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20"
                    style={{ 
                      borderColor: `${organizationDetails?.brandColor}20` || '#1e293b20',
                      focusRingColor: `${organizationDetails?.brandColor}40` || '#1e293b40'
                    }}
                  >
                    <option value="">All Employment Types</option>
                    {uniqueEmploymentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No matching positions found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <Link 
                key={job._id} 
                href={`/${organizationDetails._id}/jobs/${job._id}`}
                className="block group relative"
              >
                <div 
                  className="bg-white h-full rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                  style={{
                    background: `linear-gradient(to bottom right, white, ${organizationDetails?.brandColor}05 || '#1e293b05')`
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Title with subtle hover animation */}
                    <div className="mb-6">
                      <h2
                        style={{ color: organizationDetails?.brandColor || '#1e293b' }}
                        className="text-xl font-semibold group-hover:translate-x-1 transition-transform duration-300"
                      >
                        {job.title}
                      </h2>
                    </div>

                    {/* Tags Section */}
                    <div className="mb-4">
                      {job.employmentType && (
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 mr-2"
                          style={{ 
                            backgroundColor: `${organizationDetails?.brandColor}10` || '#1e293b10',
                            color: organizationDetails?.brandColor || '#1e293b'
                          }}
                        >
                          {job.employmentType}
                        </span>
                      )}
                      {job.workType && (
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                          style={{ 
                            backgroundColor: `${organizationDetails?.brandColor}10` || '#1e293b10',
                            color: organizationDetails?.brandColor || '#1e293b'
                          }}
                        >
                          {job.workType}
                        </span>
                      )}
                    </div>

                    {/* Details with icons */}
                    <div className="mt-auto space-y-3 text-sm text-gray-600">
                      {job.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      )}
                      {job.createdAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span className="truncate">Posted {formatDate(job.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"
                    style={{ backgroundColor: organizationDetails?.brandColor || '#1e293b' }}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <PoweredByFooter/>
      </main>
    </div>
  );
};

export default OrganizationHome;