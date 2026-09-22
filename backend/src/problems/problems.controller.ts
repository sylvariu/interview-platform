import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import {CreateProblemDto} from "./dto/create-problem.dto";
import {Roles} from "../auth/decorators/roles.decorator";
import {Role} from "@prisma/client";
import {RolesGuard} from "../auth/guards/roles.guard";
import {JwtGuard} from "../auth/guards/auth.guard";

@UseGuards(JwtGuard, RolesGuard)
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  findAll() {
    return this.problemsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.problemsService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateProblemDto) {
    return this.problemsService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateProblemDto) {
    return this.problemsService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.problemsService.delete(id);
  }

}
