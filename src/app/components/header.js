import { Calendar, MapPin, Check, Building2, Globe, Linkedin, Share2 } from 'lucide-react';
import { useState } from 'react';

const Header = ({ organizationDetails }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    };
  
  return (
    <header className="relative">
      {/* Banner Image */}
      <div className="w-full h-40 relative overflow-hidden">
        {organizationDetails?.bannerUrl && !bannerError ? (
          <>
            <div className="absolute inset-0 bg-slate-900/30 z-10" />
            <img 
              src={organizationDetails.bannerUrl}
              alt="Company banner"
              className="w-full h-full object-cover"
              onError={() => setBannerError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 animate-gradient-slow">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          </div>
        )}
      </div>
      {/* Company Info Card - Overlapping Banner */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-24 z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 items-start">
          {/* Logo Section */}
          {organizationDetails?.logoUrl ? (
            <div className="w-20 h-20 bg-white rounded-xl shadow-md border border-slate-100 p-3 flex items-center justify-center shrink-0">
              <img 
                src={organizationDetails.logoUrl} 
                alt={organizationDetails?.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-md flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold text-white">
                {organizationDetails?.name?.charAt(0)}
              </span>
            </div>
          )}

          {/* Company Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {organizationDetails?.name}
                </h1>
                {organizationDetails?.description && (
                  <p className="mt-2 text-slate-600 text-base leading-relaxed max-w-2xl">
                    {organizationDetails.description}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
              <div className="relative">
                  <button 
                    onClick={handleShare}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 
                      ${copied 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </>
                    )}
                  </button>
                </div>
             
              </div>
            </div>

            {/* Company Details */}
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">
              {organizationDetails?.website && (
                <a 
                  href={organizationDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </a>
              )}
            {organizationDetails?.linkedinUrl && (
                <a 
                  href={organizationDetails.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>Linkedin</span>
                </a>
              )}
           
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;