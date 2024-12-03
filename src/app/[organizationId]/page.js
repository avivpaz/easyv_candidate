'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, use } from 'react';
import ApiService from '@/app/services/ApiService';
import { Calendar, MapPin, Briefcase, Search, Globe, Linkedin } from 'lucide-react';
import LoadingState from '@/app/components/LoadingState';

export default function Home({ params }) {
  const { organizationId } = use(params);
  const [organization, setOrganization] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
        
        setOrganization(orgData);
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

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-6 mb-8">
            {organization?.logoUrl && (
              <div className="flex-shrink-0">
                {/* <Image
                  src={organization.logoUrl}
                  alt={`${organization.name} logo`}
                  width={100}
                  height={100}
                  className="rounded-lg object-contain"
                /> */}
              </div>
            )}
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {organization?.name}
                  </h1>
                  <p className="mt-2 text-gray-600 max-w-3xl">
                    {organization?.description}
                  </p>
                </div>
                <div className="flex gap-3">
                  {organization?.website && (
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Visit website"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {organization?.linkedinUrl && (
                    <a
                      href={organization.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Visit LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
          </p>
        </div>

        <div className="grid gap-6">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-600 shadow-sm border border-gray-200">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium">No job openings found</p>
              <p className="mt-1 text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id}>
              <Link href={`/${organizationId}/jobs/${job._id}`} className="block group">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h2>
                          <p className="mt-2 text-gray-600 line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                  
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                        {job.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.workType && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span>{job.workType}</span>
                          </div>
                        )}
                        {job.createdAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>Posted {formatDate(job.createdAt)}</span>
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