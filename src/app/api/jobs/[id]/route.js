// src/app/api/jobs/[id]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const response = await fetch(`${process.env.API_URL}/jobs/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        // Add any other required headers
      },
    });

    if (!response.ok) {
      throw new Error('Job not found');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}