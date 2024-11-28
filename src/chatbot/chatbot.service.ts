import { Injectable, Logger } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class ChatbotService {
  private openai: OpenAIApi;
  private readonly logger = new Logger(ChatbotService.name);

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async processMessageWithAI(mensagem: string): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um assistente amigável e útil.' },
          { role: 'user', content: mensagem },
        ],
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      if (error.response && error.response.status === 429) {
        this.logger.warn(
          'Limite de requisições excedido para a API OpenAI. O usuário deve tentar novamente mais tarde.',
        );

        return 'Limite de requisições excedido. Por favor, tente novamente mais tarde.';
      }

      this.logger.error(
        'Erro ao conectar com a API OpenAI: ' + error.message,
        error.stack,
      );

      return 'Desculpe, ocorreu um problema ao gerar a resposta. Tente novamente mais tarde.';
    }
  }
}
