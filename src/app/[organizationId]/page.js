// src/app/[organizationId]/page.js
import OrganizationHome from '../components/OrganizationHome';
import ErrorPage from '@/app/components/ErrorPage';
import ApiService from '@/app/services/ApiService';

async function getOrganizationData(organizationId) {
    const [orgResponse, jobsResponse] = await Promise.all([
        ApiService.getServerSideApi(`/organizations/${organizationId}`),
        ApiService.getServerSideApi(`/organizations/${organizationId}/jobs`)
    ]);

    // Check for API errors
    if (orgResponse.error || jobsResponse.error) {
        return {
            error: true,
            status: orgResponse.error ? orgResponse.status : jobsResponse.status,
            message: orgResponse.error || jobsResponse.error
        };
    }

    // Filter jobs with required fields
    const jobs = jobsResponse.data.jobs.filter(job => 
        job.title && job.description && job.location
    );

    return {
        organizationDetails: orgResponse.data,
        jobs
    };
}

export async function generateMetadata({ params }) {
    const result = await getOrganizationData(params.organizationId);

    if (result.error) {
        return {
            title: 'Error',
            description: result.message
        };
    }

    const { organizationDetails } = result;
    
    return {
        title: organizationDetails.name,
        description: organizationDetails.description || 'View all job openings',
        openGraph: {
            title: organizationDetails.name,
            description: organizationDetails.description,
            images: [
                {
                    url: organizationDetails.logoUrl || '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: organizationDetails.name
                }
            ],
            siteName: organizationDetails.name,
            type: 'website',
        }
    };
}

export default async function Page({ params }) {
    const result = await getOrganizationData(params.organizationId);

    if (result.error) {
        return <ErrorPage status={result.status} message={result.message} />;
    }

    return <OrganizationHome params={params} initialData={result} />;
}
