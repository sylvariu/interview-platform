import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import {JwtGuard} from "../auth/guards/auth.guard";
import {GigachatService} from "../gigachat/gigachat.service";
import {SpeechService} from "../speech/speech.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Category} from "@prisma/client";

@UseGuards(JwtGuard)
@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService,
              private readonly gigachatService: GigachatService,
              private readonly speechService: SpeechService) {}

  @Get('test')
  async test() {
    return this.gigachatService.sendMessage([
      { role: 'user', content: 'Привет' },
    ]);
  }

  @Post('start')
  start(@Req() req: any, @Body('category', new ParseEnumPipe(Category)) category: Category) {
    return this.interviewService.startInterview(req.user.id, category);
  }

  @Get()
  getAllInterviews(@Req() req: any) {
    return this.interviewService.getUserInterviews(req.user.id);
  }

  @Post(':id/message')
  message(
      @Param('id') id: string,
      @Body() body: { text: string },
  ) {
    return this.interviewService.processAnswer(id, body.text);
  }

  @Post(':id/finish')
  finish(@Param('id') id: string) {
    return this.interviewService.finishInterview(id);
  }

  @Post(':id/audio')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
      @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File,
  ) {
    // 1. отправка в SaluteSpeech
    // 2. получение текста
    // 3. processAnswer
    if (!file) {
      return {error: 'Файл не передан'};
    }

    return this.interviewService.processAudio(id, file.buffer);

  }
    /*const audioBuffer = file.buffer;
    // 1. речь -> текст
    const userText = await this.speechService.speechToText(audioBuffer);
    // обработка молчания
    if (!userText) {
      return {
        aiText: 'Я не услышал ответ. Попробуйте ещё раз.',
      };
    }

    // 2. 🤖 Отправляем в интервью (Gigachat)
    const aiResponse = await this.interviewService.processAnswer(
        id,
        userText,
    );

    // 3. 🔊 Text-to-Speech
    const audio = await this.speechService.textToSpeech(aiResponse.aiText);

    return {
      userText,
      aiText: aiResponse.aiText,
      audio: audio.toString('base64'), // отправляем как base64
    };
  }*/

}
