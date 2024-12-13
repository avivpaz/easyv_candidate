// src/app/[organizationId]/page.js
import OrganizationHome from '../components/OrganizationHome';
import ApiService from '@/app/services/ApiService';

async function getOrganizationData(organizationId) {
  try {
    const [organizationDetails, jobsData] = await Promise.all([
      ApiService.getServerSideApi(`/organizations/${organizationId}`),
      ApiService.getServerSideApi(`/organizations/${organizationId}/jobs`)
    ]);

    // Filter jobs with required fields
    const jobs = jobsData.jobs.filter(job => 
      job.title && job.description && job.location
    );

    return { organizationDetails, jobs };
  } catch (error) {
    console.error('Error fetching organization data:', error);
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { organizationDetails } = await getOrganizationData(params.organizationId);

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
  const initialData = await getOrganizationData(params.organizationId);
  return <OrganizationHome params={params} initialData={initialData} />;
}