import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import { NoteService } from './note.service';
import {UpdateNoteDto} from "./dto/update-note.dto";
import {JwtGuard} from "../auth/guards/auth.guard";

@UseGuards(JwtGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Req() req: any) {
    return this.noteService.create(req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.noteService.findAll(req.user.id);
  }

  @Get(':id')
  findById(@Req() req: any, @Param('id') id: string) {
    return this.noteService.findById(id, req.user.id);
  }

  @Patch(':id')
  update(
      @Req() req: any,
      @Param('id') id: string,
      @Body() dto: UpdateNoteDto,
  ) {
    return this.noteService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.noteService.delete(id, req.user.id);
  }
}
