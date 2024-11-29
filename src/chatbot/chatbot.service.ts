import { Injectable, Logger } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class ChatbotService {
  private readonly hf: HfInference;
  private readonly logger = new Logger(ChatbotService.name);

  constructor() {
    this.hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
  }

  async processMessageWithAI(mensagem: string): Promise<string> {
    try {
      const result = await this.hf.textGeneration({
        model: 'EleutherAI/gpt-neo-1.3B',
        inputs: mensagem,
        parameters: { max_length: 300, temperature: 0.7 },
      });

      const cleanResponse = result.generated_text.replace(/\n/g, ' ');

      return cleanResponse;
    } catch (error) {
      this.logger.error(`Erro ao usar Hugging Face: ${error.message}`);
      return 'Desculpe, ocorreu um problema ao gerar a resposta.';
    }
  }
}
