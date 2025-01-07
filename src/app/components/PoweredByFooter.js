const PoweredByFooter = () => {
    return (
      <div className="w-full py-4 mt-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Powered by{" "}
              <a
                href="https://www.rightcruiter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline transition-all"
              >
                RightCruiter
              </a>
            </p>
            <a
              href="https://rightcruiter.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:underline transition-all"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  export default PoweredByFooter;