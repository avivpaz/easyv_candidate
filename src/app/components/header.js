import { Calendar, MapPin, Briefcase, Globe, Linkedin } from 'lucide-react';

const Header = ({ organizationDetails }) => {
    return (
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              {organizationDetails?.logoUrl ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-100 rounded-xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                  <div className="relative w-16 h-16 bg-white rounded-xl shadow-md border border-gray-100 p-2 flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                    <img 
                      src={organizationDetails.logoUrl} 
                      alt={organizationDetails?.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {organizationDetails?.name?.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {organizationDetails?.name}
                  </h1>
                  <div className="hidden sm:flex items-center gap-2">
                    {organizationDetails?.website && (
                      <a 
                        href={organizationDetails.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors duration-200"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        <span className="truncate">Website</span>
                      </a>
                    )}
                    {organizationDetails?.linkedinUrl && (
                      <a 
                        href={organizationDetails.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors duration-200"
                      >
                        <Linkedin className="h-4 w-4 mr-1" />
                        <span className="truncate">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
                {organizationDetails?.description && (
                  <p className="mt-1 text-gray-600 line-clamp-2 max-w-2xl">
                    {organizationDetails.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="sm:hidden flex gap-2">
              {organizationDetails?.website && (
                <a 
                  href={organizationDetails.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {organizationDetails?.linkedinUrl && (
                <a 
                  href={organizationDetails.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;