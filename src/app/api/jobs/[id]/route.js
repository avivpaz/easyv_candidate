export async function GET(request, { params }) {
  const { id } = params;  // Remove await since params is not a promise
  
  const url = `${process.env.API_URL}/jobs/${id}`;
  console.log('Fetching URL:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Response:', errorData); // Add logging
      
      return NextResponse.json(
        { error: errorData?.message || `Request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch Error:', error); // Add logging
    
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}