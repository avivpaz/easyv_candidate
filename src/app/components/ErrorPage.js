export default function ErrorPage({ status, message }) {
    const getErrorTitle = (status) => {
        switch (status) {
            case 404:
                return 'Page Not Found';
            case 403:
                return 'Access Denied';
            case 500:
                return 'Server Error';
            default:
                return 'Error';
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16">
            <div className="text-center">
                <p className="text-base font-semibold text-indigo-600">{status}</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
                    {getErrorTitle(status)}
                </h1>
                <p className="mt-4 text-base text-gray-500">{message}</p>
                <div className="mt-8">
                    <a
                        href="/"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Back to home
                    </a>
                </div>
            </div>
        </div>
    );
}