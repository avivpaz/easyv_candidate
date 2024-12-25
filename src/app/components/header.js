import { Calendar, MapPin, Check, Building2, Globe, Linkedin, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const Header = ({ organizationDetails }) => {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_DESCRIPTION_LENGTH = 230;

    const handleShare = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    };

    const isDescriptionLong = organizationDetails?.description?.length > MAX_DESCRIPTION_LENGTH;
    
    const displayDescription = isDescriptionLong && !isExpanded
      ? `${organizationDetails.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`
      : organizationDetails.description;
  
    return (
      <header className="relative">
        {/* Banner Image */}
        <div className="w-full h-40 relative overflow-hidden">
          {organizationDetails?.bannerUrl ? (
            <>
              <div className="absolute inset-0" style={{ 
                backgroundColor: organizationDetails?.brandColor || '#1e293b',
                opacity: 0.9 
              }} />
              <img 
                src={organizationDetails.bannerUrl}
                alt="Company banner"
                className="w-full h-full object-cover"
              />
            </>
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: organizationDetails?.brandColor || '#1e293b' }}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}
        </div>
        {/* Company Info Card - Overlapping Banner */}
        <div className="max-w-7xl mx-auto px-6 relative -mt-24 z-20 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header Section with Logo and Title */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Logo */}
                {organizationDetails?.logoUrl ? (
                  <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                    <img 
                      src={organizationDetails.logoUrl} 
                      alt={organizationDetails?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-14 h-14 rounded-xl shadow-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: organizationDetails?.brandColor || '#1e293b' }}
                  >
                    <span className="text-3xl font-bold text-white">
                      {organizationDetails?.name?.charAt(0)}
                    </span>
                  </div>
                )}
                
                {/* Title */}
                <h1 className="text-2xl font-bold text-slate-900">
                  {organizationDetails?.name}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={handleShare}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 
                      ${copied 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-white hover:opacity-90'}`}
                    style={{ backgroundColor: copied ? undefined : organizationDetails?.brandColor || '#1e293b' }}
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

            {/* Description Section */}
            {organizationDetails?.description && (
              <div className="mt-4">
                <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                  {displayDescription}
                </p>
                {isDescriptionLong && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-sm font-medium text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        Show less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show more
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Company Links */}
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
      </header>
    );
};

export default Header;