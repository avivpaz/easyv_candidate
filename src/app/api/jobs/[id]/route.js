export async function GET(request, { params }) {
  const { id } = await params;
  
  const url = `${process.env.API_URL}/jobs/${id}`;
  console.log('Fetching URL:', url); // Log the complete URL
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      throw new Error(
        errorData?.message || 
        `Request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch job details' },
      { status: !response.ok ? response.status : 500 }
    );
  }
}