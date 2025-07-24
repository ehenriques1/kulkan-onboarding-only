import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Received webhook data:', data);

    const n8nWebhookUrl = 'https://kulkan.app.n8n.cloud/webhook/65de7c23-d156-4709-a4bc-8b78392d95a9';
    console.log('Forwarding to n8n webhook:', n8nWebhookUrl);

    const res = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    console.log('n8n response status:', res.status);
    
    const responseData = await res.json();
    console.log('n8n response data:', responseData);

    if (!res.ok) {
      console.error('n8n webhook error:', responseData);
      return NextResponse.json(
        { 
          error: 'n8n webhook error', 
          details: responseData,
          hint: 'Make sure your n8n workflow is active and the webhook URL is correct'
        },
        { status: res.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error forwarding to n8n webhook:', error);
    return NextResponse.json(
      { error: 'Failed to forward data to n8n', details: error },
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
    n8nWebhookUrl: 'https://kulkan.app.n8n.cloud/webhook/65de7c23-d156-4709-a4bc-8b78392d95a9',
    expectedFormat: {
      responses: 'Array of OnboardingResponse objects',
      sessionId: 'Optional session identifier'
    }
  })
} 