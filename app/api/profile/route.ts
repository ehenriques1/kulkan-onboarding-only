import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Fetch profile data from n8n
    const n8nWebhookUrl = "https://kulkan.app.n8n.cloud/webhook/6b17aa67-65cf-459c-9b80-1696dc6b4a2f";
    
    const res = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        sessionId, 
        action: 'getProfile',
        history: [] 
      }),
    });

    if (!res.ok) {
      console.error('n8n profile fetch error:', res.status);
      return NextResponse.json(
        { error: 'Failed to fetch profile data' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { sessionId, profileData } = data;

    if (!sessionId || !profileData) {
      return NextResponse.json(
        { error: 'Session ID and profile data are required' },
        { status: 400 }
      );
    }

    // Submit updated profile data to n8n
    const n8nWebhookUrl = "https://kulkan.app.n8n.cloud/webhook/6b17aa67-65cf-459c-9b80-1696dc6b4a2f";
    
    const res = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        sessionId, 
        action: 'submitProfile',
        profileData 
      }),
    });

    if (!res.ok) {
      console.error('n8n profile submission error:', res.status);
      return NextResponse.json(
        { error: 'Failed to submit profile data' },
        { status: res.status }
      );
    }

    const responseData = await res.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error submitting profile:', error);
    return NextResponse.json(
      { error: 'Failed to submit profile data' },
      { status: 500 }
    );
  }
} 