'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, use } from 'react';
import ApiService from '@/app/services/ApiService';
import { Calendar, MapPin, Briefcase, Search, Globe, Linkedin } from 'lucide-react';
import LoadingState from '@/app/components/LoadingState';
import Header from '../components/header';
export default function Home({ params }) {
  const { organizationId } = use(params);
  const [organizationDetails, setOrganizationDetails] = useState(null);
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
      <Header organizationDetails={organizationDetails}></Header>

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