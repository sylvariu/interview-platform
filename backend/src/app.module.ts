import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CompletedModule } from './completed/completed.module';
import { CollectionsModule } from './collections/collections.module';
import { InterviewModule } from './interview/interview.module';
import { GigachatService } from './gigachat/gigachat.service';
import { SpeechService } from './speech/speech.service';
import { NoteModule } from './note/note.module';
import { QuestionsModule } from './questions/questions.module';
import { TopicModule } from "./topic/topic.module";

@Module({
  controllers: [AppController],
  providers: [AppService, GigachatService, SpeechService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //чтобы конфигурация была глобальной
    }),
    PrismaModule,
    AuthModule,
    ProblemsModule,
    FavoritesModule,
    CompletedModule,
    CollectionsModule,
    InterviewModule,
    NoteModule,
    QuestionsModule,
    TopicModule,
  ],
})
export class AppModule {}
