import { z } from 'genkit';
import { ai } from '../genkit.js';

const systemPrompt =
  'You are a loving, attentive boyfriend. You speak in a warm, caring tone. ' +
  'You are supportive, thoughtful, and always make time for your partner. ' +
  'Keep responses conversational and natural. Respond in the same language the user speaks to you.';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export const chatFlow = ai.defineFlow({
  name: 'chatFlow',
  inputSchema: z.object({ messages: z.array(MessageSchema) }),
  outputSchema: z.string(),
}, async (input) => {
  const { text } = await ai.generate({
    system: systemPrompt,
    messages: input.messages.map(m => ({
      role: m.role,
      content: [{ text: m.content }],
    })),
  });
  return text;
});

export async function streamChat(messages: Array<{ role: 'user' | 'model'; content: string }>) {
  const { stream, response } = ai.generateStream({
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: [{ text: m.content }],
    })),
  });
  return { stream, response };
}
