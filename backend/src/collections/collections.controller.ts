import {Controller, Get, Req, Param, UseGuards, Post, Body, Patch, Delete, Query} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import {JwtGuard} from "../auth/guards/auth.guard";
import {CreateCollectionDto} from "./dto/create-collection.dto";
import {UpdateCollectionDto} from "./dto/update-collection.dto";
import {UpdateProblemCollectionDto} from "./dto/update-prob-collections.dto";

@Controller('collections')
@UseGuards(JwtGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get('collections-status')
  getCollectionsWithProblem(
      @Req() req,
      @Query('problemId') problemId: string
  ) {
    return this.collectionsService.getCollectionsWithProblem(
        req.user.id,
        problemId
    );
  }

  @Post('update-problem-collections')
  updateProblemCollections(
      @Req() req,
      @Body() dto: UpdateProblemCollectionDto
  ) {
    return this.collectionsService.updateProblemCollections(
        req.user.id,
        dto.problemId,
        dto.collectionIds
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.collectionsService.findAll(req.user.id);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Req() req) {
    return this.collectionsService.findById(id, req.user.id);
  }

  @Post()
  create(@Req() req, @Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(req.user.id, createCollectionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.collectionsService.delete(id, req.user.id);
  }


}
