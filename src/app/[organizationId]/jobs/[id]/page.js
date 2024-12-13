// src/app/[organizationId]/jobs/[id]/page.js
import JobApplication from '../../../components/JobApplication';
import ApiService from '@/app/services/ApiService';

async function getJobData(params) {
  const { organizationId, id } =await params;
  
  try {
    const [organizationDetails, jobDetails] = await Promise.all([
      ApiService.getServerSideApi(`/organizations/${organizationId}`),
      ApiService.getServerSideApi(`/jobs/${id}`)
    ]);

    return { organizationDetails, jobDetails };
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { organizationDetails } = await getOrganizationData(params.organizationId);

  // Ensure we have fallback values for required fields
  const title = organizationDetails.name || 'Organization Profile';
  const description = organizationDetails.description || 'View all job openings';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: organizationDetails.logoUrl || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      siteName: title,
      type: 'website',
      locale: 'en_US',  // Add locale
    },
    // Add Twitter card metadata for better social sharing
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [organizationDetails.logoUrl || '/og-image.jpg'],
    }
  };
}
export default async function Page({ params }) {
  const initialData = await getJobData(params);
  return <JobApplication params={params} initialData={initialData} />;
}