// app/api/organizations/[organizationId]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { organizationId } = await params;
    
    if (!organizationId) {
        return NextResponse.json(
            { error: 'Organization ID is required' },
            { status: 400 }
        );
    }
    
    const baseUrl = process.env.API_URL;
    if (!baseUrl) {
        return NextResponse.json(
            { error: 'API URL configuration is missing' },
            { status: 500 }
        );
    }

    const url = `${baseUrl}/public/organizations/${organizationId}`;
    
    try {
        const response = await fetch(url, {
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const status = response.status;
            
            // Handle specific error cases
            if (status === 404) {
                return NextResponse.json(
                    { error: 'Organization not found' },
                    { status: 404 }
                );
            }
            
            if (status === 403) {
                return NextResponse.json(
                    { error: 'Access to organization denied' },
                    { status: 403 }
                );
            }
            
            return NextResponse.json(
                { error: errorData?.message || `Request failed with status ${status}` },
                { status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Fetch Error:', error);
        
        // Handle timeout errors specifically
        if (error.name === 'TimeoutError') {
            return NextResponse.json(
                { error: 'Request timed out' },
                { status: 504 }
            );
        }
        
        return NextResponse.json(
            { error: 'Failed to fetch organization details' },
            { status: 500 }
        );
    }
}
