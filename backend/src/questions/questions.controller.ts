import {Body, Controller, Get, Param, ParseEnumPipe, Post, Put, Req, UseGuards} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {JwtGuard} from "../auth/guards/auth.guard";
import {CreateQuestionDto} from "./dto/create-question.dto";
import {Category} from "@prisma/client";
import {UpdateQuestionProgressDto} from "./dto/update-ques-progress";

@UseGuards(JwtGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.questionsService.create(dto);
  }

  @Get('topic/:id')
  findByTopic(@Param('id') id: string, @Req() req) {
    return this.questionsService.findByTopic(id, req.user.id);
  }

  @Get('category/:category')
  findByCategory(@Param('category', new ParseEnumPipe(Category)) category: Category, @Req() req) {
    return this.questionsService.findByCategory(category, req.user.id);
  }

  @Get('section/:id')
  getBySection(@Param('id') id: string, @Req() req) {
    return this.questionsService.getBySection(id, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.questionsService.findById(id, req.user.id);
  }

  @Put(':id/progress')
  async setProgress(
      @Param('id') questionId: string,
      @Body() dto: UpdateQuestionProgressDto,
      @Req() req,
  ) {
    return this.questionsService.setProgress(
        req.user.id,
        questionId,
        dto.status,
    );
  }

  @Get('sections/progress')
  getSectionsProgress(@Req() req) {
    return this.questionsService.getSectionsProgress(
        req.user.id
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.questionsService.findAll(req.user.id);
  }
}
