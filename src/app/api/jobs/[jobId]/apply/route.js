// app/api/public/[organizationId]/jobs/[jobId]/apply/route.js
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    const {  jobId } =await params;
    
    if ( !jobId) {
      return NextResponse.json(
        { error: 'Organization ID and Job ID are required' },
        { status: 400 }
      );
    }
    
    try {
      const formData = await request.formData();
      
      const baseUrl = process.env.API_URL;
      const url = `${baseUrl}/public/jobs/${jobId}/apply`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
  
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
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }
  }