import OpenAI from 'openai';

export class LLMService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'mock-key',
    });
  }

  // Define tools/functions
  private getTools() {
    return [
      {
        type: 'function' as const,
        function: {
          name: 'end_call',
          description: 'End the call only when user explicitly requests it.',
          parameters: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'The message you will say before ending the call with the customer.',
              },
            },
            required: ['message'],
          },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'book_appointment',
          description: 'Book an appointment for the customer.',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Customer name' },
              time: { type: 'string', description: 'Appointment time (ISO or human readable)' },
              reason: { type: 'string', description: 'Reason for appointment' }
            },
            required: ['name', 'time', 'reason']
          }
        }
      }
    ];
  }

  async getResponse(messages: any[]) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.log('Mocking LLM Response (No API Key)');
            return {
                content: "I am a mock AI agent. Please configure your OpenAI API Key to chat for real.",
                tool_calls: []
            };
        }

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: messages,
            tools: this.getTools(),
            tool_choice: 'auto',
            stream: true, // Streaming for lower latency
        });

        return completion; // Return the stream directly
    } catch (error) {
        console.error('Error in LLM Service:', error);
        throw error;
    }
  }
}
