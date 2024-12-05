'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, use } from 'react';
import ApiService from '@/app/services/ApiService';
import { Calendar, MapPin, Briefcase, Search, Globe, Linkedin } from 'lucide-react';
import LoadingState from '@/app/components/loadingState';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header organizationDetails={organizationDetails} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="mt-4 text-gray-600 font-medium">
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
          </p>
        </div>

        <div className="grid gap-6">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900">No job openings found</p>
              <p className="mt-2 text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id}>
                <Link href={`/${organizationId}/jobs/${job._id}`} className="block group">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="relative space-y-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
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
};

