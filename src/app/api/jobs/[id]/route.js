import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  // Since we're in an async function, we need to await params
  // But we shouldn't await params directly, instead await the value we need
  const { id } = await params;  // Await params before destructuring

  if (!id) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    );
  }
  
  const baseUrl = process.env.API_URL
  const url = `${baseUrl}/jobs/${id}`;
  console.log('Fetching URL:', url);
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Response:', errorData);
      
      return NextResponse.json(
        { error: errorData?.message || `Request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    
    return NextResponse.json(
      { error: url },
      { status: 500 }
    );
  }
}