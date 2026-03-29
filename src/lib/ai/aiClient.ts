export async function callAIEndpoint(endpoint: string, payload: object) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();

    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      throw new Error(raw || 'Invalid JSON response from AI endpoint');
    }

    if (!response.ok || data?.error) {
      console.error('API Route Error:', {
        error: data?.error,
        details: data?.details,
        raw,
      });
      throw new Error(
        data?.details || data?.error || raw || `Request failed: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

