import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import {GigachatService} from "../gigachat/gigachat.service";
import {SpeechService} from "../speech/speech.service";

@Module({
  controllers: [InterviewController],
  providers: [InterviewService, GigachatService, SpeechService],
})
export class InterviewModule {}
