import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const res = await fetch('https://kulkan.app.n8n.cloud/webhook/65de7c23-d156-4709-a4bc-8b78392d95a9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error forwarding to n8n webhook:', error);
    return NextResponse.json(
      { error: 'Failed to forward data to n8n' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook testing
export async function GET() {
  return NextResponse.json({
    message: 'Onboarding webhook endpoint is active',
    endpoint: '/api/webhook/onboarding',
    method: 'POST',
    expectedFormat: {
      responses: 'Array of OnboardingResponse objects',
      sessionId: 'Optional session identifier'
    }
  })
} 