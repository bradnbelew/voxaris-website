import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { LLMService } from './llm.service';

interface RetellRequest {
  response_id?: string;
  transcript?: { role: string; content: string }[];
  interaction_type: 'update_only' | 'response_required' | 'reminder_required';
}

interface RetellResponse {
  response_id?: string;
  content: string;
  content_complete: boolean;
  end_call: boolean;
  transfer_call?: string;
}

export class RetellSocketServer {
  private wss: WebSocketServer;
  private llmService: LLMService;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/llm-websocket' });
    this.llmService = new LLMService();
    this.init();
  }

  init() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('🔌 Retell LLM WebSocket Connected');

      // 1. Send Initial Config/Welcome (Optional)
      // ws.send(JSON.stringify({ response_id: "0", content: "Hello, this is the custom LLM backend.", content_complete: true, end_call: false }));

      ws.on('message', async (data: string) => {
        try {
          const request: RetellRequest = JSON.parse(data);

          if (request.interaction_type === 'update_only') {
             // Just logging transcript updates
             // console.log('Transcript Update:', request.transcript?.slice(-1)[0]);
             return;
          }

          if (request.interaction_type === 'response_required' || request.interaction_type === 'reminder_required') {
            // 2. Generate Response from LLM
            console.log('🤖 Generating Response...');
            const stream = await this.llmService.getResponse(request.transcript || []);
            
            // Handle Mock vs Real Stream
            if (!process.env.OPENAI_API_KEY) {
                // Mock Response
                 const res: RetellResponse = {
                    response_id: request.response_id,
                    content: "I am a mock agent. Add your OpenAI Key to the backend.",
                    content_complete: true,
                    end_call: false
                 };
                 ws.send(JSON.stringify(res));
                 return;
            }

            // Real Stream Handling (Simplified for non-streaming output first, typically you stream chunks)
            // For this implementation, let's assume we handle the stream chunks:
            let currentContent = "";
            let funcCall = null as any;
            let funcArgs = "";

            // @ts-ignore - Iterator 
            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta;
                if (!delta) continue;

                // Handle Tool Calls
                if (delta.tool_calls) {
                     const toolCall = delta.tool_calls[0];
                     if(toolCall.id) {
                         funcCall = { id: toolCall.id, name: toolCall.function?.name || "", arguments: "" };
                     } else {
                         funcArgs += toolCall.function?.arguments || "";
                     }
                }
                
                // Handle Content
                if (delta.content) {
                    currentContent += delta.content;
                    const res: RetellResponse = {
                        response_id: request.response_id,
                        content: delta.content,
                        content_complete: false,
                        end_call: false
                    };
                    ws.send(JSON.stringify(res));
                }
            }

            // Handle Function Execution (Post-Stream)
            if (funcCall && funcCall.name === 'end_call') {
                const args = JSON.parse(funcArgs);
                const res: RetellResponse = {
                    response_id: request.response_id,
                    content: args.message,
                    content_complete: true,
                    end_call: true
                };
                ws.send(JSON.stringify(res));
            } else {
                 // Final Content Complete signal
                 const res: RetellResponse = {
                    response_id: request.response_id,
                    content: "",
                    content_complete: true,
                    end_call: false
                };
                ws.send(JSON.stringify(res));
            }

          }

        } catch (error) {
          console.error('Error handling WS message:', error);
        }
      });

      ws.on('close', () => {
        console.log('👋 Retell LLM WebSocket Disconnected');
      });
    });
  }
}
