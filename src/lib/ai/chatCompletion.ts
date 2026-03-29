import { headers } from 'next/headers';
import { callAIEndpoint } from './aiClient';

async function getBaseUrl() {
  const h = await headers();
  const host = h.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  if (!host) {
    throw new Error('Could not determine host for AI endpoint');
  }

  return `${protocol}://${host}`;
}

export async function getChatCompletion(
  provider: string,
  model: string,
  messages: object[],
  parameters: object = {}
) {
  const baseUrl = await getBaseUrl();
  const endpoint = `${baseUrl}/api/ai/chat-completion`;

  return callAIEndpoint(endpoint, {
    provider,
    model,
    messages,
    stream: false,
    parameters,
  });
}

export async function getStreamingChatCompletion(
  provider: string,
  model: string,
  messages: object[],
  onChunk: (chunk: any) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  parameters: object = {}
) {
  try {
    const baseUrl = await getBaseUrl();
    const endpoint = `${baseUrl}/api/ai/chat-completion`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, model, messages, stream: true, parameters }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `HTTP error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk' && data.chunk) onChunk(data.chunk);
            else if (data.type === 'done') onComplete();
            else if (data.type === 'error') onError(new Error(data.error));
          } catch {
            // ignore invalid JSON chunks
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Streaming error'));
  }
}
