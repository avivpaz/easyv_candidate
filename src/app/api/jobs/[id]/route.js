export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const response = await fetch(`${process.env.API_URL}/jobs/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      // First try to get error message from response
      const errorData = await response.json().catch(() => null);
      
      throw new Error(
        errorData?.message || 
        `Request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Return the actual error message
    return NextResponse.json(
      { error: error.message || 'Failed to fetch job details' },
      { status: !response.ok ? response.status : 500 }
    );
  }
}