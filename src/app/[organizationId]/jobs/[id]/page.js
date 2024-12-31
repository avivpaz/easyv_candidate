import JobApplication from '../../../components/JobApplication';
import ErrorPage from '@/app/components/ErrorPage';
import ApiService from '@/app/services/ApiService';

async function getJobData(params) {
    const { organizationId, id } = await params;
    
    const [orgResponse, jobResponse] = await Promise.all([
        ApiService.getServerSideApi(`/organizations/${organizationId}`),
        ApiService.getServerSideApi(`/jobs/${id}`)
    ]);

    if (orgResponse.error || jobResponse.error) {
        return {
            error: true,
            status: orgResponse.error ? orgResponse.status : jobResponse.status,
            message: orgResponse.error || jobResponse.error
        };
    }

    return {
        organizationDetails: orgResponse.data,
        jobDetails: jobResponse.data
    };
}

export async function generateMetadata({ params }) {
    const result = await getJobData(params);

    if (result.error) {
        return {
            title: 'Error',
            description: result.message
        };
    }

    const { organizationDetails, jobDetails } = result;

    return {
        title: `${jobDetails.title} at ${organizationDetails.name}`,
        description: jobDetails.description,
        openGraph: {
            title: `${jobDetails.title} at ${organizationDetails.name}`,
            description: `${jobDetails.workType} ${jobDetails.employmentType} position in ${jobDetails.location}. Required Skills: ${jobDetails.requiredSkills.join(', ')}`,
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
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${jobDetails.title} at ${organizationDetails.name}`,
            description: jobDetails.description,
            images: [organizationDetails.logoUrl || '/og-image.jpg'],
        }
    };
}

export default async function Page({ params }) {
    const result = await getJobData(params);

    if (result.error) {
        return <ErrorPage status={result.status} message={result.message} />;
    }

    return <JobApplication params={params} initialData={result} />;
}