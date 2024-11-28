// src/app/jobs/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';  // Import use from React
import { Building2, MapPin, Clock, Briefcase, Calendar } from 'lucide-react';

export default function JobApplication({ params }) {  // Destructure params
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submissionType, setSubmissionType] = useState('file'); // 'file' or 'text'
  const jobId = use(params).id;  // Unwrap params using React.use()

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          const errorData = await response.text(); // or response.json() if your API returns JSON errors
          console.log('Response status:', response.status);
          console.log('Error details:', errorData);
          throw new Error(errorData);
        }
        const data = await response.json();
        setJobDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Full error:', error);
        router.push('/');
      }
    };
  
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="space-y-6">
            {/* Title Skeleton */}
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"/>
            
            {/* Location Skeleton */}
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"/>
            
            {/* Description Skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"/>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"/>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"/>
            </div>
            
            {/* Skills Skeleton */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"/>
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"/>
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"/>
            </div>
            
            <div className="text-center text-gray-500">
              Loading job details...
            </div>
          </div>
        </div>
      </div>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
     // Add submission type
     formDataToSend.append('submissionType', submissionType);

     // Add CV file or text based on submission type
     if (submissionType === 'file' && file) {
       formDataToSend.append('cv', file);
     } else if (submissionType === 'text' && formData.cvText) {
       formDataToSend.append('cvText', formData.cvText);
     }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();
      if (data.success) {
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit application');
    }
  };
  // Add this function to handle file change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        setFile(selectedFile);
        // Show file name and size
        setFilePreview({
            name: selectedFile.name,
            size: (selectedFile.size / 1024 / 1024).toFixed(2) // Convert to MB
        });
        }
    };
  // Add this function to handle file removal
    const handleRemoveFile = () => {
        setFile(null);
        setFilePreview(null);
    };
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {jobDetails && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6 text-blue-600"/>
                  <h1 className="text-3xl font-bold text-gray-900">{jobDetails.title}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4"/>
                    <span>{jobDetails.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4"/>
                    <span>{jobDetails.workType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4"/>
                    <span>{jobDetails.employmentType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4"/>
                    <span>Posted {new Date(jobDetails.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
  
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              {jobDetails && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-8">
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {jobDetails.description}
                      </p>
                    </div>
  
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {jobDetails.requiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
  
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nice to Have</h3>
                      <div className="flex flex-wrap gap-2">
                        {jobDetails.niceToHaveSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
  
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-8">Apply Now</h2>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          required
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>
  
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
  
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
  
                      <div className="space-y-2">
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          id="linkedin"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        />
                      </div>
                    </div>
  
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Choose submission type:</label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio text-blue-600"
                              name="submissionType"
                              value="file"
                              checked={submissionType === 'file'}
                              onChange={(e) => setSubmissionType(e.target.value)}
                            />
                            <span className="ml-2">Upload CV</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio text-blue-600"
                              name="submissionType"
                              value="text"
                              checked={submissionType === 'text'}
                              onChange={(e) => setSubmissionType(e.target.value)}
                            />
                            <span className="ml-2">Write about yourself</span>
                          </label>
                        </div>
                      </div>
  
                      {submissionType === 'file' ? (
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                          {!filePreview ? (
                            <div className="space-y-2 text-center">
                              <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg
                                  className="mx-auto h-12 w-12"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="flex text-sm text-gray-600 justify-center">
                                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                  <span>Upload a file</span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PDF or DOC up to 10MB</p>
                            </div>
                          ) : (
                            <div className="w-full">
                              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <svg 
                                      className="h-8 w-8 text-gray-400" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {filePreview.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {filePreview.size} MB
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-4">
                                  <button
                                    type="button"
                                    onClick={() => document.querySelector('input[type="file"]').click()}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                  >
                                    Change
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="text-sm text-red-600 hover:text-red-500 font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Tell us about yourself, your experience, and why you're a good fit for this role *
                          </label>
                          <textarea
                            required
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                            rows="10"
                            value={formData.cvText}
                            onChange={(e) => setFormData({...formData, cvText: e.target.value})}
                            placeholder="Include relevant experience, skills, and achievements..."
                          />
                        </div>
                      )}
                    </div>
  
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}