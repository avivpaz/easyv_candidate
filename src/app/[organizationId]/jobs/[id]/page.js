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
  const { organizationDetails, jobDetails } = await getJobData(params);

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
  const initialData = await getJobData(params);
  return <JobApplication params={params} initialData={initialData} />;
}