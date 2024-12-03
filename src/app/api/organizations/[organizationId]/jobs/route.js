// app/api/public/[organizationId]/jobs/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { organizationId } =await params;
    const searchParams = request.nextUrl.searchParams;
    
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }
    
    const baseUrl = process.env.API_URL;
    const url = `${baseUrl}/public/organizations/${organizationId}/jobs?${searchParams.toString()}`;
    
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
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
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
  }