import {Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { CompletedService } from './completed.service';
import {JwtGuard} from "../auth/guards/auth.guard";

@Controller('completed')
@UseGuards(JwtGuard)
export class CompletedController {
  constructor(private readonly completedService: CompletedService) {}

  @Get()
  getCompleted(@Req() req) {
    return this.completedService.getCompleted(req.user.id);
  }

  @Post(':problemId')
  toggleCompleted(@Param('problemId') problemId: string, @Req() req) {
    return this.completedService.toggleCompleted(req.user.id, problemId);
  }

  @Get('progress')
  getProgress(@Req() req) {
    return this.completedService.getProgress(req.user.id);
  }

  @Get(':problemId')
  isCompleted(@Param('problemId') problemId: string, @Req() req) {
    return this.completedService.isCompleted(req.user.id, problemId);
  }
}
