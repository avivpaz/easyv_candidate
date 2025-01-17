'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  Calendar, 
  ArrowLeft, 
  AlertCircle,
  Check ,
  Banknote
} from 'lucide-react';
import ApiService from '@/app/services/ApiService';
import LoadingState from '@/app/components/loadingState';
import Header from './header';
import Link from 'next/link';
import PoweredByFooter from './PoweredByFooter';

const JobApplication = ({ initialData }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [organizationDetails, setOrganizationDetails] = useState(initialData?.organizationDetails || null);
  const [jobDetails, setJobDetails] = useState(initialData?.jobDetails || null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    cvText: '',
    updates: false,
    terms: false
  });
  
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submissionType, setSubmissionType] = useState('file');
  const [dragActive, setDragActive] = useState(false);
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const params = useParams();
  const jobId = params.id;
  const organizationId = params.organizationId;

  useEffect(() => {
    const fetchData = async () => {
      if (initialData) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        if (!organizationId || !jobId) {
          throw new Error('Missing required parameters');
        }

        const [orgData, jobsData] = await Promise.all([
          ApiService.getOrganizationDetails(organizationId),
          ApiService.getJobDetails(jobId)
        ]);

        setOrganizationDetails(orgData);
        setJobDetails(jobsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId, organizationId, initialData]);

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a PDF, DOC, or DOCX file'
      };
    }
    
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size should be less than 5MB'
      };
    }
    
    return {
      isValid: true,
      error: null
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (submissionType === 'file') {
      if (!file) {
        setError('Please upload your CV');
        return;
      }
      const validation = validateFile(file);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }
    }
    
    if (submissionType === 'text' && !formData.cvText.trim()) {
      setError('Please provide information about yourself');
      return;
    }
    
    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    formDataToSend.append('submissionType', submissionType);
    formDataToSend.append('terms', formData.terms);
  
    try {
      if (submissionType === 'file' && file) {
        formDataToSend.append('cv', file);
      } 
      const response = await ApiService.submitApplication(jobId, formDataToSend);
      
      if (response.error === 'cv_duplication') {
        setError('cv_duplication');
        return;
      }
    
      setIsSubmitted(true);
    } catch (error) {
      if (error.message === 'cv_duplication') {  // This line is problematic
        setError('cv_duplication');
      }
      else {
        setError('Failed to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmissionTypeChange = (newType) => {
    setSubmissionType(newType);
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

 const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  const droppedFile = e.dataTransfer.files?.[0];
  if (droppedFile) {
    const validation = validateFile(droppedFile);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    
    setFile(droppedFile);
    setFilePreview({
      name: droppedFile.name,
      size: (droppedFile.size / 1024 / 1024).toFixed(2)
    });
    setError(null);
  }
};
// Update the handleFileChange function
const handleFileChange = (e) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    const validation = validateFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    
    setFile(selectedFile);
    setFilePreview({
      name: selectedFile.name,
      size: (selectedFile.size / 1024 / 1024).toFixed(2)
    });
    setError(null);
  }
};

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const AlreadyAppliedMessage = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Already Applied</h2>
        <p className="text-gray-600 mb-6">
          You have already submitted an application for this position. 
          We appreciate your interest!
        </p>
        <Link
          href={`/${organizationId}`}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: organizationDetails?.brandColor || '#1e293b' }}
        >
          View Other Positions
        </Link>
      </div>
    </div>
  );

  const LoadingSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-4 rounded-full animate-spin mb-4"
          style={{ 
            borderColor: `${organizationDetails?.brandColor}20` || '#1e293b20',
            borderTopColor: organizationDetails?.brandColor || '#1e293b'
          }}
        />
        <h3 className="text-lg font-medium text-gray-900">Submitting your application...</h3>
        <p className="text-gray-500 mt-2">Please wait while we process your submission.</p>
      </div>
    </div>
  );

  const SuccessMessage = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Thank You for Your Application!</h2>
      <p className="text-gray-600 mb-8">
        We've received your application for the {jobDetails?.title} position. 
        Our team will review your application and get back to you soon.
      </p>
      <Link 
        href={`/${organizationId}`}
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: organizationDetails?.brandColor || '#1e293b' }}
      >
        View More Jobs
      </Link>
    </div>
  );

  if (isLoading) return <LoadingState />;



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header organizationDetails={organizationDetails} />
      <main className="max-w-7xl mx-auto px-4 py-4">
      {/* <div className="mb-8">
          <Link 
            href={`/${organizationId}`}
            className={`
              inline-flex items-center px-4 py-2 rounded-lg
              border-2 transition-all duration-200 ease-in-out
              hover:shadow-md group
            `}
            style={{ 
              borderColor: `${organizationDetails?.brandColor}20` || '#1e293b20',
              backgroundColor: 'white'
            }}
          >
            <ArrowLeft 
              className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" 
              style={{ color: organizationDetails?.brandColor || '#1e293b' }}
            />
            <span 
              className="font-medium"
              style={{ color: organizationDetails?.brandColor || '#1e293b' }}
            >
              View All Jobs
            </span>
          </Link>
        </div> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            {jobDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-24">
                <div className="p-6 space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h2 
                      className="text-2xl font-bold mb-2"
                      style={{ color: organizationDetails?.brandColor || '#1e293b' }}
                    >
                      {jobDetails.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                  {jobDetails.location && (
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <MapPin className="h-4 w-4" style={{ color: organizationDetails?.brandColor || '#1e293b' }}/>
                      <span className="text-sm text-gray-700 capitalize">{jobDetails.location}</span>
                    </div>
                  )}
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <Clock className="h-4 w-4" style={{ color: organizationDetails?.brandColor || '#1e293b' }}/>
                      <span className="text-sm text-gray-700 capitalize">{jobDetails.workType?.toLowerCase() === 'onsite' ? 'In Office' : jobDetails.workType}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <Briefcase className="h-4 w-4" style={{ color: organizationDetails?.brandColor || '#1e293b' }}/>
                      <span className="text-sm text-gray-700 capitalize">{jobDetails.employmentType}</span>
                    </div>
                    {(jobDetails.salaryMin || jobDetails.salaryMax) && (
                      <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <Banknote className="h-4 w-4" style={{ color: organizationDetails?.brandColor || '#1e293b' }}/>
                        <span className="text-sm text-gray-700">
                          {jobDetails.salaryMin && jobDetails.salaryMax
                            ? `${jobDetails.salaryMin.toLocaleString()}-${jobDetails.salaryMax.toLocaleString()} ${jobDetails.salaryCurrency}`
                            : jobDetails.salaryMin
                            ? `${jobDetails.salaryMin.toLocaleString()}+ ${jobDetails.salaryCurrency}`
                            : `Up to ${jobDetails.salaryMax.toLocaleString()} ${jobDetails.salaryCurrency}`}
                          {' '}/{' '}{jobDetails.salaryPeriod}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="h-4 w-4" style={{ color: organizationDetails?.brandColor || '#1e293b' }}/>
                      <span className="text-sm text-gray-700">
                        Posted {new Date(jobDetails.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.requiredSkills.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-3 py-1 rounded-full text-sm font-medium border"
                          style={{ 
                            backgroundColor: `${organizationDetails?.brandColor}15`,
                            borderColor: `${organizationDetails?.brandColor}30`,
                            color: organizationDetails?.brandColor || '#1e293b'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Nice to Have</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.niceToHaveSkills.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-3 py-1 rounded-full text-sm font-medium border"
                          style={{ 
                            backgroundColor: `${organizationDetails?.brandColor}10`,
                            borderColor: `${organizationDetails?.brandColor}20`,
                            color: organizationDetails?.brandColor || '#1e293b'
                          }}
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

          {/* Main Content */}
          <div className="lg:col-span-2">
            {jobDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{jobDetails.description}</p>
                </div>
              </div>
            )}

            {isSubmitting ? (
              <LoadingSection />
            ) : isSubmitted ? (
              <SuccessMessage />
            ) : error === 'cv_duplication' ? (
              <AlreadyAppliedMessage />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
          

                  <h2 className="text-2xl font-semibold text-gray-900 mb-8">Apply Now</h2>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      {/* Enhanced Submission Type Selector */}
                 {/* Replace the Enhanced Submission Type Selector section with this code */}
<div className="space-y-3">
  <label className="block text-sm font-medium text-gray-700">
    Choose how you'd like to apply:
  </label>
  <div className="grid grid-cols-2 gap-2 md:gap-4">
    {/* Upload CV Option */}
    <button
      type="button"
      onClick={() => setSubmissionType('file')}
      className={`relative flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
        submissionType === 'file' 
          ? 'border-opacity-100 bg-opacity-10' 
          : 'border-gray-200 hover:border-opacity-50'
      }`}
      style={{ 
        borderColor: submissionType === 'file' ? organizationDetails?.brandColor || '#1e293b' : undefined,
        backgroundColor: submissionType === 'file' ? `${organizationDetails?.brandColor}10` || '#1e293b10' : undefined
      }}
    >
      <div 
        className="w-12 h-12 mb-3 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: `${organizationDetails?.brandColor}20` || '#1e293b20'
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke={organizationDetails?.brandColor || '#1e293b'}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-gray-900">Upload CV</p>
        <p className="text-sm text-gray-500">Submit your existing CV file</p>
      </div>
      {submissionType === 'file' && (
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: organizationDetails?.brandColor || '#1e293b'
          }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>

    {/* Write About Yourself Option */}
    <button
      type="button"
      onClick={() => setSubmissionType('text')}
      className={`relative flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
        submissionType === 'text' 
          ? 'border-opacity-100 bg-opacity-10' 
          : 'border-gray-200 hover:border-opacity-50'
      }`}
      style={{ 
        borderColor: submissionType === 'text' ? organizationDetails?.brandColor || '#1e293b' : undefined,
        backgroundColor: submissionType === 'text' ? `${organizationDetails?.brandColor}10` || '#1e293b10' : undefined
      }}
    >
      <div 
        className="w-12 h-12 mb-3 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: `${organizationDetails?.brandColor}20` || '#1e293b20'
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke={organizationDetails?.brandColor || '#1e293b'}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-gray-900">Write About Yourself</p>
        <p className="text-sm text-gray-500">Create your application here</p>
      </div>
      {submissionType === 'text' && (
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: organizationDetails?.brandColor || '#1e293b'
          }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  </div>
</div>

                      {submissionType === 'file' ? (
                    <div 
                      className={`mt-1 flex justify-center px-6 pt-10 pb-11 border-2 border-dashed rounded-lg transition-colors ${
                        dragActive ? 'border-opacity-100' : 'border-opacity-50'
                      }`}
                      style={{ 
                        borderColor: dragActive 
                          ? organizationDetails?.brandColor || '#1e293b'
                          : `${organizationDetails?.brandColor}50` || '#1e293b50',
                        backgroundColor: dragActive
                          ? `${organizationDetails?.brandColor}10` || '#1e293b10'
                          : `${organizationDetails?.brandColor}05` || '#1e293b05'
                      }}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {!filePreview ? (
                          <div className="space-y-2 text-center">
                          <div className="mx-auto h-12 w-12">
                            <svg
                              className="mx-auto h-12 w-12"
                              stroke={organizationDetails?.brandColor || '#1e293b'}
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
                            <label className="relative cursor-pointer rounded-md font-medium transition-colors">
                              <span style={{ color: organizationDetails?.brandColor || '#1e293b' }}>
                                Upload a file
                              </span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, DOC or DOCX up to 5MB</p>
                        </div>
                      ) : (
                            <div className="w-full">
                              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <svg 
                                      className="h-8 w-8" 
                                      fill="none" 
                                      stroke={organizationDetails?.brandColor || '#1e293b'}
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
                                <label
                                    className="text-sm font-medium transition-colors cursor-pointer"
                                    style={{ color: organizationDetails?.brandColor || '#1e293b' }}
                                  >
                                    Change
                                    <input
                                      type="file"
                                      className="sr-only"
                                      onChange={handleFileChange}
                                      accept=".pdf,.doc,.docx"
                                    />
                                  </label>
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
                            <div className="space-y-6">
                              {/* Contact Information Section */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                                
                                {/* Full Name */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                  </label>
                                  <input
                                    required
                                    type="text"
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2 focus:ring-opacity-20"
                                    style={{ 
                                      focusBorderColor: organizationDetails?.brandColor || '#1e293b',
                                      focusRingColor: `${organizationDetails?.brandColor}40` || '#1e293b40'
                                    }}
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    placeholder="Enter your full name"
                                  />
                                </div>
    
                                {/* Email */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                  </label>
                                  <input
                                    required
                                    type="email"
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2 focus:ring-opacity-20"
                                    style={{ 
                                      focusBorderColor: organizationDetails?.brandColor || '#1e293b',
                                      focusRingColor: `${organizationDetails?.brandColor}40` || '#1e293b40'
                                    }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="Enter your email address"
                                  />
                                </div>
    
                                {/* Phone Number */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number *
                                  </label>
                                  <input
                                    required
                                    type="tel"
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2 focus:ring-opacity-20"
                                    style={{ 
                                      focusBorderColor: organizationDetails?.brandColor || '#1e293b',
                                      focusRingColor: `${organizationDetails?.brandColor}40` || '#1e293b40'
                                    }}
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    placeholder="Enter your phone number"
                                  />
                                </div>
                              </div>
    
                              {/* About Yourself Section */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Tell us about yourself, your experience, and why you're a good fit for this role *
                                </label>
                                <textarea
                                  required
                                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2 focus:ring-opacity-20"
                                  style={{ 
                                    focusBorderColor: organizationDetails?.brandColor || '#1e293b',
                                    focusRingColor: `${organizationDetails?.brandColor}40` || '#1e293b40'
                                  }}
                                  rows="10"
                                  value={formData.cvText}
                                  onChange={(e) => setFormData({...formData, cvText: e.target.value})}
                                  placeholder="Include:
    - Your relevant work experience and achievements
    - Key skills and qualifications
    - Why you're interested in this role
    - Your notice period or availability to start"
                                />
                              </div>
                            </div>
                          )}

                      {/* Consents and Agreements */}
                      <div className="space-y-4 border-t border-gray-200 pt-6">
                        {/* Terms and Privacy Policy */}
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="terms"
                              name="terms"
                              type="checkbox"
                              required
                              checked={formData.terms}
                              onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                              className="h-4 w-4 rounded border-gray-300 text-gray-600 transition-colors focus:ring-2 focus:ring-offset-2"
                              style={{ 
                                accentColor: organizationDetails?.brandColor || '#1e293b',
                                focusRingColor: `${organizationDetails?.brandColor}40` || '#1e293b40'
                              }}
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="terms" className="text-sm text-gray-600">
                              I acknowledge that I have read and agree to the{' '}
                              <a 
                                href="https://www.rightcruiter.com/terms-of-use" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="font-medium underline hover:text-gray-800 transition-colors"
                                style={{ color: organizationDetails?.brandColor || '#1e293b' }}
                              >
                                Terms of Use
                              </a>
                              {' '}and{' '}
                              <a 
                                href="https://www.rightcruiter.com/privacy-policy" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="font-medium underline hover:text-gray-800 transition-colors"
                                style={{ color: organizationDetails?.brandColor || '#1e293b' }}
                              >
                                Privacy Policy
                              </a>
                              . I understand that my personal information will be processed in accordance with these policies. *
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors hover:opacity-90"
                      style={{ backgroundColor: organizationDetails?.brandColor || '#1e293b' }}
                    >
                      Submit Application
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        <PoweredByFooter/>
      </main>
    </div>
  );
};

export default JobApplication;